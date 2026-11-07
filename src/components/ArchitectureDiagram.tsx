import React from 'react';
import {
  Layers,
  ArrowDown,
  ArrowUp,
  Cpu,
  Database,
  Smartphone,
  CheckCircle2,
  Workflow,
  Sparkles,
  Shield,
  Activity
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-200">
      {/* Overview Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              MVVM & Unidirectional Data Flow (UDF) Architecture
            </h2>
            <p className="text-xs text-slate-400">
              Targeted for Android 8.0+ (API 26+) · Kotlin Coroutines & StateFlow · Material Design 3
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The architecture follows Android's official recommended modern architecture with <strong>Role-Based Access Control (RBAC)</strong>.
          Users authenticate through <span className="text-red-400 font-semibold">LoginScreen</span> with role selection (<span className="text-amber-400 font-semibold">Customer vs Seller / Kitchen</span>).
          Customers browse and order via <span className="text-sky-400 font-semibold">MenuHomeScreen & CartScreen</span>, while Sellers monitor and process the shared live order pipeline via <span className="text-emerald-400 font-semibold">SellerDashboardScreen</span>.
        </p>
      </div>

      {/* Visual Architectural Stack Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. UI Layer */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                01. UI Layer (Compose M3 & RBAC)
              </span>
              <Smartphone className="w-4 h-4 text-red-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-slate-200 block">LoginScreen & Role Selector</span>
                <span className="text-[11px] text-slate-400">
                  Customer vs. Seller segmented buttons, email/password validation, demo auto-fill
                </span>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-slate-200 block">SellerDashboardScreen</span>
                <span className="text-[11px] text-slate-400">
                  Live kitchen order queue, status transitions (Pending → Preparing → Ready → Completed)
                </span>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-slate-200 block">Customer Menu, Cart & Tracking</span>
                <span className="text-[11px] text-slate-400">
                  Customization modal, Pickup/Delivery toggle, dynamic VAT and live status updates
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Navigation Route Guards</span>
            <span className="text-emerald-400 font-mono">Role-Driven NavHost</span>
          </div>
        </div>

        {/* 2. ViewModel Layer */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                02. ViewModel & Shared State
              </span>
              <Cpu className="w-4 h-4 text-amber-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-amber-300 block">AuthViewModel & StateFlow</span>
                <span className="text-[11px] text-slate-400">
                  Maintains active user session, role credentials, and shared order tickets.
                </span>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-amber-300 block">CartViewModel</span>
                <span className="text-[11px] text-slate-400">
                  UDF state for cart items, dynamic add-ons, pricing, and checkout dispatch.
                </span>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-amber-300 block">Two-Way Live Sync</span>
                <span className="text-[11px] text-slate-400">
                  Customer order placement immediately populates Seller queue; Seller status updates reflect on Customer receipt.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Concurrency</span>
            <span className="text-amber-400 font-mono">Kotlin Coroutines & Flow</span>
          </div>
        </div>

        {/* 3. Data & Network Layer */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                03. Data & Image Pipeline
              </span>
              <Database className="w-4 h-4 text-sky-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-sky-300 block">MenuRepository</span>
                <span className="text-[11px] text-slate-400">
                  Abstract interface decoupling data sources from presentation logic.
                </span>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-sky-300 block">Coil AsyncImage Engine</span>
                <span className="text-[11px] text-slate-400">
                  Hardware bitmap pooling, OkHttp disk caching, memory trims on background.
                </span>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-sky-300 block">Room / Local Cache</span>
                <span className="text-[11px] text-slate-400">
                  Ready for SQLite persistence of offline favorites and order history.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Android Desugaring</span>
            <span className="text-sky-400 font-mono">Java 17 onto API 26</span>
          </div>
        </div>
      </div>

      {/* Pricing Formula Deep-Dive */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <h3 className="font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Real-time Financial Calculation Pipeline (ZAR / Rands)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">1. Unit Item Price</span>
            <p className="font-mono text-slate-300 mt-1">
              Base + Size + ∑(AddOns)
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block">e.g. R65 + R25 + R10 = R100</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">2. Cart Subtotal</span>
            <p className="font-mono text-slate-300 mt-1">
              ∑(UnitPrice × Qty)
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block">Sum of all item lines in basket</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">3. Fulfillment Fee</span>
            <p className="font-mono text-slate-300 mt-1">
              Delivery: R25 | Pickup: R0
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block">Conditional on order fulfillment</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">4. Final Total</span>
            <p className="font-mono text-amber-400 font-bold mt-1">
              Subtotal + Fee + 15% VAT
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block">South African VAT compliance</span>
          </div>
        </div>
      </div>
    </div>
  );
};
