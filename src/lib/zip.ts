import JSZip from "jszip";

export async function createZip(files: { name: string; data: Blob | Uint8Array | string }[]): Promise<string> {
  const zip = new JSZip();
  const seen = new Set<string>();
  for (const f of files) {
    let name = f.name;
    if (seen.has(name)) {
      const dot = name.lastIndexOf(".");
      const base = dot > 0 ? name.slice(0, dot) : name;
      const ext = dot > 0 ? name.slice(dot) : "";
      let i = 1;
      while (seen.has(`${base} (${i})${ext}`)) i++;
      name = `${base} (${i})${ext}`;
    }
    seen.add(name);
    zip.file(name, f.data as any);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.readAsDataURL(blob);
  });
}
