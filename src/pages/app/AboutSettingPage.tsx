// src/pages/app/AboutSettingsPage.tsx

import { useEffect, useState, useCallback } from "react";
import type { TeamMember, CompanyValue, CompanyStat, PageContent } from "@/types/about";
import {
  getAboutPageData,
  createTeamMember, updateTeamMember, deleteTeamMember, reorderTeam,
  createValue,      updateValue,      deleteValue,      reorderValues,
  createStat,       updateStat,       deleteStat,       reorderStats,
  updateContent,
} from "@/services/about.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function moveItem<T>(arr: T[], i: number, dir: "up" | "down"): T[] {
  if (dir === "up"   && i === 0)              return arr;
  if (dir === "down" && i === arr.length - 1) return arr;
  const next = dir === "up" ? i - 1 : i + 1;
  const out  = [...arr];
  [out[i], out[next]] = [out[next], out[i]];
  return out;
}

// ─── Draft types ──────────────────────────────────────────────────────────────

type MemberDraft = Omit<TeamMember,    "id" | "order"> & { id?: string };
type ValueDraft  = Omit<CompanyValue,  "id" | "order"> & { id?: string };
type StatDraft   = Omit<CompanyStat,   "id" | "order"> & { id?: string };

// ─── Small UI ─────────────────────────────────────────────────────────────────

function TabBtn({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: string; label: string; count?: number }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}>
      <span>{icon}</span><span>{label}</span>
      {count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{count}</span>}
    </button>
  );
}

function RowActions({ onEdit, onDelete, onMoveUp, onMoveDown }: { onEdit: () => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void }) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button onClick={onMoveUp}   className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
      <button onClick={onMoveDown} className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
      <button onClick={onEdit}     className="p-2 rounded-xl text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
      <button onClick={onDelete}   className="p-2 rounded-xl text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
    </div>
  );
}

function Spinner() {
  return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
}

// ─── Member Modal ─────────────────────────────────────────────────────────────

function MemberModal({ initial, onSave, onClose, saving }: { initial: MemberDraft; onSave: (d: MemberDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Member" : "Add Member"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Emoji</label>
              <input value={form.emoji} onChange={e => set("emoji", e.target.value)} className="w-16 text-2xl text-center border border-gray-200 rounded-xl py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" maxLength={2} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Alice Johnson" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Role / Title *</label>
            <input value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. CEO & Founder" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
          <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-100">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl border border-violet-100 shadow-sm">{form.emoji || "👤"}</div>
            <div>
              <p className="font-semibold text-gray-900">{form.name || "Member Name"}</p>
              <p className="text-sm text-violet-600 font-medium mt-0.5">{form.role || "Role"}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.name.trim() || !form.role.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Value Modal ──────────────────────────────────────────────────────────────

function ValueModal({ initial, onSave, onClose, saving }: { initial: ValueDraft; onSave: (d: ValueDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Value" : "Add Value"}</h2>
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
              <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Mission-Driven" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description *</label>
            <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={3} placeholder="What does this value mean?" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 resize-none" />
          </div>
          <div className="p-4 bg-white border border-gray-100 rounded-xl">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-xl mb-3">{form.icon || "⭐"}</div>
            <p className="font-semibold text-gray-900 text-sm">{form.title || "Value Title"}</p>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">{form.desc || "Description..."}</p>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.title.trim() || !form.desc.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Add Value"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Modal ───────────────────────────────────────────────────────────────

function StatModal({ initial, onSave, onClose, saving }: { initial: StatDraft; onSave: (d: StatDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Stat" : "Add Stat"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Value *</label>
            <input value={form.value} onChange={e => set("value", e.target.value)} placeholder="e.g. 10K+ or 2020" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 font-bold text-lg text-center" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Label *</label>
            <input value={form.label} onChange={e => set("label", e.target.value)} placeholder="e.g. Customers" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 text-center" />
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-5 text-center border border-violet-100">
            <div className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">{form.value || "—"}</div>
            <div className="text-sm text-gray-500 mt-1 font-medium">{form.label || "Label"}</div>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.value.trim() || !form.label.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Add Stat"}
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

export default function AboutSettingsPage() {
  const [tab, setTab] = useState<"team" | "values" | "stats" | "content">("team");

  const [team,    setTeam]    = useState<TeamMember[]>([]);
  const [values,  setValues]  = useState<CompanyValue[]>([]);
  const [stats,   setStats]   = useState<CompanyStat[]>([]);
  const [content, setContent] = useState<PageContent>({
    hero_badge:              "About Us",
    hero_headline:           "We're building the future,",
    hero_headline_highlight: "together",
    hero_subtext:            "",
    story_paragraph1:        "",
    story_paragraph2:        "",
    story_paragraph3:        "",
  });

  const [pageLoading,  setPageLoading]  = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [contentSaving, setContentSaving] = useState(false);

  const [memberModal, setMemberModal] = useState<MemberDraft | null>(null);
  const [valueModal,  setValueModal]  = useState<ValueDraft  | null>(null);
  const [statModal,   setStatModal]   = useState<StatDraft   | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "member" | "value" | "stat"; id: string; label: string } | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    getAboutPageData()
      .then(data => {
        setTeam(data.team);
        setValues(data.values);
        setStats(data.stats);
        setContent(data.content);
      })
      .catch(() => showToast("Failed to load data", "error"))
      .finally(() => setPageLoading(false));
  }, [showToast]);

  // ── Reorder ────────────────────────────────────────────────────────────────

  const reorder = useCallback(async <T extends { id: string }>(
    arr: T[], setArr: (v: T[]) => void,
    i: number, dir: "up" | "down",
    reorderFn: (ids: string[]) => Promise<void>
  ) => {
    const next = moveItem(arr, i, dir);
    setArr(next);
    try {
      await reorderFn(next.map(x => x.id));
    } catch {
      setArr(arr);
      showToast("Reorder failed", "error");
    }
  }, [showToast]);

  // ── Team ───────────────────────────────────────────────────────────────────

  const saveMember = async (data: MemberDraft) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await updateTeamMember(data.id, data);
        setTeam(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Member updated ✓");
      } else {
        const created = await createTeamMember(data);
        setTeam(p => [...p, created]);
        showToast("Member added ✓");
      }
      setMemberModal(null);
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Values ─────────────────────────────────────────────────────────────────

  const saveValue = async (data: ValueDraft) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await updateValue(data.id, data);
        setValues(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Value updated ✓");
      } else {
        const created = await createValue(data);
        setValues(p => [...p, created]);
        showToast("Value added ✓");
      }
      setValueModal(null);
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────

  const saveStat = async (data: StatDraft) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await updateStat(data.id, data);
        setStats(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Stat updated ✓");
      } else {
        const created = await createStat(data);
        setStats(p => [...p, created]);
        showToast("Stat added ✓");
      }
      setStatModal(null);
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
      if (type === "member") { await deleteTeamMember(id); setTeam(p   => p.filter(x => x.id !== id)); }
      if (type === "value")  { await deleteValue(id);      setValues(p => p.filter(x => x.id !== id)); }
      if (type === "stat")   { await deleteStat(id);       setStats(p  => p.filter(x => x.id !== id)); }
      setDeleteTarget(null);
      showToast("Deleted");
    } catch {
      showToast("Failed to delete", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Content Save ───────────────────────────────────────────────────────────

  const saveContent = async () => {
    setContentSaving(true);
    try {
      await updateContent(content);
      showToast("Content saved ✓");
    } catch {
      showToast("Failed to save content", "error");
    } finally {
      setContentSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading about settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 ${toast.type === "error" ? "bg-rose-600" : "bg-gray-900"}`}>
          <span className={toast.type === "error" ? "text-rose-200" : "text-emerald-400"}>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage team members, company values, stats, and page content.</p>
        </div>
        <a href="/about" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          Preview About
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Team Members", value: team.length,   icon: "👥", color: "from-violet-500 to-indigo-500" },
          { label: "Core Values",  value: values.length, icon: "🎯", color: "from-emerald-500 to-teal-500" },
          { label: "Stats Shown",  value: stats.length,  icon: "📊", color: "from-blue-500 to-cyan-500" },
          { label: "Sections",     value: 4,             icon: "📄", color: "from-amber-500 to-orange-500" },
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
          <TabBtn active={tab === "team"}    onClick={() => setTab("team")}    icon="👥" label="Team"    count={team.length} />
          <TabBtn active={tab === "values"}  onClick={() => setTab("values")}  icon="🎯" label="Values"  count={values.length} />
          <TabBtn active={tab === "stats"}   onClick={() => setTab("stats")}   icon="📊" label="Stats"   count={stats.length} />
          <TabBtn active={tab === "content"} onClick={() => setTab("content")} icon="✏️" label="Content" />
          <div className="ml-auto">
            {tab === "team"   && <button onClick={() => setMemberModal({ name: "", role: "", emoji: "👤" })} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ Add Member</button>}
            {tab === "values" && <button onClick={() => setValueModal({ icon: "⭐", title: "", desc: "" })}  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ Add Value</button>}
            {tab === "stats"  && <button onClick={() => setStatModal({ value: "", label: "" })}              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ Add Stat</button>}
          </div>
        </div>

        {/* ── Team ────────────────────────────────────────────────────────── */}
        {tab === "team" && (
          <div className="divide-y divide-gray-50">
            {team.length === 0 && <div className="py-20 text-center text-gray-400"><div className="text-5xl mb-4">👥</div><p className="font-medium">No team members yet</p></div>}
            {team.map((member, i) => (
              <div key={member.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">{member.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{member.name}</p>
                  <p className="text-xs text-violet-600 font-medium mt-0.5">{member.role}</p>
                </div>
                <RowActions
                  onMoveUp={()   => reorder(team, setTeam, i, "up",   reorderTeam)}
                  onMoveDown={() => reorder(team, setTeam, i, "down", reorderTeam)}
                  onEdit={()     => setMemberModal({ id: member.id, name: member.name, role: member.role, emoji: member.emoji })}
                  onDelete={()   => setDeleteTarget({ type: "member", id: member.id, label: member.name })}
                />
              </div>
            ))}
            <div className="px-6 py-3">
              <p className="text-xs text-gray-400 text-center">Use ↑↓ arrows to reorder team members on the page</p>
            </div>
          </div>
        )}

        {/* ── Values ──────────────────────────────────────────────────────── */}
        {tab === "values" && (
          <div className="divide-y divide-gray-50">
            {values.length === 0 && <div className="py-20 text-center text-gray-400"><div className="text-5xl mb-4">🎯</div><p className="font-medium">No values yet</p></div>}
            {values.map((val, i) => (
              <div key={val.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition">
                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{val.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{val.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{val.desc}</p>
                </div>
                <RowActions
                  onMoveUp={()   => reorder(values, setValues, i, "up",   reorderValues)}
                  onMoveDown={() => reorder(values, setValues, i, "down", reorderValues)}
                  onEdit={()     => setValueModal({ id: val.id, icon: val.icon, title: val.title, desc: val.desc })}
                  onDelete={()   => setDeleteTarget({ type: "value", id: val.id, label: val.title })}
                />
              </div>
            ))}
            <div className="px-6 py-3">
              <p className="text-xs text-gray-400 text-center">Use ↑↓ arrows to reorder values on the page</p>
            </div>
          </div>
        )}

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        {tab === "stats" && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
              {stats.map(stat => (
                <div key={stat.id} className="relative group bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-5 text-center border border-violet-100">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button onClick={() => setStatModal({ id: stat.id, value: stat.value, label: stat.label })} className="p-2 rounded-xl bg-white border border-gray-200 text-violet-600 hover:bg-violet-50 shadow-sm transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => setDeleteTarget({ type: "stat", id: stat.id, label: stat.label })} className="p-2 rounded-xl bg-white border border-gray-200 text-rose-500 hover:bg-rose-50 shadow-sm transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => setStatModal({ value: "", label: "" })}
                className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition min-h-[96px]">
                <span className="text-2xl font-bold">+</span>
                <span className="text-xs font-medium">Add Stat</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center pb-4">Hover over a stat card to edit or delete it</p>
          </div>
        )}

        {/* ── Content ─────────────────────────────────────────────────────── */}
        {tab === "content" && (
          <div className="p-6 space-y-8">
            {/* Hero */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">Hero Section</h3>
                  <p className="text-xs text-gray-400 mt-0.5">The banner at the top of the About page</p>
                </div>
                <button onClick={saveContent} disabled={contentSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm disabled:opacity-60">
                  {contentSaving && <Spinner />}{contentSaving ? "Saving..." : "Save All"}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Badge Text</label>
                  <input value={content.hero_badge} onChange={e => setContent(c => ({ ...c, hero_badge: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Gradient Highlight Word</label>
                  <input value={content.hero_headline_highlight} onChange={e => setContent(c => ({ ...c, hero_headline_highlight: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Headline</label>
                  <input value={content.hero_headline} onChange={e => setContent(c => ({ ...c, hero_headline: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subtext</label>
                  <textarea value={content.hero_subtext} onChange={e => setContent(c => ({ ...c, hero_subtext: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 resize-none" />
                </div>
              </div>
              {/* Hero preview */}
              <div className="mt-4 bg-gradient-to-br from-violet-50 via-white to-indigo-50 rounded-xl p-6 text-center border border-violet-100">
                <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-3">{content.hero_badge}</span>
                <p className="text-xl font-extrabold text-gray-900 leading-tight">
                  {content.hero_headline}{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">{content.hero_headline_highlight}</span>
                </p>
                <p className="text-gray-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">{content.hero_subtext}</p>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Story */}
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Our Story</h3>
              <p className="text-xs text-gray-400 mb-4">Three paragraphs shown in the story section</p>
              <div className="space-y-3">
                {(["story_paragraph1", "story_paragraph2", "story_paragraph3"] as const).map((key, i) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Paragraph {i + 1}</label>
                    <textarea value={content[key]} onChange={e => setContent(c => ({ ...c, [key]: e.target.value }))} rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 resize-none leading-relaxed text-gray-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900">Team Preview</h2>
              <p className="text-xs text-gray-400 mt-0.5">How the team section looks on the About page</p>
            </div>
            <button onClick={() => setMemberModal({ name: "", role: "", emoji: "👤" })} className="text-sm text-violet-600 font-medium hover:underline">+ Add member</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {team.map(member => (
              <div key={member.id} className="text-center group cursor-pointer" onClick={() => setMemberModal({ id: member.id, name: member.name, role: member.role, emoji: member.emoji })}>
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{member.emoji}</div>
                <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                <p className="text-xs text-violet-600 font-medium mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>

          {/* Stats preview */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Company Stats Preview</p>
            <div className="grid grid-cols-4 gap-3">
              {stats.map(stat => (
                <div key={stat.id} className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-3 text-center border border-violet-100">
                  <div className="text-lg font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Values + Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Core Values</h2>
              <button onClick={() => setValueModal({ icon: "⭐", title: "", desc: "" })} className="text-sm text-violet-600 font-medium hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
              {values.map(val => (
                <div key={val.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer group" onClick={() => setValueModal({ id: val.id, icon: val.icon, title: val.title, desc: val.desc })}>
                  <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center text-base flex-shrink-0 group-hover:bg-violet-100 transition">{val.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{val.title}</p>
                    <p className="text-xs text-gray-400 truncate">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { icon: "👤", label: "Add Team Member",  action: () => setMemberModal({ name: "", role: "", emoji: "👤" }), color: "hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200" },
                { icon: "🎯", label: "Add Core Value",   action: () => setValueModal({ icon: "⭐", title: "", desc: "" }),   color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" },
                { icon: "📊", label: "Add Company Stat", action: () => setStatModal({ value: "", label: "" }),               color: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" },
                { icon: "✏️", label: "Edit Page Content",action: () => setTab("content"),                                   color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" },
                { icon: "🌐", label: "Preview About",    action: () => window.open("/about", "_blank"),                     color: "hover:bg-slate-50 hover:text-slate-700 hover:border-slate-200" },
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
      {memberModal && <MemberModal initial={memberModal} onSave={saveMember} onClose={() => setMemberModal(null)} saving={saving} />}
      {valueModal  && <ValueModal  initial={valueModal}  onSave={saveValue}  onClose={() => setValueModal(null)}  saving={saving} />}
      {statModal   && <StatModal   initial={statModal}   onSave={saveStat}   onClose={() => setStatModal(null)}   saving={saving} />}

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