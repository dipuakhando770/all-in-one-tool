// Browser-side background removal using U2-Net (u2netp) via ONNX Runtime Web loaded from CDN.
// Model: edgetools/u2netp (Apache-2.0), ~4.4 MB, runs fully in-browser.

export type ProgressCallback = (fraction: number) => void;

const MODEL_URL = "https://huggingface.co/edgetools/u2netp/resolve/main/u2netp.onnx";
const ORT_CDN = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.1/dist/";
const ORT_SCRIPT = `${ORT_CDN}ort.min.js`;

let sessionPromise: Promise<any> | null = null;

function loadOrtScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w.ort) return resolve(w.ort);
    const existing = document.querySelector(`script[src="${ORT_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(w.ort));
      existing.addEventListener("error", reject);
      return;
    }
    const s = document.createElement("script");
    s.src = ORT_SCRIPT;
    s.async = true;
    s.onload = () => resolve(w.ort);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function loadModel(onProgress?: ProgressCallback) {
  if (sessionPromise) return sessionPromise;
  sessionPromise = (async () => {
    const ort = await loadOrtScript();
    ort.env.wasm.wasmPaths = ORT_CDN;
    const res = await fetch(MODEL_URL);
    if (!res.ok || !res.body) throw new Error("Failed to download model");
    const reader = res.body.getReader();
    const total = Number(res.headers.get("content-length")) || 0;
    const chunks: Uint8Array[] = [];
    let received = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.length;
        if (total > 0) onProgress?.(received / total);
      }
    }
    const buffer = new Uint8Array(received);
    let pos = 0;
    for (const c of chunks) {
      buffer.set(c, pos);
      pos += c.length;
    }
    const session = await ort.InferenceSession.create(buffer.buffer, {
      executionProviders: ["wasm"],
    });
    return session;
  })();
  sessionPromise.catch(() => {
    sessionPromise = null;
  });
  return sessionPromise;
}

async function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function preprocess(img: HTMLImageElement): Float32Array {
  const size = 320;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  const mean = [0.485, 0.456, 0.406];
  const std = [0.229, 0.224, 0.225];
  const out = new Float32Array(3 * size * size);
  for (let i = 0; i < size * size; i++) {
    const r = data[i * 4] / 255;
    const g = data[i * 4 + 1] / 255;
    const b = data[i * 4 + 2] / 255;
    out[i] = (r - mean[0]) / std[0];
    out[size * size + i] = (g - mean[1]) / std[1];
    out[2 * size * size + i] = (b - mean[2]) / std[2];
  }
  return out;
}

export async function removeBackground(file: File, onProgress?: ProgressCallback): Promise<string> {
  const img = await fileToImage(file);
  const origW = img.width;
  const origH = img.height;

  const session = await loadModel(onProgress);
  const ort = (window as any).ort;
  const input = preprocess(img);
  const tensor = new ort.Tensor("float32", input, [1, 3, 320, 320]);
  const feeds: Record<string, any> = {};
  const inputName = session.inputNames[0];
  feeds[inputName] = tensor;
  const results = await session.run(feeds);
  const outputName = session.outputNames[0];
  const outTensor = results[outputName];
  const outData = outTensor.data as Float32Array;

  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < outData.length; i++) {
    if (outData[i] < min) min = outData[i];
    if (outData[i] > max) max = outData[i];
  }
  const range = max - min || 1;

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = 320;
  maskCanvas.height = 320;
  const mctx = maskCanvas.getContext("2d")!;
  const maskImg = mctx.createImageData(320, 320);
  for (let i = 0; i < 320 * 320; i++) {
    const v = Math.round(((outData[i] - min) / range) * 255);
    maskImg.data[i * 4] = v;
    maskImg.data[i * 4 + 1] = v;
    maskImg.data[i * 4 + 2] = v;
    maskImg.data[i * 4 + 3] = 255;
  }
  mctx.putImageData(maskImg, 0, 0);

  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = origW;
  resizedCanvas.height = origH;
  const rctx = resizedCanvas.getContext("2d")!;
  rctx.drawImage(maskCanvas, 0, 0, origW, origH);
  const resized = rctx.getImageData(0, 0, origW, origH);

  const outCanvas = document.createElement("canvas");
  outCanvas.width = origW;
  outCanvas.height = origH;
  const octx = outCanvas.getContext("2d")!;
  octx.drawImage(img, 0, 0);
  const imgData = octx.getImageData(0, 0, origW, origH);
  for (let i = 0; i < origW * origH; i++) {
    imgData.data[i * 4 + 3] = resized.data[i * 4];
  }
  octx.putImageData(imgData, 0, 0);

  return outCanvas.toDataURL("image/png");
}
