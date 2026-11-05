"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import JSZip from "jszip";
import {
  Play,
  Download,
  Folder,
  FileCode,
  Plus,
  Trash2,
  Terminal,
  RefreshCw,
  Maximize2,
  Minimize2,
  Save,
} from "lucide-react";

type Locale = "en" | "bn";

interface EditorFile {
  id: string;
  name: string;
  language: "html" | "css" | "javascript" | "json";
  content: string;
}

const DEFAULT_FILES: EditorFile[] = [
  {
    id: "index-html",
    name: "index.html",
    language: "html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Hello, World!</h1>
    <p>Welcome to NASIR TOOLS Code Editor</p>
    <button id="clickMe">Click Me</button>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
  },
  {
    id: "style-css",
    name: "style.css",
    language: "css",
    content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  background: white;
  padding: 2rem 3rem;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

p {
  color: #666;
  margin-bottom: 1.5rem;
}

button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}`,
  },
  {
    id: "script-js",
    name: "script.js",
    language: "javascript",
    content: `// Your JavaScript code here
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('clickMe');
  let clickCount = 0;
  
  button.addEventListener('click', () => {
    clickCount++;
    button.textContent = \`Clicked \${clickCount} time\${clickCount !== 1 ? 's' : ''}\`;
    console.log('Button clicked!', clickCount);
  });
  
  console.log('App initialized!');
});`,
  },
];

const STORAGE_KEY = "nasir-tools-code-editor-files";

const translations = {
  en: {
    files: "Files",
    preview: "Preview",
    console: "Console",
    run: "Run",
    export: "Export ZIP",
    newFile: "New File",
    deleteFile: "Delete",
    clear: "Clear",
    refresh: "Refresh",
    maximize: "Maximize",
    minimize: "Minimize",
    fileName: "File name",
    create: "Create",
    cancel: "Cancel",
    autoSave: "Auto-saved",
    noOutput: "Click 'Run' to see the preview",
    ready: "Ready",
  },
  bn: {
    files: "ফাইল",
    preview: "প্রিভিউ",
    console: "কনসোল",
    run: "চালান",
    export: "ZIP এক্সপোর্ট",
    newFile: "নতুন ফাইল",
    deleteFile: "মুছুন",
    clear: "মুছুন",
    refresh: "রিফ্রেশ",
    maximize: "বড় করুন",
    minimize: "ছোট করুন",
    fileName: "ফাইলের নাম",
    create: "তৈরি করুন",
    cancel: "বাতিল",
    autoSave: "স্বয়ং-সেভ হয়েছে",
    noOutput: "প্রিভিউ দেখতে 'চালান' এ ক্লিক করুন",
    ready: "প্রস্তুত",
  },
};

export function CodeEditorUI({ locale }: { locale: Locale }) {
  const t = translations[locale];
  const [files, setFiles] = useState<EditorFile[]>(DEFAULT_FILES);
  const [activeFileId, setActiveFileId] = useState<string>("index-html");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [previewKey, setPreviewKey] = useState(0);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const initialLoadDone = useRef(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  // Load files from localStorage on mount (delayed to avoid cascading renders)
  useEffect(() => {
    if (typeof window !== "undefined" && !initialLoadDone.current) {
      initialLoadDone.current = true;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTimeout(() => setFiles(parsed), 0);
          }
        } catch (e) {
          console.error("Failed to load saved files:", e);
        }
      }
    }
  }, []);

  // Save files to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined" && files !== DEFAULT_FILES && initialLoadDone.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
      const statusTimer = setTimeout(() => setAutoSaveStatus(t.autoSave), 0);
      const clearTimer = setTimeout(() => setAutoSaveStatus(""), 2000);
      return () => {
        clearTimeout(statusTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [files, t.autoSave]);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const updateFileContent = useCallback((content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content } : f))
    );
  }, [activeFileId]);

  const getLanguage = (fileName: string): string => {
    if (fileName.endsWith(".html")) return "html";
    if (fileName.endsWith(".css")) return "css";
    if (fileName.endsWith(".js")) return "javascript";
    if (fileName.endsWith(".json")) return "json";
    return "plaintext";
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const generatePreviewHTML = useCallback(() => {
    const htmlFile = files.find((f) => f.name === "index.html");
    const cssFile = files.find((f) => f.name === "style.css");
    const jsFile = files.find((f) => f.name === "script.js");

    let html = htmlFile?.content || "";

    // Inline CSS
    if (cssFile) {
      html = html.replace(
        /<link[^>]*href=["']style\.css["'][^>]*>/gi,
        `<style>${cssFile.content}</style>`
      );
    }

    // Inline JS with console capture
    if (jsFile) {
      const capturedJs = `
        <script>
          // Capture console output
          (function() {
            const originalConsole = { ...console };
            const output = [];
            
            ['log', 'error', 'warn', 'info'].forEach(method => {
              console[method] = function(...args) {
                const message = args.map(a => 
                  typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
                ).join(' ');
                window.parent.postMessage({ type: 'console', method, message }, '*');
                originalConsole[method].apply(console, args);
              };
            });
            
            // Capture errors
            window.onerror = function(msg, url, line, col, error) {
              window.parent.postMessage({ 
                type: 'console', 
                method: 'error', 
                message: msg + ' (line ' + line + ')' 
              }, '*');
              return false;
            };
          })();
        </script>
        <script>${jsFile.content}</script>
      `;
      html = html.replace(
        /<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi,
        capturedJs
      );
    }

    return html;
  }, [files]);

  const runCode = useCallback(() => {
    setConsoleOutput([]);
    setPreviewKey((k) => k + 1);
  }, []);

  const handleIframeMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === "console") {
      const timestamp = new Date().toLocaleTimeString();
      const prefix = event.data.method === "error" ? "❌" : 
                     event.data.method === "warn" ? "⚠️" : "›";
      setConsoleOutput((prev) => [...prev, `[${timestamp}] ${prefix} ${event.data.message}`]);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, [handleIframeMessage]);

  const exportZip = async () => {
    const zip = new JSZip();
    
    files.forEach((file) => {
      zip.file(file.name, file.content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const createNewFile = () => {
    if (!newFileName.trim()) return;
    
    const language = getLanguage(newFileName) as EditorFile["language"];
    
    const newFile: EditorFile = {
      id: `file-${Date.now()}`,
      name: newFileName,
      language: language as "html" | "css" | "javascript" | "json",
      content: "",
    };
    
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setNewFileName("");
    setShowNewFileDialog(false);
  };

  const deleteFile = (fileId: string) => {
    if (files.length <= 1) return; // Don't delete the last file
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (activeFileId === fileId) {
      setActiveFileId(files[0].id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[600px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
          >
            <Play size={16} />
            {t.run}
          </button>
          <button
            onClick={exportZip}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium transition-all hover:bg-[var(--surface-2)]"
          >
            <Download size={16} />
            {t.export}
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          {autoSaveStatus && (
            <span className="flex items-center gap-1">
              <Save size={14} />
              {autoSaveStatus}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - File Explorer */}
        <div className="w-48 shrink-0 border-r border-[var(--border)] bg-[var(--elevated)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              <Folder size={14} />
              {t.files}
            </span>
            <button
              onClick={() => setShowNewFileDialog(true)}
              className="rounded p-1 transition-colors hover:bg-[var(--surface-2)]"
              title={t.newFile}
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="p-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={`group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors ${
                  activeFileId === file.id
                    ? "bg-[var(--primary-subtle)] text-[var(--primary)]"
                    : "hover:bg-[var(--surface-2)]"
                }`}
                onClick={() => setActiveFileId(file.id)}
              >
                <span className="flex items-center gap-2 truncate">
                  <FileCode size={14} />
                  <span className="truncate">{file.name}</span>
                </span>
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    title={t.deleteFile}
                  >
                    <Trash2 size={12} className="text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[var(--border)] bg-[var(--elevated)] px-2">
            {files.map((file) => (
              <button
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={`flex items-center gap-2 rounded-t-lg px-3 py-2 text-sm transition-colors ${
                  activeFileId === file.id
                    ? "bg-[var(--surface)]"
                    : "hover:bg-[var(--surface-2)]"
                }`}
              >
                <FileCode size={14} />
                {file.name}
                {activeFileId === file.id && (
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                )}
              </button>
            ))}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={activeFile?.language || "html"}
              value={activeFile?.content || ""}
              onChange={(value) => updateFileContent(value || "")}
              onMount={handleEditorMount}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                minimap: { enabled: true },
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 2,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>

        {/* Preview & Console Panel */}
        <div
          className={`flex shrink-0 flex-col border-l border-[var(--border)] transition-all ${
            isPreviewMaximized ? "w-full" : "w-[45%]"
          }`}
        >
          {/* Preview Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--elevated)] px-3 py-2">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              <Play size={14} />
              {t.preview}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={runCode}
                className="rounded p-1 transition-colors hover:bg-[var(--surface-2)]"
                title={t.refresh}
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsPreviewMaximized(!isPreviewMaximized)}
                className="rounded p-1 transition-colors hover:bg-[var(--surface-2)]"
                title={isPreviewMaximized ? t.minimize : t.maximize}
              >
                {isPreviewMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>
          </div>

          {/* Preview iframe */}
          <div className="flex-1 overflow-hidden bg-white">
            <iframe
              key={previewKey}
              ref={iframeRef}
              srcDoc={generatePreviewHTML()}
              className="h-full w-full border-0"
              sandbox="allow-scripts allow-modals"
              title="Preview"
            />
          </div>

          {/* Console */}
          <div className="h-40 shrink-0 border-t border-[var(--border)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--elevated)] px-3 py-1.5">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  <Terminal size={14} />
                  {t.console}
                </span>
                <button
                  onClick={() => setConsoleOutput([])}
                  className="rounded px-2 py-0.5 text-xs transition-colors hover:bg-[var(--surface-2)]"
                >
                  {t.clear}
                </button>
              </div>
              <div className="h-[calc(100%-32px)] overflow-auto bg-[#1e1e1e] p-2 font-mono text-xs text-gray-300">
                {consoleOutput.length === 0 ? (
                  <span className="text-gray-500">{t.ready}</span>
                ) : (
                  consoleOutput.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>
        </div>
      </div>

      {/* New File Dialog */}
      {showNewFileDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">{t.newFile}</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder={locale === "bn" ? "যেমন: app.js" : "e.g., app.js"}
              className="mb-4 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-subtle)]"
              onKeyDown={(e) => e.key === "Enter" && createNewFile()}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewFileDialog(false)}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface-2)]"
              >
                {t.cancel}
              </button>
              <button
                onClick={createNewFile}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                {t.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
