// src/pages/app/ServicesSettingsPage.tsx

import { useEffect, useState, useCallback } from "react";
import type { Service, ProcessStep, PricingPlan } from "@/types/services";
import { parseFeatures, stringifyFeatures } from "@/types/services";
import {
  getServices,     createService,     updateService,     deleteService     as apiDeleteService,
  toggleServicePublish, reorderServices,
  getProcess,      createProcessStep, updateProcessStep, deleteProcessStep  as apiDeleteStep,
  reorderProcess,
  getPlans,        createPlan,        updatePlan,        deletePlan        as apiDeletePlan,
  togglePlanPublish, reorderPlans,
} from "@/services/services.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { label: "Pink",    color: "from-pink-50 to-rose-50",     border: "hover:border-pink-200",    badge: "bg-pink-100 text-pink-700" },
  { label: "Violet",  color: "from-violet-50 to-indigo-50", border: "hover:border-violet-200",  badge: "bg-violet-100 text-violet-700" },
  { label: "Blue",    color: "from-blue-50 to-cyan-50",     border: "hover:border-blue-200",    badge: "bg-blue-100 text-blue-700" },
  { label: "Emerald", color: "from-emerald-50 to-teal-50",  border: "hover:border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
  { label: "Amber",   color: "from-amber-50 to-orange-50",  border: "hover:border-amber-200",   badge: "bg-amber-100 text-amber-700" },
  { label: "Slate",   color: "from-slate-50 to-gray-50",    border: "hover:border-slate-200",   badge: "bg-slate-100 text-slate-700" },
];

// Draft types — features as string[] di modal, string untuk API
type SvcDraft  = Omit<Service,      "id" | "order" | "features"> & { id?: string; features: string[] };
type StepDraft = Omit<ProcessStep,  "id" | "order">              & { id?: string };
type PlanDraft = Omit<PricingPlan,  "id" | "order" | "features"> & { id?: string; features: string[] };

const emptySvc  = (): SvcDraft  => ({ icon: "⚡", title: "", desc: "", features: [], color: COLOR_PRESETS[0].color, border: COLOR_PRESETS[0].border, badge: COLOR_PRESETS[0].badge, published: false });
const emptyStep = (): StepDraft => ({ step: "", title: "", desc: "" });
const emptyPlan = (): PlanDraft => ({ name: "", price: "", period: "/month", desc: "", features: [], cta: "Get Started", highlight: false, published: false });

// ─── Small UI ─────────────────────────────────────────────────────────────────

function TabBtn({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: string; label: string; count?: number }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}>
      <span>{icon}</span><span>{label}</span>
      {count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{count}</span>}
    </button>
  );
}

function TagPill({ text, onRemove }: { text: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-200 text-xs font-medium rounded-lg">
      {text}<button onClick={onRemove} className="text-violet-400 hover:text-violet-700">×</button>
    </span>
  );
}

function StatusDot({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-gray-400"}`} />{published ? "Published" : "Draft"}
    </span>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? "bg-violet-600" : "bg-gray-300"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function Spinner() {
  return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
}

// ─── RowActions ───────────────────────────────────────────────────────────────

function RowActions({ onEdit, onDelete, onToggle, published, onMoveUp, onMoveDown }: { onEdit: () => void; onDelete: () => void; onToggle?: () => void; published?: boolean; onMoveUp?: () => void; onMoveDown?: () => void }) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {onMoveUp   && <button onClick={onMoveUp}   className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>}
      {onMoveDown && <button onClick={onMoveDown} className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>}
      {onToggle && (
        <button onClick={onToggle} title={published ? "Unpublish" : "Publish"}
          className={`p-2 rounded-xl transition ${published ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}>
          {published
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>}
        </button>
      )}
      <button onClick={onEdit}   className="p-2 rounded-xl text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
      <button onClick={onDelete} className="p-2 rounded-xl text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
    </div>
  );
}

// ─── Service Modal ────────────────────────────────────────────────────────────

function ServiceModal({ initial, onSave, onClose, saving }: { initial: SvcDraft; onSave: (d: SvcDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const [featInput, setFeatInput] = useState("");
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const addFeat = () => { const t = featInput.trim(); if (t && !form.features.includes(t)) set("features", [...form.features, t]); setFeatInput(""); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Service" : "New Service"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Icon</label>
              <input value={form.icon} onChange={e => set("icon", e.target.value)} className="w-16 text-2xl text-center border border-gray-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" maxLength={2} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Service Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. UI/UX Design" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description *</label>
            <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={3} placeholder="Brief description of this service..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Features / Highlights</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.features.map(f => <TagPill key={f} text={f} onRemove={() => set("features", form.features.filter(x => x !== f))} />)}
            </div>
            <div className="flex gap-2">
              <input value={featInput} onChange={e => setFeatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeat())} placeholder="User Research... (Enter to add)" className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
              <button onClick={addFeat} className="px-4 py-2 bg-violet-100 text-violet-700 rounded-xl text-sm font-medium hover:bg-violet-200 transition">Add</button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Card Color Theme</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_PRESETS.map(preset => (
                <button key={preset.label} onClick={() => setForm(f => ({ ...f, color: preset.color, border: preset.border, badge: preset.badge }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${form.color === preset.color ? "border-violet-400 ring-2 ring-violet-200" : "border-gray-200 hover:border-gray-300"}`}>
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${preset.color}`} />{preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className={`rounded-xl p-4 bg-gradient-to-br ${form.color} border border-gray-100 flex items-start gap-3`}>
            <span className="text-3xl">{form.icon || "⚡"}</span>
            <div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${form.badge}`}>{form.title || "Service Title"}</span>
              <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{form.desc || "Description will appear here..."}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div><p className="text-sm font-semibold text-gray-800">Publish to Services Page</p><p className="text-xs text-gray-500 mt-0.5">Make this service visible publicly</p></div>
            <Toggle value={form.published} onChange={() => set("published", !form.published)} />
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.title.trim() || !form.desc.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Add Service"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Process Modal ────────────────────────────────────────────────────────────

function ProcessModal({ initial, onSave, onClose, saving }: { initial: StepDraft; onSave: (d: StepDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Step" : "New Step"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div className="w-24">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Step No.</label>
              <input value={form.step} onChange={e => set("step", e.target.value)} placeholder="01" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 text-center font-bold" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Discovery" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description *</label>
            <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={3} placeholder="What happens in this step..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 resize-none" />
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.title.trim() || !form.desc.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Add Step"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pricing Modal ────────────────────────────────────────────────────────────

function PricingModal({ initial, onSave, onClose, saving }: { initial: PlanDraft; onSave: (d: PlanDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const [featInput, setFeatInput] = useState("");
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const addFeat = () => { const t = featInput.trim(); if (t && !form.features.includes(t)) set("features", [...form.features, t]); setFeatInput(""); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Plan" : "New Plan"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Plan Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Starter" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Price *</label>
              <input value={form.price} onChange={e => set("price", e.target.value)} placeholder="e.g. $499 or Custom" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Period</label>
              <input value={form.period} onChange={e => set("period", e.target.value)} placeholder="/month, /project" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">CTA Button Text</label>
              <input value={form.cta} onChange={e => set("cta", e.target.value)} placeholder="Get Started" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
            <input value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Short tagline for this plan" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Features</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.features.map(f => <TagPill key={f} text={f} onRemove={() => set("features", form.features.filter(x => x !== f))} />)}
            </div>
            <div className="flex gap-2">
              <input value={featInput} onChange={e => setFeatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeat())} placeholder="Add feature... (Enter to add)" className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
              <button onClick={addFeat} className="px-4 py-2 bg-violet-100 text-violet-700 rounded-xl text-sm font-medium hover:bg-violet-200 transition">Add</button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
            <div><p className="text-sm font-semibold text-gray-800">Featured / Highlighted Plan</p><p className="text-xs text-gray-500 mt-0.5">Shown with gradient — recommended plan</p></div>
            <Toggle value={form.highlight} onChange={() => set("highlight", !form.highlight)} />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div><p className="text-sm font-semibold text-gray-800">Publish this Plan</p><p className="text-xs text-gray-500 mt-0.5">Make visible on the public services page</p></div>
            <Toggle value={form.published} onChange={() => set("published", !form.published)} />
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.name.trim() || !form.price.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Add Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ label, onConfirm, onClose, deleting }: { label: string; onConfirm: () => Promise<void>; onClose: () => void; deleting: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🗑️</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete "{label}"?</h3>
        <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={deleting} className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 text-white text-sm font-medium rounded-xl hover:bg-rose-700 transition disabled:opacity-60">
            {deleting && <Spinner />} Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ServicesSettingsPage() {
  const [tab, setTab] = useState<"services" | "process" | "pricing">("services");

  const [services, setServices] = useState<Service[]>([]);
  const [process,  setProcess]  = useState<ProcessStep[]>([]);
  const [plans,    setPlans]    = useState<PricingPlan[]>([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);

  const [svcModal,  setSvcModal]  = useState<SvcDraft  | null>(null);
  const [procModal, setProcModal] = useState<StepDraft | null>(null);
  const [planModal, setPlanModal] = useState<PlanDraft | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "service" | "process" | "plan"; id: string; label: string } | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 2800);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    Promise.all([getServices(), getProcess(), getPlans()])
      .then(([s, p, pl]) => { setServices(s); setProcess(p); setPlans(pl); })
      .catch(() => showToast("Failed to load data", "error"))
      .finally(() => setPageLoading(false));
  }, [showToast]);

  // ── Reorder ────────────────────────────────────────────────────────────────

  const move = useCallback(async <T extends { id: string }>(
    arr: T[], setArr: (v: T[]) => void, i: number, dir: "up" | "down",
    reorderFn: (ids: string[]) => Promise<void>
  ) => {
    if (dir === "up" && i === 0) return;
    if (dir === "down" && i === arr.length - 1) return;
    const next = [...arr]; const j = dir === "up" ? i - 1 : i + 1;
    [next[i], next[j]] = [next[j], next[i]];
    setArr(next);
    try { await reorderFn(next.map(x => x.id)); }
    catch { setArr(arr); showToast("Reorder failed", "error"); }
  }, [showToast]);

  // ── Service CRUD ───────────────────────────────────────────────────────────

  const saveSvc = async (data: SvcDraft) => {
    setSaving(true);
    const payload = { ...data, features: stringifyFeatures(data.features) };
    try {
      if (data.id) {
        const updated = await updateService(data.id, payload);
        setServices(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Service updated ✓");
      } else {
        const created = await createService(payload);
        setServices(p => [...p, created]);
        showToast("Service added ✓");
      }
      setSvcModal(null);
    } catch { showToast("Failed to save", "error"); }
    finally { setSaving(false); }
  };

  const handleToggleSvc = async (id: string) => {
    try {
      const updated = await toggleServicePublish(id);
      setServices(p => p.map(x => x.id === updated.id ? updated : x));
    } catch { showToast("Failed to toggle", "error"); }
  };

  // ── Process CRUD ───────────────────────────────────────────────────────────

  const saveStep = async (data: StepDraft) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await updateProcessStep(data.id, data);
        setProcess(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Step updated ✓");
      } else {
        const created = await createProcessStep(data);
        setProcess(p => [...p, created]);
        showToast("Step added ✓");
      }
      setProcModal(null);
    } catch { showToast("Failed to save", "error"); }
    finally { setSaving(false); }
  };

  // ── Plan CRUD ──────────────────────────────────────────────────────────────

  const savePlan = async (data: PlanDraft) => {
    setSaving(true);
    const payload = { ...data, features: stringifyFeatures(data.features) };
    try {
      if (data.id) {
        const updated = await updatePlan(data.id, payload);
        setPlans(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Plan updated ✓");
      } else {
        const created = await createPlan(payload);
        setPlans(p => [...p, created]);
        showToast("Plan added ✓");
      }
      setPlanModal(null);
    } catch { showToast("Failed to save", "error"); }
    finally { setSaving(false); }
  };

  const handleTogglePlan = async (id: string) => {
    try {
      const updated = await togglePlanPublish(id);
      setPlans(p => p.map(x => x.id === updated.id ? updated : x));
    } catch { showToast("Failed to toggle", "error"); }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { type, id } = deleteTarget;
      if (type === "service") { await apiDeleteService(id); setServices(p => p.filter(x => x.id !== id)); }
      if (type === "process") { await apiDeleteStep(id);    setProcess(p  => p.filter(x => x.id !== id)); }
      if (type === "plan")    { await apiDeletePlan(id);    setPlans(p    => p.filter(x => x.id !== id)); }
      setDeleteTarget(null);
      showToast("Deleted");
    } catch { showToast("Failed to delete", "error"); }
    finally { setDeleting(false); }
  };

  // ── Derived ────────────────────────────────────────────────────────────────

  const publishedSvc  = services.filter(s => s.published).length;
  const publishedPlan = plans.filter(p => p.published).length;

  // ── Render ─────────────────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading services settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 ${toast.type === "error" ? "bg-rose-600" : "bg-gray-900"}`}>
          <span className={toast.type === "error" ? "text-rose-200" : "text-emerald-400"}>{toast.type === "error" ? "✕" : "✓"}</span>{toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage services, process steps, and pricing plans shown on your public page.</p>
        </div>
        <a href="/services" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          Preview Services
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Services", value: services.length, icon: "⚡", color: "from-violet-500 to-indigo-500" },
          { label: "Live Services",  value: publishedSvc,    icon: "✅", color: "from-emerald-500 to-teal-500" },
          { label: "Process Steps",  value: process.length,  icon: "🔄", color: "from-blue-500 to-cyan-500" },
          { label: "Pricing Plans",  value: plans.length,    icon: "💳", color: "from-amber-500 to-orange-500" },
        ].map(s => (
          <div key={s.label} className="group relative bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${s.color}`} />
            <div className="flex items-start justify-between">
              <div><p className="text-sm text-gray-500 font-medium tracking-wide">{s.label}</p><p className="text-3xl font-bold text-gray-900 mt-2">{s.value}</p></div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform`}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ minHeight: 480 }}>
        <div className="flex items-center gap-2 p-4 border-b border-gray-100 flex-wrap">
          <TabBtn active={tab === "services"} onClick={() => setTab("services")} icon="⚡" label="Services" count={services.length} />
          <TabBtn active={tab === "process"}  onClick={() => setTab("process")}  icon="🔄" label="Process"  count={process.length} />
          <TabBtn active={tab === "pricing"}  onClick={() => setTab("pricing")}  icon="💳" label="Pricing"  count={plans.length} />
          <div className="ml-auto">
            {tab === "services" && <button onClick={() => setSvcModal(emptySvc())}   className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ Add Service</button>}
            {tab === "process"  && <button onClick={() => setProcModal(emptyStep())} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ Add Step</button>}
            {tab === "pricing"  && <button onClick={() => setPlanModal(emptyPlan())} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ Add Plan</button>}
          </div>
        </div>

        {/* ── Services List ───────────────────────────────────────────────── */}
        {tab === "services" && (
          <div className="divide-y divide-gray-50">
            {services.length === 0 && <div className="py-20 text-center text-gray-400"><div className="text-5xl mb-4">⚡</div><p className="font-medium">No services yet</p></div>}
            {services.map((svc, i) => (
              <div key={svc.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center text-2xl flex-shrink-0 border border-gray-100`}>{svc.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{svc.title}</span>
                    <StatusDot published={svc.published} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{svc.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {parseFeatures(svc.features).map(f => <span key={f} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">{f}</span>)}
                  </div>
                </div>
                <RowActions
                  onEdit={() => setSvcModal({ id: svc.id, icon: svc.icon, title: svc.title, desc: svc.desc, features: parseFeatures(svc.features), color: svc.color, border: svc.border, badge: svc.badge, published: svc.published })}
                  onDelete={() => setDeleteTarget({ type: "service", id: svc.id, label: svc.title })}
                  onToggle={() => handleToggleSvc(svc.id)}
                  published={svc.published}
                  onMoveUp={() => move(services, setServices, i, "up", reorderServices)}
                  onMoveDown={() => move(services, setServices, i, "down", reorderServices)}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── Process List ─────────────────────────────────────────────────── */}
        {tab === "process" && (
          <div className="divide-y divide-gray-50">
            {process.length === 0 && <div className="py-20 text-center text-gray-400"><div className="text-5xl mb-4">🔄</div><p className="font-medium">No steps yet</p></div>}
            {process.map((step, i) => (
              <div key={step.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">{step.step}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{step.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{step.desc}</p>
                </div>
                <RowActions
                  onEdit={() => setProcModal({ id: step.id, step: step.step, title: step.title, desc: step.desc })}
                  onDelete={() => setDeleteTarget({ type: "process", id: step.id, label: step.title })}
                  onMoveUp={() => move(process, setProcess, i, "up", reorderProcess)}
                  onMoveDown={() => move(process, setProcess, i, "down", reorderProcess)}
                />
              </div>
            ))}
            <div className="px-6 py-3">
              <p className="text-xs text-gray-400 text-center">Use ↑↓ to reorder steps. Edit step numbers to customize labels.</p>
            </div>
          </div>
        )}

        {/* ── Pricing List ─────────────────────────────────────────────────── */}
        {tab === "pricing" && (
          <div className="divide-y divide-gray-50">
            {plans.length === 0 && <div className="py-20 text-center text-gray-400"><div className="text-5xl mb-4">💳</div><p className="font-medium">No plans yet</p></div>}
            {plans.map((plan, i) => (
              <div key={plan.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${plan.highlight ? "bg-gradient-to-br from-violet-600 to-indigo-600" : "bg-gray-100"}`}>
                  <span className={`text-lg font-bold ${plan.highlight ? "text-white" : "text-gray-500"}`}>💳</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{plan.name}</span>
                    {plan.highlight && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">⭐ Featured</span>}
                    <StatusDot published={plan.published} />
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-xs text-gray-400">{plan.period}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {parseFeatures(plan.features).map(f => <span key={f} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">{f}</span>)}
                  </div>
                </div>
                <RowActions
                  onEdit={() => setPlanModal({ id: plan.id, name: plan.name, price: plan.price, period: plan.period, desc: plan.desc, features: parseFeatures(plan.features), cta: plan.cta, highlight: plan.highlight, published: plan.published })}
                  onDelete={() => setDeleteTarget({ type: "plan", id: plan.id, label: plan.name })}
                  onToggle={() => handleTogglePlan(plan.id)}
                  published={plan.published}
                  onMoveUp={() => move(plans, setPlans, i, "up", reorderPlans)}
                  onMoveDown={() => move(plans, setPlans, i, "down", reorderPlans)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Services mini-grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Services Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">{publishedSvc} of {services.length} services are live</p>
            </div>
            <button onClick={() => setSvcModal(emptySvc())} className="text-sm text-violet-600 font-medium hover:underline">Add new →</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {services.map(svc => (
              <div key={svc.id} className={`rounded-xl p-3 bg-gradient-to-br ${svc.color} border border-gray-100 relative`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{svc.icon}</span>
                  <span className={`w-2 h-2 rounded-full ${svc.published ? "bg-emerald-400" : "bg-gray-300"}`} />
                </div>
                <p className="text-xs font-bold text-gray-800 leading-tight">{svc.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{parseFeatures(svc.features).length} features</p>
              </div>
            ))}
            <button onClick={() => setSvcModal(emptySvc())}
              className="rounded-xl p-3 border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-violet-600 min-h-[76px]">
              <span className="text-xl">+</span><span className="text-xs font-medium">Add Service</span>
            </button>
          </div>

          {/* Pricing ratio */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pricing Plans — {publishedPlan}/{plans.length} published</p>
            <div className="flex gap-3 items-center">
              {plans.map(plan => (
                <div key={plan.id} className={`flex-1 rounded-xl p-3 border text-center transition ${plan.highlight ? "border-violet-300 bg-violet-50" : "border-gray-100 bg-gray-50"}`}>
                  <p className={`text-xs font-bold ${plan.highlight ? "text-violet-700" : "text-gray-700"}`}>{plan.name}</p>
                  <p className={`text-base font-extrabold mt-0.5 ${plan.highlight ? "text-violet-600" : "text-gray-900"}`}>{plan.price}</p>
                  <p className="text-xs text-gray-400">{plan.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Process + Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Process Steps</h2>
              <button onClick={() => setProcModal(emptyStep())} className="text-sm text-violet-600 font-medium hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
              {process.map((step, i) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-extrabold text-violet-600">{step.step}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{step.title}</p>
                  </div>
                  {i < process.length - 1 && <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { icon: "⚡", label: "Add Service",      action: () => setSvcModal(emptySvc()),   color: "hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200" },
                { icon: "💳", label: "Add Pricing Plan", action: () => setPlanModal(emptyPlan()), color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" },
                { icon: "🔄", label: "Add Process Step", action: () => setProcModal(emptyStep()), color: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" },
                { icon: "🌐", label: "Preview Services", action: () => window.open("/services", "_blank"), color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" },
              ].map(item => (
                <button key={item.label} onClick={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-600 transition-all duration-200 ${item.color}`}>
                  <span className="text-base">{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {svcModal  && <ServiceModal initial={svcModal}  onSave={saveSvc}  onClose={() => setSvcModal(null)}  saving={saving} />}
      {procModal && <ProcessModal initial={procModal} onSave={saveStep} onClose={() => setProcModal(null)} saving={saving} />}
      {planModal && <PricingModal initial={planModal} onSave={savePlan} onClose={() => setPlanModal(null)} saving={saving} />}
      {deleteTarget && <DeleteConfirm label={deleteTarget.label} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} deleting={deleting} />}
    </div>
  );
}