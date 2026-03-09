// src/pages/app/PortfolioSettingsPage.tsx

import { useEffect, useState, useCallback } from "react";
import type { Project, Testimonial } from "@/types/portfolio";
import { parseTags, stringifyTags } from "@/types/portfolio";
import {
  getProjects, createProject, updateProject, deleteProject as apiDeleteProject,
  togglePublish as apiTogglePublish, reorderProjects,
  getTestimonials, createTestimonial, updateTestimonial,
  deleteTestimonial as apiDeleteTestimonial, reorderTestimonials,
} from "@/services/portfolio.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = ["E-Commerce", "Healthcare", "Fintech", "EdTech", "Logistics", "Travel", "Other"];

const COLOR_PRESETS = [
  { label: "Pink",    color: "from-pink-50 to-rose-50",       border: "hover:border-pink-200",    badge: "bg-pink-100 text-pink-700" },
  { label: "Emerald", color: "from-emerald-50 to-teal-50",    border: "hover:border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
  { label: "Violet",  color: "from-violet-50 to-indigo-50",   border: "hover:border-violet-200",  badge: "bg-violet-100 text-violet-700" },
  { label: "Amber",   color: "from-amber-50 to-orange-50",    border: "hover:border-amber-200",   badge: "bg-amber-100 text-amber-700" },
  { label: "Blue",    color: "from-blue-50 to-cyan-50",       border: "hover:border-blue-200",    badge: "bg-blue-100 text-blue-700" },
  { label: "Slate",   color: "from-slate-50 to-gray-50",      border: "hover:border-slate-200",   badge: "bg-slate-100 text-slate-700" },
];

// Draft types use string[] for tags (converted before API call)
type ProjectDraft     = Omit<Project,     "id" | "order" | "tags"> & { id?: string; tags: string[] };
type TestimonialDraft = Omit<Testimonial, "id" | "order">          & { id?: string };

const emptyProject = (): ProjectDraft => ({
  emoji: "🚀", title: "", category: "E-Commerce", desc: "",
  tags: [], result: "",
  color: COLOR_PRESETS[0].color, border: COLOR_PRESETS[0].border, badge: COLOR_PRESETS[0].badge,
  published: false,
});

const emptyTestimonial = (): TestimonialDraft => ({ name: "", role: "", emoji: "👤", text: "" });

// ─── Small UI ─────────────────────────────────────────────────────────────────

function TabButton({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: string; label: string; count?: number }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}>
      <span>{icon}</span><span>{label}</span>
      {count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{count}</span>}
    </button>
  );
}

function Badge({ text, onRemove }: { text: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-200 text-xs font-medium rounded-lg">
      {text}
      <button onClick={onRemove} className="text-violet-400 hover:text-violet-700 transition-colors">×</button>
    </span>
  );
}

function StatusDot({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-gray-400"}`} />
      {published ? "Published" : "Draft"}
    </span>
  );
}

function Spinner() {
  return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
}

// ─── Project Modal ────────────────────────────────────────────────────────────

function ProjectModal({ initial, onSave, onClose, saving }: { initial: ProjectDraft; onSave: (d: ProjectDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const [tagInput, setTagInput] = useState("");
  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Project" : "New Project"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Emoji</label>
              <input value={form.emoji} onChange={e => set("emoji", e.target.value)} className="w-16 text-2xl text-center border border-gray-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" maxLength={2} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Project Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. ShopEase" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 bg-white">
              {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description *</label>
            <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={3} placeholder="Brief description of the project..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tech Stack</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map(tag => <Badge key={tag} text={tag} onRemove={() => set("tags", form.tags.filter(t => t !== tag))} />)}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="React, Node.js... (Enter to add)" className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
              <button onClick={addTag} className="px-4 py-2 bg-violet-100 text-violet-700 rounded-xl text-sm font-medium hover:bg-violet-200 transition">Add</button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Key Result</label>
            <input value={form.result} onChange={e => set("result", e.target.value)} placeholder="e.g. 3x conversion rate increase" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
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
          {/* Live preview */}
          <div className={`bg-gradient-to-br ${form.color} rounded-xl p-4 border border-gray-100`}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-3xl">{form.emoji || "🚀"}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${form.badge}`}>{form.category}</span>
            </div>
            <p className="font-bold text-gray-900 text-sm">{form.title || "Project Title"}</p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{form.desc || "Description..."}</p>
            {form.result && <p className="text-xs font-semibold text-violet-600 mt-2">🏆 {form.result}</p>}
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-800">Publish to Portfolio</p>
              <p className="text-xs text-gray-500 mt-0.5">Make visible on the public page</p>
            </div>
            <button onClick={() => set("published", !form.published)} className={`relative w-11 h-6 rounded-full transition-all duration-300 ${form.published ? "bg-violet-600" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${form.published ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.title.trim() || !form.desc.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Testimonial Modal ────────────────────────────────────────────────────────

function TestimonialModal({ initial, onSave, onClose, saving }: { initial: TestimonialDraft; onSave: (d: TestimonialDraft) => Promise<void>; onClose: () => void; saving: boolean }) {
  const [form, setForm] = useState({ ...initial });
  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Testimonial" : "New Testimonial"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Emoji</label>
              <input value={form.emoji} onChange={e => set("emoji", e.target.value)} className="w-16 text-2xl text-center border border-gray-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" maxLength={2} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Sarah Kim" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Role / Company</label>
            <input value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. CEO, ShopEase" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Testimonial *</label>
            <textarea value={form.text} onChange={e => set("text", e.target.value)} rows={4} placeholder="What they said about working with you..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 resize-none" />
          </div>
          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 italic leading-relaxed">"{form.text || "Testimonial text..."}"</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xl">{form.emoji || "👤"}</span>
              <div>
                <p className="text-xs font-bold text-gray-900">{form.name || "Name"}</p>
                <p className="text-xs text-gray-500">{form.role || "Role"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.name.trim() || !form.text.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Add Testimonial"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ type, onConfirm, onClose, deleting }: { type: "project" | "testimonial"; onConfirm: () => Promise<void>; onClose: () => void; deleting: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🗑️</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete this?</h3>
        <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The {type} will be permanently removed.</p>
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

export default function PortfolioSettingsPage() {
  const [tab, setTab] = useState<"projects" | "testimonials" | "stats">("projects");

  const [projects,     setProjects]     = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [togglingId,  setTogglingId]  = useState<string | null>(null);

  const [projectModal,     setProjectModal]     = useState<ProjectDraft | null>(null);
  const [testimonialModal, setTestimonialModal] = useState<TestimonialDraft | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "project" | "testimonial"; id: string } | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    Promise.all([getProjects(), getTestimonials()])
      .then(([p, t]) => { setProjects(p); setTestimonials(t); })
      .catch(() => showToast("Failed to load data", "error"))
      .finally(() => setPageLoading(false));
  }, [showToast]);

  // ── Reorder ────────────────────────────────────────────────────────────────

  const moveProject = useCallback(async (i: number, dir: "up" | "down") => {
    if (dir === "up" && i === 0) return;
    if (dir === "down" && i === projects.length - 1) return;
    const next = [...projects];
    const j = dir === "up" ? i - 1 : i + 1;
    [next[i], next[j]] = [next[j], next[i]];
    setProjects(next);
    try { await reorderProjects(next.map(p => p.id)); }
    catch { setProjects(projects); showToast("Reorder failed", "error"); }
  }, [projects, showToast]);

  const moveTestimonial = useCallback(async (i: number, dir: "up" | "down") => {
    if (dir === "up" && i === 0) return;
    if (dir === "down" && i === testimonials.length - 1) return;
    const next = [...testimonials];
    const j = dir === "up" ? i - 1 : i + 1;
    [next[i], next[j]] = [next[j], next[i]];
    setTestimonials(next);
    try { await reorderTestimonials(next.map(t => t.id)); }
    catch { setTestimonials(testimonials); showToast("Reorder failed", "error"); }
  }, [testimonials, showToast]);

  // ── Project CRUD ───────────────────────────────────────────────────────────

  const saveProject = async (data: ProjectDraft) => {
    setSaving(true);
    const payload = { ...data, tags: stringifyTags(data.tags) };
    try {
      if (data.id) {
        const updated = await updateProject(data.id, payload);
        setProjects(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Project updated ✓");
      } else {
        const created = await createProject(payload);
        setProjects(p => [...p, created]);
        showToast("Project added ✓");
      }
      setProjectModal(null);
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (id: string) => {
    setTogglingId(id);
    try {
      const updated = await apiTogglePublish(id);
      setProjects(p => p.map(x => x.id === updated.id ? updated : x));
    } catch {
      showToast("Failed to toggle publish", "error");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Testimonial CRUD ───────────────────────────────────────────────────────

  const saveTestimonial = async (data: TestimonialDraft) => {
    setSaving(true);
    try {
      if (data.id) {
        const updated = await updateTestimonial(data.id, data);
        setTestimonials(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Testimonial updated ✓");
      } else {
        const created = await createTestimonial(data);
        setTestimonials(p => [...p, created]);
        showToast("Testimonial added ✓");
      }
      setTestimonialModal(null);
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
      if (deleteTarget.type === "project") {
        await apiDeleteProject(deleteTarget.id);
        setProjects(p => p.filter(x => x.id !== deleteTarget.id));
      } else {
        await apiDeleteTestimonial(deleteTarget.id);
        setTestimonials(p => p.filter(x => x.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
      showToast("Deleted");
    } catch {
      showToast("Failed to delete", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────

  const publishedCount = projects.filter(p => p.published).length;
  const draftCount     = projects.length - publishedCount;
  const allTags        = Array.from(new Set(projects.flatMap(p => parseTags(p.tags))));

  // ── Render ─────────────────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading portfolio settings...</p>
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
          <h1 className="text-2xl font-extrabold text-gray-900">Portfolio Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage projects, testimonials, and portfolio stats.</p>
        </div>
        <a href="/portfolio" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          Preview Portfolio
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Projects",  value: projects.length,     icon: "🚀", color: "from-violet-500 to-indigo-500" },
          { label: "Published",       value: publishedCount,      icon: "✅", color: "from-emerald-500 to-teal-500" },
          { label: "Drafts",          value: draftCount,          icon: "📝", color: "from-amber-500 to-orange-500" },
          { label: "Testimonials",    value: testimonials.length, icon: "💬", color: "from-blue-500 to-cyan-500" },
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
          <TabButton active={tab === "projects"}     onClick={() => setTab("projects")}     icon="🚀" label="Projects"     count={projects.length} />
          <TabButton active={tab === "testimonials"} onClick={() => setTab("testimonials")} icon="💬" label="Testimonials" count={testimonials.length} />
          <TabButton active={tab === "stats"}        onClick={() => setTab("stats")}        icon="📊" label="Stats" />
          <div className="ml-auto">
            {tab === "projects"     && <button onClick={() => setProjectModal(emptyProject())}         className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ Add Project</button>}
            {tab === "testimonials" && <button onClick={() => setTestimonialModal(emptyTestimonial())} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ Add Testimonial</button>}
          </div>
        </div>

        {/* ── Projects ────────────────────────────────────────────────────── */}
        {tab === "projects" && (
          <div className="divide-y divide-gray-50">
            {projects.length === 0 && <div className="py-20 text-center text-gray-400"><div className="text-5xl mb-4">🚀</div><p className="font-medium">No projects yet</p></div>}
            {projects.map((project, i) => (
              <div key={project.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-2xl flex-shrink-0 border border-gray-100`}>{project.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 text-sm">{project.title}</p>
                    <StatusDot published={project.published} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{project.category} · {parseTags(project.tags).join(", ")}</p>
                </div>
                {/* Publish toggle */}
                <button onClick={() => handleTogglePublish(project.id)} disabled={togglingId === project.id}
                  className={`relative w-10 h-5 rounded-full transition-all duration-300 disabled:opacity-50 ${project.published ? "bg-violet-600" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${project.published ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                {/* RowActions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => moveProject(i, "up")}   className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                  <button onClick={() => moveProject(i, "down")} className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                  <button onClick={() => setProjectModal({ id: project.id, emoji: project.emoji, title: project.title, category: project.category, desc: project.desc, tags: parseTags(project.tags), result: project.result, color: project.color, border: project.border, badge: project.badge, published: project.published })}
                    className="p-2 rounded-xl text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteTarget({ type: "project", id: project.id })} className="p-2 rounded-xl text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Testimonials ─────────────────────────────────────────────────── */}
        {tab === "testimonials" && (
          <div className="divide-y divide-gray-50">
            {testimonials.length === 0 && <div className="py-20 text-center text-gray-400"><div className="text-5xl mb-4">💬</div><p className="font-medium">No testimonials yet</p></div>}
            {testimonials.map((t, i) => (
              <div key={t.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{t.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{t.role}</p>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 italic">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => moveTestimonial(i, "up")}   className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                  <button onClick={() => moveTestimonial(i, "down")} className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                  <button onClick={() => setTestimonialModal({ id: t.id, name: t.name, role: t.role, emoji: t.emoji, text: t.text })} className="p-2 rounded-xl text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => setDeleteTarget({ type: "testimonial", id: t.id })} className="p-2 rounded-xl text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Stats Tab ────────────────────────────────────────────────────── */}
        {tab === "stats" && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Projects",  value: projects.length,                  color: "from-violet-500 to-indigo-500" },
                { label: "Published",       value: publishedCount,                   color: "from-emerald-500 to-teal-500" },
                { label: "Drafts",          value: draftCount,                       color: "from-amber-500 to-orange-500" },
                { label: "Tech Tags Used",  value: allTags.length,                   color: "from-blue-500 to-cyan-500" },
              ].map(s => (
                <div key={s.label} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100 text-center">
                  <div className={`text-2xl font-extrabold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            <div>
              <p className="text-sm font-bold text-gray-800 mb-3">Projects by Category</p>
              <div className="space-y-2.5">
                {CATEGORY_OPTIONS.filter(cat => projects.some(p => p.category === cat)).map(cat => {
                  const count = projects.filter(p => p.category === cat).length;
                  const pct   = Math.round((count / projects.length) * 100);
                  const pub   = projects.filter(p => p.category === cat && p.published).length;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span className="font-semibold">{cat}</span>
                        <span className="text-gray-400">{pub}/{count} published</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tech stack cloud */}
            <div>
              <p className="text-sm font-bold text-gray-800 mb-3">Tech Stack Used</p>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg shadow-sm">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Projects by Category</h2>
              <p className="text-xs text-gray-400 mt-0.5">Distribution across {projects.length} projects</p>
            </div>
            <button onClick={() => setProjectModal(emptyProject())} className="text-sm text-violet-600 font-medium hover:underline">Add new →</button>
          </div>
          <div className="space-y-3">
            {CATEGORY_OPTIONS.filter(cat => projects.some(p => p.category === cat)).map(cat => {
              const count = projects.filter(p => p.category === cat).length;
              const pct   = Math.round((count / projects.length) * 100);
              const pub   = projects.filter(p => p.category === cat && p.published).length;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                    <span className="font-semibold text-gray-700">{cat}</span>
                    <span className="text-gray-400">{pub}/{count} published</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tech Stack Used</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => <span key={tag} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg">{tag}</span>)}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Publication Status</h2>
            <div className="flex items-center justify-around py-2 mb-4">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-emerald-600">{publishedCount}</div>
                <div className="text-xs text-gray-400 mt-0.5">Published</div>
              </div>
              <div className="w-px h-10 bg-gray-100" />
              <div className="text-center">
                <div className="text-3xl font-extrabold text-amber-500">{draftCount}</div>
                <div className="text-xs text-gray-400 mt-0.5">Drafts</div>
              </div>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: projects.length ? `${(publishedCount / projects.length) * 100}%` : "0%" }} />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              {projects.length > 0 ? `${Math.round((publishedCount / projects.length) * 100)}% of projects are live` : "No projects yet"}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { icon: "🚀", label: "Add New Project",   action: () => setProjectModal(emptyProject()),         color: "hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200" },
                { icon: "💬", label: "Add Testimonial",   action: () => setTestimonialModal(emptyTestimonial()), color: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" },
                { icon: "📊", label: "View Page Stats",   action: () => setTab("stats"),                         color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" },
                { icon: "🌐", label: "Preview Portfolio", action: () => window.open("/portfolio", "_blank"),      color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" },
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
      {projectModal     && <ProjectModal     initial={projectModal}     onSave={saveProject}     onClose={() => setProjectModal(null)}     saving={saving} />}
      {testimonialModal && <TestimonialModal initial={testimonialModal} onSave={saveTestimonial} onClose={() => setTestimonialModal(null)} saving={saving} />}
      {deleteTarget     && <DeleteConfirm    type={deleteTarget.type}   onConfirm={handleDelete} onClose={() => setDeleteTarget(null)}     deleting={deleting} />}
    </div>
  );
}