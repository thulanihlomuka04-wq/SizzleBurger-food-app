import React, { useState } from 'react';
import {
  FileCode,
  FolderTree,
  Copy,
  Check,
  Search,
  Layers,
  Terminal,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { KOTLIN_PROJECT_FILES, KotlinCodeFile } from '../data/kotlinSourceCode';

interface CodeExplorerProps {
  initialFileId?: string;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ initialFileId }) => {
  const [selectedFileId, setSelectedFileId] = useState<string>(
    initialFileId || KOTLIN_PROJECT_FILES[0].id
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fileFilter, setFileFilter] = useState('');

  const currentFile =
    KOTLIN_PROJECT_FILES.find((f) => f.id === selectedFileId) || KOTLIN_PROJECT_FILES[0];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const fullBundle = KOTLIN_PROJECT_FILES.map(
      (f) => `// ==========================================\n// FILE: ${f.path}\n// ==========================================\n\n${f.code}\n\n`
    ).join('\n');
    navigator.clipboard.writeText(fullBundle);
    setCopiedId('ALL');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredFiles = KOTLIN_PROJECT_FILES.filter(
    (f) =>
      f.filename.toLowerCase().includes(fileFilter.toLowerCase()) ||
      f.path.toLowerCase().includes(fileFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-semibold text-slate-300">Android Studio Iguana Project Explorer</span>
          <span className="text-slate-600">·</span>
          <span className="text-amber-400 font-mono">Jetpack Compose M3 (API 26+)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {copiedId === 'ALL' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">All Files Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Full Project</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Dual-Column Explorer */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Sidebar: Android Project Tree */}
        <div className="w-full md:w-72 bg-slate-950/50 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Filter Kotlin files..."
                value={fileFilter}
                onChange={(e) => setFileFilter(e.target.value)}
                className="w-full bg-transparent focus:outline-none placeholder:text-slate-500 text-slate-200 text-xs"
              />
            </div>
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Project Files</span>
              <span>{filteredFiles.length}</span>
            </div>

            {filteredFiles.map((file) => {
              const isSelected = file.id === currentFile.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {file.category === 'build' ? (
                    <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : file.category === 'docs' ? (
                    <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                  ) : (
                    <FileCode className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate leading-tight">{file.filename}</p>
                    <p className="text-[10px] text-slate-500 truncate">{file.path}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Stats Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/70 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Min Android SDK</span>
              <span className="text-slate-200 font-mono">API 26 (Oreo 8.0+)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Target Android SDK</span>
              <span className="text-slate-200 font-mono">API 35</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Currency</span>
              <span className="text-amber-400 font-mono">ZAR (Rands R)</span>
            </div>
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117] overflow-hidden">
          {/* Active File Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-slate-300 font-medium truncate">
                {currentFile.path}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {currentFile.code.split('\n').length} lines
              </span>
            </div>

            <button
              onClick={() => handleCopy(currentFile.code, currentFile.id)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-medium border border-amber-500/20 transition-colors"
            >
              {copiedId === currentFile.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>

          {/* File Description Tag */}
          <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/60 text-xs text-slate-400">
            {currentFile.description}
          </div>

          {/* Code Body with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 text-xs font-mono leading-relaxed select-text">
            <pre className="text-slate-300">
              {currentFile.code.split('\n').map((line, index) => (
                <div key={index} className="table-row hover:bg-slate-800/30">
                  <span className="table-cell select-none text-slate-600 text-right pr-4 text-[11px] w-10">
                    {index + 1}
                  </span>
                  <span className="table-cell whitespace-pre">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
