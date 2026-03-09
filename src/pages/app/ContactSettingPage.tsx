// src/pages/app/ContactSettingsPage.tsx

import { useEffect, useState, useCallback } from "react";
import type { ContactCard, OfficeHour, ResponseTime, Social, FAQ } from "@/types/contact";
import {
  getContactPageData,
  createContactCard,  updateContactCard,  deleteContactCard,  reorderContactCards,
  createOfficeHour,   updateOfficeHour,   deleteOfficeHour,   reorderOfficeHours,
  createResponseTime, updateResponseTime, deleteResponseTime, reorderResponseTimes,
  createSocial,       updateSocial,       deleteSocial,       reorderSocials,
  createFAQ,          updateFAQ,          deleteFAQ,          reorderFAQs,
} from "@/services/contact.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { label: "Violet",  color: "from-violet-50 to-indigo-50",  border: "hover:border-violet-200" },
  { label: "Emerald", color: "from-emerald-50 to-teal-50",   border: "hover:border-emerald-200" },
  { label: "Amber",   color: "from-amber-50 to-orange-50",   border: "hover:border-amber-200" },
  { label: "Pink",    color: "from-pink-50 to-rose-50",      border: "hover:border-pink-200" },
  { label: "Blue",    color: "from-blue-50 to-cyan-50",      border: "hover:border-blue-200" },
  { label: "Slate",   color: "from-slate-50 to-gray-50",     border: "hover:border-slate-200" },
];

const BAR_OPTIONS = [
  { label: "25%",  value: "w-1/4" },
  { label: "50%",  value: "w-1/2" },
  { label: "75%",  value: "w-3/4" },
  { label: "92%",  value: "w-11/12" },
  { label: "100%", value: "w-full" },
];

// ─── Factories ────────────────────────────────────────────────────────────────

const emptyContact  = (): Omit<ContactCard,  "id" | "order"> => ({ icon: "📌", title: "", desc: "", value: "", color: COLOR_PRESETS[0].color, border: COLOR_PRESETS[0].border });
const emptyHour     = (): Omit<OfficeHour,   "id" | "order"> => ({ day: "", time: "" });
const emptyResponse = (): Omit<ResponseTime, "id" | "order"> => ({ label: "", time: "", bar: "w-3/4" });
const emptySocial   = (): Omit<Social,       "id" | "order"> => ({ name: "", emoji: "🌐", url: "" });
const emptyFAQ      = (): Omit<FAQ,          "id" | "order"> => ({ question: "", answer: "" });

// ─── Reorder helper ───────────────────────────────────────────────────────────

function moveItem<T>(arr: T[], i: number, dir: "up" | "down"): T[] {
  if (dir === "up"   && i === 0)              return arr;
  if (dir === "down" && i === arr.length - 1) return arr;
  const next = dir === "up" ? i - 1 : i + 1;
  const out  = [...arr];
  [out[i], out[next]] = [out[next], out[i]];
  return out;
}

// ─── Small UI ─────────────────────────────────────────────────────────────────

function TabBtn({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: string; label: string; count?: number }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}>
      <span>{icon}</span><span>{label}</span>
      {count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{count}</span>}
    </button>
  );
}

function RowActions({ onEdit, onDelete, onMoveUp, onMoveDown, loading }: { onEdit: () => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void; loading?: boolean }) {
  return (
    <div className={`flex items-center gap-1 flex-shrink-0 ${loading ? "opacity-40 pointer-events-none" : ""}`}>
      <button onClick={onMoveUp}   className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
      <button onClick={onMoveDown} className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
      <button onClick={onEdit}     className="p-2 rounded-xl text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
      <button onClick={onDelete}   className="p-2 rounded-xl text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
    </div>
  );
}

function TagPill({ text, onRemove }: { text: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-200 text-xs font-medium rounded-lg">
      {text}<button onClick={onRemove} className="text-violet-400 hover:text-violet-700">×</button>
    </span>
  );
}

function Spinner() {
  return <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />;
}

// ─── Contact Card Modal ───────────────────────────────────────────────────────

type ContactDraft = Omit<ContactCard, "id" | "order"> & { id?: string };

function ContactModal({ initial, onSave, onClose, saving }: { initial: ContactDraft; onSave: (d: ContactDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Contact Card" : "Add Contact Card"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Icon</label>
              <input value={form.icon} onChange={e => set("icon", e.target.value)} className="w-16 text-2xl text-center border border-gray-200 rounded-xl py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" maxLength={2} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Email Us" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
            <input value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Short description" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Contact Value *</label>
            <input value={form.value} onChange={e => set("value", e.target.value)} placeholder="e.g. hello@nexora.com" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Card Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_PRESETS.map(p => (
                <button key={p.label} onClick={() => setForm(f => ({ ...f, color: p.color, border: p.border }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${form.color === p.color ? "border-violet-400 ring-2 ring-violet-200" : "border-gray-200 hover:border-gray-300"}`}>
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${p.color}`} />{p.label}
                </button>
              ))}
            </div>
          </div>
          <div className={`bg-gradient-to-br ${form.color} border border-gray-100 rounded-xl p-4 text-center`}>
            <div className="text-3xl mb-2">{form.icon || "📌"}</div>
            <p className="font-bold text-gray-900 text-sm">{form.title || "Title"}</p>
            <p className="text-gray-400 text-xs mt-1">{form.desc || "Description"}</p>
            <p className="text-violet-600 font-semibold text-sm mt-2">{form.value || "contact@info.com"}</p>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.title.trim() || !form.value.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Add Card"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Office Hour Modal ────────────────────────────────────────────────────────

type HourDraft = Omit<OfficeHour, "id" | "order"> & { id?: string };

function HourModal({ initial, onSave, onClose, saving }: { initial: HourDraft; onSave: (d: HourDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Hours" : "Add Hours"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Day / Range *</label>
            <input value={form.day} onChange={e => set("day", e.target.value)} placeholder="e.g. Monday – Friday" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Time / Status *</label>
            <input value={form.time} onChange={e => set("time", e.target.value)} placeholder='e.g. 09:00 – 18:00 WIB or "Closed"' className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
          <div className={`flex items-center justify-between p-3 rounded-xl ${form.time === "Closed" ? "bg-red-50" : "bg-emerald-50"}`}>
            <span className="text-sm font-medium text-gray-700">{form.day || "Day"}</span>
            <span className={`text-sm font-bold ${form.time === "Closed" ? "text-red-400" : "text-gray-800"}`}>{form.time || "—"}</span>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.day.trim() || !form.time.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
            {saving && <Spinner />}{form.id ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Response Time Modal ──────────────────────────────────────────────────────

type ResponseDraft = Omit<ResponseTime, "id" | "order"> & { id?: string };

function ResponseModal({ initial, onSave, onClose, saving }: { initial: ResponseDraft; onSave: (d: ResponseDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Response Time" : "Add Response Time"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Channel *</label>
            <input value={form.label} onChange={e => set("label", e.target.value)} placeholder="e.g. Email" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Response Time Description *</label>
            <input value={form.time} onChange={e => set("time", e.target.value)} placeholder="e.g. Within 24 hours" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Speed Bar Width</label>
            <div className="flex gap-2 flex-wrap">
              {BAR_OPTIONS.map(b => (
                <button key={b.value} onClick={() => set("bar", b.value)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${form.bar === b.value ? "border-violet-400 bg-violet-50 text-violet-700 ring-2 ring-violet-200" : "border-gray-200 hover:border-gray-300 text-gray-600"}`}>
                  {b.label}
                </button>
              ))}
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div className={`h-full ${form.bar} bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300`} />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.label.trim() || !form.time.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
            {saving && <Spinner />}{form.id ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Social Modal ─────────────────────────────────────────────────────────────

type SocialDraft = Omit<Social, "id" | "order"> & { id?: string };

function SocialModal({ initial, onSave, onClose, saving }: { initial: SocialDraft; onSave: (d: SocialDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Social" : "Add Social"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Emoji</label>
              <input value={form.emoji} onChange={e => set("emoji", e.target.value)} className="w-16 text-2xl text-center border border-gray-200 rounded-xl py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" maxLength={2} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Platform Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Twitter / X" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">URL *</label>
            <input value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://twitter.com/nexora" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 w-fit">
            <span>{form.emoji || "🌐"}</span><span>{form.name || "Platform"}</span>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.name.trim() || !form.url.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
            {saving && <Spinner />}{form.id ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Modal ────────────────────────────────────────────────────────────────

type FAQDraft = Omit<FAQ, "id" | "order"> & { id?: string };

function FAQModal({ initial, onSave, onClose, saving }: { initial: FAQDraft; onSave: (d: FAQDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit FAQ" : "Add FAQ"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Question *</label>
            <input value={form.question} onChange={e => set("question", e.target.value)} placeholder="e.g. How quickly can you start?" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Answer *</label>
            <textarea value={form.answer} onChange={e => set("answer", e.target.value)} rows={4} placeholder="Detailed answer..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 resize-none" />
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4">
            <p className="font-semibold text-gray-900 text-sm">{form.question || "Question preview"}</p>
            <p className="text-gray-500 text-xs mt-2 leading-relaxed">{form.answer || "Answer preview..."}</p>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.question.trim() || !form.answer.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Add FAQ"}
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
        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete this?</h3>
        <p className="text-sm text-gray-500 mb-1 font-medium">"{label}"</p>
        <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
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

export default function ContactSettingsPage() {
  const [tab, setTab] = useState<"contacts" | "faq" | "sidebar" | "form">("contacts");

  // Data
  const [contacts,  setContacts]  = useState<ContactCard[]>([]);
  const [hours,     setHours]     = useState<OfficeHour[]>([]);
  const [responses, setResponses] = useState<ResponseTime[]>([]);
  const [socials,   setSocials]   = useState<Social[]>([]);
  const [faqs,      setFaqs]      = useState<FAQ[]>([]);

  // Form config (local — tidak ada di DB untuk sekarang)
  const [budgetOptions, setBudgetOptions] = useState(["Under $1,000", "$1,000 – $5,000", "$5,000 – $15,000", "$15,000 – $50,000", "$50,000+"]);
  const [services,      setServices]      = useState(["UI/UX Design", "Web Dev", "Mobile App", "Cloud & DevOps", "AI Integration", "Security"]);
  const [newBudget,     setNewBudget]     = useState("");
  const [newService,    setNewService]    = useState("");

  // Loading states
  const [pageLoading, setPageLoading] = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);

  // Modals
  const [contactModal,  setContactModal]  = useState<ContactDraft  | null>(null);
  const [hourModal,     setHourModal]     = useState<HourDraft     | null>(null);
  const [responseModal, setResponseModal] = useState<ResponseDraft | null>(null);
  const [socialModal,   setSocialModal]   = useState<SocialDraft   | null>(null);
  const [faqModal,      setFaqModal]      = useState<FAQDraft      | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<{ type: string; id: string; label: string } | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  // ── Initial fetch ──────────────────────────────────────────────────────────

  useEffect(() => {
    getContactPageData()
      .then(data => {
        setContacts(data.contact_cards);
        setHours(data.office_hours);
        setResponses(data.response_times);
        setSocials(data.socials);
        setFaqs(data.faqs);
      })
      .catch(() => showToast("Failed to load data", "error"))
      .finally(() => setPageLoading(false));
  }, [showToast]);

  // ── Reorder helpers ────────────────────────────────────────────────────────

  const reorder = useCallback(async <T extends { id: string }>(
    arr: T[],
    setArr: (v: T[]) => void,
    i: number,
    dir: "up" | "down",
    reorderFn: (ids: string[]) => Promise<void>
  ) => {
    const next = moveItem(arr, i, dir);
    setArr(next); // optimistic UI
    try {
      await reorderFn(next.map(x => x.id));
    } catch {
      setArr(arr); // rollback
      showToast("Reorder failed", "error");
    }
  }, [showToast]);

  // ── Contact Cards ──────────────────────────────────────────────────────────

  const saveContact = async (data: ContactDraft) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await updateContactCard(data.id, data);
        setContacts(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Card updated ✓");
      } else {
        const created = await createContactCard(data);
        setContacts(p => [...p, created]);
        showToast("Card added ✓");
      }
      setContactModal(null);
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Office Hours ───────────────────────────────────────────────────────────

  const saveHour = async (data: HourDraft) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await updateOfficeHour(data.id, data);
        setHours(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Hours updated ✓");
      } else {
        const created = await createOfficeHour(data);
        setHours(p => [...p, created]);
        showToast("Hours added ✓");
      }
      setHourModal(null);
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Response Times ─────────────────────────────────────────────────────────

  const saveResponse = async (data: ResponseDraft) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await updateResponseTime(data.id, data);
        setResponses(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Updated ✓");
      } else {
        const created = await createResponseTime(data);
        setResponses(p => [...p, created]);
        showToast("Added ✓");
      }
      setResponseModal(null);
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Socials ────────────────────────────────────────────────────────────────

  const saveSocial = async (data: SocialDraft) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await updateSocial(data.id, data);
        setSocials(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Social updated ✓");
      } else {
        const created = await createSocial(data);
        setSocials(p => [...p, created]);
        showToast("Social added ✓");
      }
      setSocialModal(null);
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── FAQs ───────────────────────────────────────────────────────────────────

  const saveFAQ = async (data: FAQDraft) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await updateFAQ(data.id, data);
        setFaqs(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("FAQ updated ✓");
      } else {
        const created = await createFAQ(data);
        setFaqs(p => [...p, created]);
        showToast("FAQ added ✓");
      }
      setFaqModal(null);
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { type, id } = deleteTarget;
      if (type === "contact")  { await deleteContactCard(id);  setContacts(p  => p.filter(x => x.id !== id)); }
      if (type === "hour")     { await deleteOfficeHour(id);   setHours(p    => p.filter(x => x.id !== id)); }
      if (type === "response") { await deleteResponseTime(id); setResponses(p => p.filter(x => x.id !== id)); }
      if (type === "social")   { await deleteSocial(id);       setSocials(p  => p.filter(x => x.id !== id)); }
      if (type === "faq")      { await deleteFAQ(id);          setFaqs(p     => p.filter(x => x.id !== id)); }
      setDeleteTarget(null);
      showToast("Deleted");
    } catch {
      showToast("Failed to delete", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading contact settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 transition-all ${toast.type === "error" ? "bg-rose-600" : "bg-gray-900"}`}>
          <span className={toast.type === "error" ? "text-rose-200" : "text-emerald-400"}>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage contact info, FAQs, office hours, socials, and the contact form.</p>
        </div>
        <a href="/contact" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          Preview Contact
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Contact Cards", value: contacts.length,  icon: "📇", color: "from-violet-500 to-indigo-500" },
          { label: "FAQs",          value: faqs.length,      icon: "❓", color: "from-emerald-500 to-teal-500" },
          { label: "Social Links",  value: socials.length,   icon: "🌐", color: "from-blue-500 to-cyan-500" },
          { label: "Office Hours",  value: hours.length,     icon: "🕐", color: "from-amber-500 to-orange-500" },
        ].map(s => (
          <div key={s.label} className="group relative bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${s.color}`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium tracking-wide">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{s.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform`}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ minHeight: 480 }}>
        <div className="flex items-center gap-2 p-4 border-b border-gray-100 flex-wrap">
          <TabBtn active={tab === "contacts"} onClick={() => setTab("contacts")} icon="📇" label="Contact Cards" count={contacts.length} />
          <TabBtn active={tab === "faq"}      onClick={() => setTab("faq")}      icon="❓" label="FAQs"          count={faqs.length} />
          <TabBtn active={tab === "sidebar"}  onClick={() => setTab("sidebar")}  icon="🕐" label="Sidebar Info" />
          <TabBtn active={tab === "form"}     onClick={() => setTab("form")}     icon="📝" label="Form Config" />
          <div className="ml-auto">
            {tab === "contacts" && <button onClick={() => setContactModal(emptyContact())} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ Add Card</button>}
            {tab === "faq"      && <button onClick={() => setFaqModal(emptyFAQ())}         className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ Add FAQ</button>}
          </div>
        </div>

        {/* ── Contact Cards ──────────────────────────────────────────────────── */}
        {tab === "contacts" && (
          <div className="divide-y divide-gray-50">
            {contacts.length === 0 && <div className="py-20 text-center text-gray-400"><div className="text-5xl mb-4">📇</div><p className="font-medium">No contact cards yet</p></div>}
            {contacts.map((c, i) => (
              <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl flex-shrink-0 border border-gray-100`}>{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                  <p className="text-xs text-violet-600 font-semibold mt-1">{c.value}</p>
                </div>
                <RowActions
                  onMoveUp={()   => reorder(contacts, setContacts, i, "up",   reorderContactCards)}
                  onMoveDown={() => reorder(contacts, setContacts, i, "down", reorderContactCards)}
                  onEdit={()     => setContactModal(c)}
                  onDelete={()   => setDeleteTarget({ type: "contact", id: c.id, label: c.title })}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── FAQs ──────────────────────────────────────────────────────────── */}
        {tab === "faq" && (
          <div className="divide-y divide-gray-50">
            {faqs.length === 0 && <div className="py-20 text-center text-gray-400"><div className="text-5xl mb-4">❓</div><p className="font-medium">No FAQs yet</p></div>}
            {faqs.map((faq, i) => (
              <div key={faq.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition">
                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{faq.question}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{faq.answer}</p>
                </div>
                <RowActions
                  onMoveUp={()   => reorder(faqs, setFaqs, i, "up",   reorderFAQs)}
                  onMoveDown={() => reorder(faqs, setFaqs, i, "down", reorderFAQs)}
                  onEdit={()     => setFaqModal({ id: faq.id, question: faq.question, answer: faq.answer })}
                  onDelete={()   => setDeleteTarget({ type: "faq", id: faq.id, label: faq.question })}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── Sidebar Info ───────────────────────────────────────────────────── */}
        {tab === "sidebar" && (
          <div className="divide-y divide-gray-50">
            {/* Office Hours */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">🕐 Office Hours</h3>
                <button onClick={() => setHourModal(emptyHour())} className="text-sm text-violet-600 font-medium hover:underline">+ Add Row</button>
              </div>
              <div className="space-y-2">
                {hours.map((h, i) => (
                  <div key={h.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm text-gray-500">{h.day}</span>
                      <span className={`text-sm font-semibold ${h.time === "Closed" ? "text-red-400" : "text-gray-800"}`}>{h.time}</span>
                    </div>
                    <RowActions
                      onMoveUp={()   => reorder(hours, setHours, i, "up",   reorderOfficeHours)}
                      onMoveDown={() => reorder(hours, setHours, i, "down", reorderOfficeHours)}
                      onEdit={()     => setHourModal({ id: h.id, day: h.day, time: h.time })}
                      onDelete={()   => setDeleteTarget({ type: "hour", id: h.id, label: h.day })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Response Times */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">⚡ Response Times</h3>
                <button onClick={() => setResponseModal(emptyResponse())} className="text-sm text-violet-600 font-medium hover:underline">+ Add</button>
              </div>
              <div className="space-y-3">
                {responses.map((r, i) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">{r.label}</span>
                        <span className="text-gray-400">{r.time}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${r.bar} bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full`} />
                      </div>
                    </div>
                    <RowActions
                      onMoveUp={()   => reorder(responses, setResponses, i, "up",   reorderResponseTimes)}
                      onMoveDown={() => reorder(responses, setResponses, i, "down", reorderResponseTimes)}
                      onEdit={()     => setResponseModal({ id: r.id, label: r.label, time: r.time, bar: r.bar })}
                      onDelete={()   => setDeleteTarget({ type: "response", id: r.id, label: r.label })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">🌐 Social Links</h3>
                <button onClick={() => setSocialModal(emptySocial())} className="text-sm text-violet-600 font-medium hover:underline">+ Add</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {socials.map(s => (
                  <div key={s.id} className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl group">
                    <span>{s.emoji}</span>
                    <span className="text-xs font-medium text-gray-600 flex-1 truncate">{s.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => setSocialModal({ id: s.id, name: s.name, emoji: s.emoji, url: s.url })} className="p-1 rounded text-violet-500 hover:bg-violet-50"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                      <button onClick={() => setDeleteTarget({ type: "social", id: s.id, label: s.name })} className="p-1 rounded text-rose-400 hover:bg-rose-50"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setSocialModal(emptySocial())} className="flex items-center justify-center gap-1 px-3 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-violet-300 hover:text-violet-500 transition text-xs font-medium">+ Add</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Form Config ────────────────────────────────────────────────────── */}
        {tab === "form" && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-bold text-gray-900">Contact Form Configuration</h3>
              <p className="text-xs text-gray-400 mt-0.5">Customize the budget range options and service checkboxes</p>
            </div>

            {/* Budget Options */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">Budget Range Options</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {budgetOptions.map(b => (
                  <TagPill key={b} text={b} onRemove={() => setBudgetOptions(p => p.filter(x => x !== b))} />
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newBudget} onChange={e => setNewBudget(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (newBudget.trim() && !budgetOptions.includes(newBudget.trim())) setBudgetOptions(p => [...p, newBudget.trim()]); setNewBudget(""); } }}
                  placeholder="e.g. $100K+" className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
                <button onClick={() => { if (newBudget.trim() && !budgetOptions.includes(newBudget.trim())) setBudgetOptions(p => [...p, newBudget.trim()]); setNewBudget(""); }} className="px-4 py-2 bg-violet-100 text-violet-700 rounded-xl text-sm font-medium hover:bg-violet-200 transition">Add</button>
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">Service Checkboxes</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {services.map(s => (
                  <TagPill key={s} text={s} onRemove={() => setServices(p => p.filter(x => x !== s))} />
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newService} onChange={e => setNewService(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (newService.trim() && !services.includes(newService.trim())) setServices(p => [...p, newService.trim()]); setNewService(""); } }}
                  placeholder="e.g. Blockchain" className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
                <button onClick={() => { if (newService.trim() && !services.includes(newService.trim())) setServices(p => [...p, newService.trim()]); setNewService(""); }} className="px-4 py-2 bg-violet-100 text-violet-700 rounded-xl text-sm font-medium hover:bg-violet-200 transition">Add</button>
              </div>
            </div>

            {/* Preview snippet */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Services Preview</p>
              <div className="grid grid-cols-3 gap-2">
                {services.map(s => (
                  <div key={s} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 bg-white">
                    <div className="w-3 h-3 rounded border border-gray-300 flex-shrink-0" />{s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: cards preview + office hours */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900">Contact Cards Preview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Shown at the top of the contact page</p>
            </div>
            <button onClick={() => setContactModal(emptyContact())} className="text-sm text-violet-600 font-medium hover:underline">+ Add card</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {contacts.map(c => (
              <div key={c.id} className={`bg-gradient-to-br ${c.color} border border-gray-100 rounded-xl p-4 text-center cursor-pointer hover:shadow-md transition`} onClick={() => setContactModal(c)}>
                <div className="text-3xl mb-2">{c.icon}</div>
                <p className="font-bold text-gray-900 text-sm">{c.title}</p>
                <p className="text-gray-400 text-xs mt-1">{c.desc}</p>
                <p className="text-violet-600 font-semibold text-xs mt-2">{c.value}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Office Hours</p>
            <div className="space-y-1.5">
              {hours.map(h => (
                <div key={h.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-500">{h.day}</span>
                  <span className={`font-semibold ${h.time === "Closed" ? "text-red-400" : "text-gray-800"}`}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: FAQs + Socials + Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">FAQs</h2>
              <button onClick={() => setFaqModal(emptyFAQ())} className="text-sm text-violet-600 font-medium hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
              {faqs.slice(0, 4).map((faq, i) => (
                <div key={faq.id} className="flex items-start gap-2 cursor-pointer group" onClick={() => setFaqModal({ id: faq.id, question: faq.question, answer: faq.answer })}>
                  <span className="w-5 h-5 bg-violet-50 rounded-full flex items-center justify-center text-violet-600 text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-xs text-gray-600 group-hover:text-violet-600 transition line-clamp-2">{faq.question}</p>
                </div>
              ))}
              {faqs.length > 4 && <p className="text-xs text-gray-400 text-center">+{faqs.length - 4} more FAQs</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">Social Links</h2>
              <button onClick={() => setSocialModal(emptySocial())} className="text-sm text-violet-600 font-medium hover:underline">+ Add</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {socials.map(s => (
                <div key={s.id} className="flex items-center gap-2 px-2.5 py-2 bg-gray-50 rounded-lg text-xs text-gray-600">
                  <span>{s.emoji}</span><span className="truncate">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { icon: "📇", label: "Add Contact Card",  action: () => setContactModal(emptyContact()),  color: "hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200" },
                { icon: "❓", label: "Add FAQ",           action: () => setFaqModal(emptyFAQ()),          color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" },
                { icon: "🌐", label: "Add Social Link",   action: () => setSocialModal(emptySocial()),    color: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" },
                { icon: "📝", label: "Configure Form",    action: () => setTab("form"),                   color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" },
                { icon: "🖥️", label: "Preview Contact",  action: () => window.open("/contact","_blank"), color: "hover:bg-slate-50 hover:text-slate-700 hover:border-slate-200" },
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

      {/* ── Modals ─────────────────────────────────────────────────────────────── */}
      {contactModal  && <ContactModal  initial={contactModal}  onSave={saveContact}  onClose={() => setContactModal(null)}  saving={saving} />}
      {hourModal     && <HourModal     initial={hourModal}     onSave={saveHour}     onClose={() => setHourModal(null)}     saving={saving} />}
      {responseModal && <ResponseModal initial={responseModal} onSave={saveResponse} onClose={() => setResponseModal(null)} saving={saving} />}
      {socialModal   && <SocialModal   initial={socialModal}   onSave={saveSocial}   onClose={() => setSocialModal(null)}   saving={saving} />}
      {faqModal      && <FAQModal      initial={faqModal}      onSave={saveFAQ}      onClose={() => setFaqModal(null)}      saving={saving} />}

      {deleteTarget && (
        <DeleteConfirm
          label={deleteTarget.label}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}