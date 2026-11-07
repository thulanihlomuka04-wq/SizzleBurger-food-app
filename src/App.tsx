import React, { useState } from 'react';
import {
  Smartphone,
  Code2,
  Workflow,
  Copy,
  Check,
  Package,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Columns
} from 'lucide-react';
import { AndroidEmulator } from './components/AndroidEmulator';
import { CodeExplorer } from './components/CodeExplorer';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { KOTLIN_PROJECT_FILES } from './data/kotlinSourceCode';

export default function App() {
  const [activeTab, setActiveTab] = useState<'split' | 'emulator' | 'code' | 'blueprint'>('split');
  const [isCopiedAll, setIsCopiedAll] = useState(false);

  const handleCopyAllCode = () => {
    const fullProjectBundle = KOTLIN_PROJECT_FILES.map(
      (f) =>
        `// ==========================================================================\n// FILE: ${f.path}\n// DESCRIPTION: ${f.description}\n// ==========================================================================\n\n${f.code}\n\n`
    ).join('\n');

    navigator.clipboard.writeText(fullProjectBundle);
    setIsCopiedAll(true);
    setTimeout(() => setIsCopiedAll(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar following Top Bar Contract (3 zones separated by gap-8) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-sm shadow-red-500/20">
            S
          </div>
          <span className="text-base font-extrabold tracking-tight text-white">
            SizzleBurger Android Studio
          </span>
        </div>

        {/* Zone 2: Navigation Links / Segmented Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'split'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio Split View</span>
          </button>

          <button
            onClick={() => setActiveTab('emulator')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'emulator'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-red-400" />
            <span>Interactive Mobile App</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Kotlin & Compose Code</span>
          </button>

          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'blueprint'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-emerald-400" />
            <span>Architecture Blueprint</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopyAllCode}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-400/20 active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            {isCopiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                <span>All Kotlin Files Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Kotlin Project</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Quick Mobile Navigation Bar on small screens */}
      <div className="md:hidden flex items-center justify-around p-2 bg-slate-900 border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('emulator')}
          className={`px-3 py-1.5 rounded-lg ${
            activeTab === 'emulator' || activeTab === 'split' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
          }`}
        >
          Emulator
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1.5 rounded-lg ${
            activeTab === 'code' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
          }`}
        >
          Kotlin Code
        </button>
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`px-3 py-1.5 rounded-lg ${
            activeTab === 'blueprint' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
          }`}
        >
          Blueprint
        </button>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 lg:p-6 flex flex-col">
        {/* Split View (Desktop default: Emulator on Left, Code Explorer on Right) */}
        {activeTab === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 min-h-[820px]">
            {/* Left 5 Cols: Interactive Android Pixel 8 Pro Emulator */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center">
              <div className="w-full mb-3 flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="font-semibold text-slate-200">
                  Live Jetpack Compose M3 Simulator
                </span>
                <button
                  onClick={() => setActiveTab('emulator')}
                  className="hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <span>Focus Emulator</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <AndroidEmulator />
            </div>

            {/* Right 7 Cols: Android Studio Code Explorer */}
            <div className="lg:col-span-7 xl:col-span-8 h-[840px] flex flex-col">
              <div className="w-full mb-3 flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="font-semibold text-slate-200">
                  Full Jetpack Compose & Kotlin Source Code
                </span>
                <button
                  onClick={() => setActiveTab('code')}
                  className="hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <span>Expand Code Studio</span>
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 min-h-0">
                <CodeExplorer />
              </div>
            </div>
          </div>
        )}

        {/* Focused Emulator View */}
        {activeTab === 'emulator' && (
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center py-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-100">
                Interactive Material 3 Fast-Food App
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Try searching items, opening the customization bottom sheet, toggling portion sizes and add-ons, switching between Pickup and Delivery, and completing checkout.
              </p>
            </div>
            <AndroidEmulator />
          </div>
        )}

        {/* Focused Code Explorer View */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col h-[860px]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  Production Kotlin Android Codebase
                </h2>
                <p className="text-xs text-slate-400">
                  Complete implementation with Compose BOM, Navigation, StateFlow & Coil for API 26+
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <CodeExplorer />
            </div>
          </div>
        )}

        {/* Focused Architecture Blueprint View */}
        {activeTab === 'blueprint' && (
          <div className="max-w-6xl mx-auto w-full py-2">
            <ArchitectureDiagram />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto px-6 py-4 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>Fast-Food Ordering System</span>
          <span aria-hidden="true">·</span>
          <span>Target: Android 8.0+ (API 26+)</span>
          <span aria-hidden="true">·</span>
          <span>Material Design 3 & Jetpack Compose</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="font-mono text-[11px] text-amber-400/90">South African Rands (ZAR / R)</span>
          <span>15% Statutory VAT</span>
        </div>
      </footer>
    </div>
  );
}
