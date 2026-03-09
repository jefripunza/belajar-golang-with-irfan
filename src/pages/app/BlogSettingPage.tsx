// src/pages/app/BlogSettingsPage.tsx

import { useEffect, useState, useCallback } from "react";
import type { BlogPost, BlogAuthor, BlogTopic } from "@/types/blog";
import {
  getPosts,    createPost,    updatePost,    deletePost    as apiDeletePost,
  togglePostPublish, setFeaturedPost,
  getAuthors,  createAuthor,  updateAuthor,  deleteAuthor  as apiDeleteAuthor,
  getTopics,   createTopic,   deleteTopic   as apiDeleteTopic,
} from "@/services/blog.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { label: "Violet",  color: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700" },
  { label: "Amber",   color: "from-amber-50 to-orange-50",  badge: "bg-amber-100 text-amber-700" },
  { label: "Pink",    color: "from-pink-50 to-rose-50",     badge: "bg-pink-100 text-pink-700" },
  { label: "Slate",   color: "from-slate-50 to-gray-50",    badge: "bg-slate-100 text-slate-700" },
  { label: "Blue",    color: "from-blue-50 to-cyan-50",     badge: "bg-blue-100 text-blue-700" },
  { label: "Emerald", color: "from-emerald-50 to-teal-50",  badge: "bg-emerald-100 text-emerald-700" },
  { label: "Rose",    color: "from-rose-50 to-pink-50",     badge: "bg-rose-100 text-rose-700" },
];

const CATEGORY_OPTIONS = ["AI & Tech", "Performance", "Design", "Security", "DevOps", "Mobile", "Startup", "Engineering", "Product"];

// Draft types (id optional for create vs edit)
type PostDraft   = Omit<BlogPost,   "id"> & { id?: string };
type AuthorDraft = Omit<BlogAuthor, "id"> & { id?: string };

const emptyPost = (): PostDraft => ({
  emoji: "📝", category: "AI & Tech", badge: COLOR_PRESETS[0].badge,
  title: "", desc: "", author: "", author_emoji: "👤", role: "",
  date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  read_time: "5 min read", color: COLOR_PRESETS[0].color, featured: false, published: false,
});

const emptyAuthor = (): AuthorDraft => ({ name: "", role: "", emoji: "👤" });

// ─── Small UI ─────────────────────────────────────────────────────────────────

function TabBtn({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: string; label: string; count?: number }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}>
      <span>{icon}</span><span>{label}</span>
      {count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{count}</span>}
    </button>
  );
}

function StatusDot({ published, label }: { published: boolean; label?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-gray-400"}`} />
      {label ?? (published ? "Published" : "Draft")}
    </span>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${value ? "bg-violet-600" : "bg-gray-300"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function Spinner() {
  return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
}

function RowActions({ onEdit, onDelete, onToggle, published }: { onEdit: () => void; onDelete: () => void; onToggle?: () => void; published?: boolean }) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {onToggle && (
        <button onClick={onToggle} title={published ? "Unpublish" : "Publish"} className={`p-2 rounded-xl transition ${published ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}>
          {published
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
          }
        </button>
      )}
      <button onClick={onEdit}   className="p-2 rounded-xl text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
      <button onClick={onDelete} className="p-2 rounded-xl text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
    </div>
  );
}

// ─── Post Modal ───────────────────────────────────────────────────────────────

function PostModal({ initial, authors, onSave, onClose, saving }: {
  initial: PostDraft; authors: BlogAuthor[];
  onSave: (d: PostDraft) => Promise<void>; onClose: () => void; saving: boolean;
}) {
  const [form, setForm] = useState({ ...initial });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const selectPreset = (p: typeof COLOR_PRESETS[0]) => setForm(f => ({ ...f, color: p.color, badge: p.badge }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Post" : "New Post"}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">✕</button>
        </div>
        <div className="p-6 space-y-5">
          {/* Emoji + Title */}
          <div className="flex gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Emoji</label>
              <input value={form.emoji} onChange={e => set("emoji", e.target.value)} className="w-16 text-2xl text-center border border-gray-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" maxLength={2} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Post title..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 bg-white">
              {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description / Excerpt *</label>
            <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={3} placeholder="Brief summary shown on the blog listing..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 resize-none" />
          </div>
          {/* Author + Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Author</label>
              <select value={form.author} onChange={e => {
                const a = authors.find(x => x.name === e.target.value);
                setForm(f => ({ ...f, author: e.target.value, author_emoji: a?.emoji ?? "👤" }));
              }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 bg-white">
                <option value="">Select author</option>
                {authors.map(a => <option key={a.id} value={a.name}>{a.emoji} {a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Role (for featured)</label>
              <input value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. CTO, Nexora" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          {/* Date + Read Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Publish Date</label>
              <input value={form.date} onChange={e => set("date", e.target.value)} placeholder="March 1, 2026" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Read Time</label>
              <input value={form.read_time} onChange={e => set("read_time", e.target.value)} placeholder="5 min read" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          {/* Color Theme */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Card Color Theme</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_PRESETS.map(preset => (
                <button key={preset.label} onClick={() => selectPreset(preset)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${form.color === preset.color ? "border-violet-400 ring-2 ring-violet-200" : "border-gray-200 hover:border-gray-300"}`}>
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${preset.color}`} />{preset.label}
                </button>
              ))}
            </div>
          </div>
          {/* Card Preview */}
          <div className="rounded-xl overflow-hidden border border-gray-100">
            <div className={`bg-gradient-to-br ${form.color} px-5 pt-5 pb-3 flex items-center justify-between`}>
              <span className="text-2xl">{form.emoji || "📝"}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${form.badge}`}>{form.category}</span>
            </div>
            <div className="px-5 py-4 bg-white">
              <p className="font-bold text-gray-900 text-sm leading-snug">{form.title || "Post title preview"}</p>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{form.desc || "Description preview..."}</p>
            </div>
          </div>
          {/* Featured + Published */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
              <div><p className="text-sm font-semibold text-gray-800">⭐ Featured Post</p><p className="text-xs text-gray-500 mt-0.5">Shown as the hero post at the top of the blog</p></div>
              <Toggle value={form.featured} onChange={() => set("featured", !form.featured)} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div><p className="text-sm font-semibold text-gray-800">Publish Post</p><p className="text-xs text-gray-500 mt-0.5">Make visible on the public blog page</p></div>
              <Toggle value={form.published} onChange={() => set("published", !form.published)} />
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.title.trim() || !form.desc.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Publish Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Author Modal ─────────────────────────────────────────────────────────────

function AuthorModal({ initial, onSave, onClose, saving }: {
  initial: AuthorDraft; onSave: (d: AuthorDraft) => Promise<void>; onClose: () => void; saving: boolean;
}) {
  const [form, setForm] = useState({ ...initial });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? "Edit Author" : "New Author"}</h2>
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
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Brian Chen" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Role / Title</label>
            <input value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Lead Engineer" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.name.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-sm">
            {saving && <Spinner />}{form.id ? "Save Changes" : "Add Author"}
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

export default function BlogSettingsPage() {
  const [tab, setTab] = useState<"posts" | "authors" | "topics">("posts");

  const [posts,    setPosts]    = useState<BlogPost[]>([]);
  const [authors,  setAuthors]  = useState<BlogAuthor[]>([]);
  const [topics,   setTopics]   = useState<BlogTopic[]>([]);
  const [newTopic, setNewTopic] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);

  const [postModal,    setPostModal]    = useState<PostDraft   | null>(null);
  const [authorModal,  setAuthorModal]  = useState<AuthorDraft | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "post" | "author" | "topic"; id?: string; label: string } | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 2800);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    Promise.all([getPosts(), getAuthors(), getTopics()])
      .then(([p, a, t]) => { setPosts(p); setAuthors(a); setTopics(t); })
      .catch(() => showToast("Failed to load data", "error"))
      .finally(() => setPageLoading(false));
  }, [showToast]);

  // ── Post CRUD ──────────────────────────────────────────────────────────────

  const savePost = async (data: PostDraft) => {
    setSaving(true);
    const payload: Omit<BlogPost, "id"> = {
      emoji: data.emoji, category: data.category, badge: data.badge,
      title: data.title, desc: data.desc, author: data.author,
      author_emoji: data.author_emoji, role: data.role,
      date: data.date, read_time: data.read_time, color: data.color,
      featured: data.featured, published: data.published,
    };
    try {
      if (data.id) {
        const updated = await updatePost(data.id, payload);
        // If setting featured, unset others locally
        if (updated.featured) {
          setPosts(p => p.map(x => x.id !== updated.id ? { ...x, featured: false } : updated));
        } else {
          setPosts(p => p.map(x => x.id === updated.id ? updated : x));
        }
        showToast("Post updated ✓");
      } else {
        const created = await createPost(payload);
        if (created.featured) {
          setPosts(p => [...p.map(x => ({ ...x, featured: false })), created]);
        } else {
          setPosts(p => [...p, created]);
        }
        showToast("Post added ✓");
      }
      setPostModal(null);
    } catch { showToast("Failed to save post", "error"); }
    finally { setSaving(false); }
  };

  const handleTogglePost = async (id: string) => {
    try {
      const updated = await togglePostPublish(id);
      setPosts(p => p.map(x => x.id === updated.id ? updated : x));
    } catch { showToast("Failed to toggle", "error"); }
  };

  const handleSetFeatured = async (id: string) => {
    try {
      const updated = await setFeaturedPost(id);
      setPosts(p => p.map(x => x.id === updated.id ? updated : { ...x, featured: false }));
    } catch { showToast("Failed to set featured", "error"); }
  };

  // ── Author CRUD ────────────────────────────────────────────────────────────

  const saveAuthor = async (data: AuthorDraft) => {
    setSaving(true);
    const payload = { name: data.name, role: data.role, emoji: data.emoji };
    try {
      if (data.id) {
        const updated = await updateAuthor(data.id, payload);
        setAuthors(p => p.map(x => x.id === updated.id ? updated : x));
        showToast("Author updated ✓");
      } else {
        const created = await createAuthor(payload);
        setAuthors(p => [...p, created]);
        showToast("Author added ✓");
      }
      setAuthorModal(null);
    } catch { showToast("Failed to save author", "error"); }
    finally { setSaving(false); }
  };

  // ── Topic CRUD ─────────────────────────────────────────────────────────────

  const addTopic = async () => {
    const label = newTopic.trim();
    if (!label || topics.some(t => t.label === label)) return;
    try {
      const created = await createTopic(label);
      setTopics(p => [...p, created]);
      setNewTopic("");
      showToast(`Topic "${label}" added ✓`);
    } catch { showToast("Failed to add topic", "error"); }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { type, id } = deleteTarget;
      if (type === "post"   && id) { await apiDeletePost(id);   setPosts(p    => p.filter(x => x.id !== id)); }
      if (type === "author" && id) { await apiDeleteAuthor(id); setAuthors(p  => p.filter(x => x.id !== id)); }
      if (type === "topic"  && id) { await apiDeleteTopic(id);  setTopics(p   => p.filter(x => x.id !== id)); }
      setDeleteTarget(null);
      showToast("Deleted");
    } catch { showToast("Failed to delete", "error"); }
    finally { setDeleting(false); }
  };

  // ── Derived ────────────────────────────────────────────────────────────────

  const publishedPosts = posts.filter(p => p.published).length;
  const draftPosts     = posts.length - publishedPosts;
  const featuredPost   = posts.find(p => p.featured);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading blog settings...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Blog Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage posts, authors, and topics shown on the public blog.</p>
        </div>
        <a href="/blog" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          Preview Blog
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Posts", value: posts.length,   icon: "📝", color: "from-violet-500 to-indigo-500" },
          { label: "Published",   value: publishedPosts, icon: "✅", color: "from-emerald-500 to-teal-500" },
          { label: "Drafts",      value: draftPosts,     icon: "📋", color: "from-amber-500 to-orange-500" },
          { label: "Authors",     value: authors.length, icon: "✍️", color: "from-blue-500 to-cyan-500" },
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
          <TabBtn active={tab === "posts"}   onClick={() => setTab("posts")}   icon="📝" label="Posts"   count={posts.length} />
          <TabBtn active={tab === "authors"} onClick={() => setTab("authors")} icon="✍️" label="Authors" count={authors.length} />
          <TabBtn active={tab === "topics"}  onClick={() => setTab("topics")}  icon="🏷️" label="Topics"  count={topics.length} />
          <div className="ml-auto">
            {tab === "posts"   && <button onClick={() => setPostModal(emptyPost())}     className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ New Post</button>}
            {tab === "authors" && <button onClick={() => setAuthorModal(emptyAuthor())} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">+ Add Author</button>}
          </div>
        </div>

        {/* ── Posts Tab ─────────────────────────────────────────────────────── */}
        {tab === "posts" && (
          <div className="divide-y divide-gray-50">
            {posts.length === 0 && <div className="py-20 text-center text-gray-400"><div className="text-5xl mb-4">📝</div><p className="font-medium">No posts yet</p></div>}
            {posts.map(post => (
              <div key={post.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${post.color} flex items-center justify-center text-2xl flex-shrink-0 border border-gray-100`}>{post.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm line-clamp-1">{post.title}</span>
                    {post.featured && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⭐ Featured</span>}
                    <StatusDot published={post.published} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.badge}`}>{post.category}</span>
                    <span className="text-xs text-gray-400">{post.author_emoji} {post.author}</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{post.read_time}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{post.desc}</p>
                </div>
                {/* Featured star */}
                <button onClick={() => handleSetFeatured(post.id)} title="Set as featured"
                  className={`p-2 rounded-xl transition flex-shrink-0 ${post.featured ? "text-amber-500 bg-amber-50" : "text-gray-300 hover:text-amber-400 hover:bg-amber-50"}`}>
                  <svg className="w-4 h-4" fill={post.featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <RowActions
                  onEdit={() => setPostModal({ ...post })}
                  onDelete={() => setDeleteTarget({ type: "post", id: post.id, label: post.title })}
                  onToggle={() => handleTogglePost(post.id)}
                  published={post.published}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── Authors Tab ───────────────────────────────────────────────────── */}
        {tab === "authors" && (
          <div className="divide-y divide-gray-50">
            {authors.length === 0 && <div className="py-20 text-center text-gray-400"><div className="text-5xl mb-4">✍️</div><p className="font-medium">No authors yet</p></div>}
            {authors.map(author => {
              const count = posts.filter(p => p.author === author.name).length;
              return (
                <div key={author.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">{author.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{author.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{author.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0 mr-2">
                    <p className="text-lg font-extrabold text-violet-600">{count}</p>
                    <p className="text-xs text-gray-400">posts</p>
                  </div>
                  <RowActions
                    onEdit={() => setAuthorModal({ ...author })}
                    onDelete={() => setDeleteTarget({ type: "author", id: author.id, label: author.name })}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* ── Topics Tab ────────────────────────────────────────────────────── */}
        {tab === "topics" && (
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-4">Topics are shown in the "Popular Topics" sidebar on the blog page.</p>
            <div className="flex gap-2 mb-6">
              <input value={newTopic} onChange={e => setNewTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTopic())}
                placeholder="New topic (Enter to add)..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400" />
              <button onClick={addTopic} className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-sm">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map(topic => (
                <div key={topic.id} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 group">
                  {topic.label}
                  <button onClick={() => setDeleteTarget({ type: "topic", id: topic.id, label: topic.label })}
                    className="text-gray-300 hover:text-rose-500 transition text-base leading-none font-bold">×</button>
                </div>
              ))}
              {topics.length === 0 && <p className="text-gray-400 text-sm">No topics yet.</p>}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Featured + Category Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900">Featured Post</h2>
              <p className="text-xs text-gray-400 mt-0.5">Shown as the hero at the top of the blog</p>
            </div>
            <button onClick={() => setPostModal(emptyPost())} className="text-sm text-violet-600 font-medium hover:underline">New post →</button>
          </div>
          {featuredPost ? (
            <div className={`rounded-xl bg-gradient-to-br ${featuredPost.color} border border-gray-100 p-5 mb-6`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{featuredPost.emoji}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${featuredPost.badge}`}>{featuredPost.category}</span>
                <span className="ml-auto text-xs bg-white border border-gray-100 px-2 py-0.5 rounded-full text-gray-500">⭐ Featured</span>
              </div>
              <p className="font-bold text-gray-900 leading-snug mb-1">{featuredPost.title}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{featuredPost.desc}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/60">
                <span className="text-xs text-gray-500">{featuredPost.author_emoji} {featuredPost.author}{featuredPost.role ? ` · ${featuredPost.role}` : ""}</span>
                <span className="text-xs text-gray-400">{featuredPost.date} · {featuredPost.read_time}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center text-gray-400 mb-6">
              <p className="text-2xl mb-2">⭐</p>
              <p className="text-sm font-medium">No featured post set</p>
              <p className="text-xs mt-1">Click the ★ on any post to feature it</p>
            </div>
          )}
          {/* Category breakdown */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Posts by Category</p>
          <div className="space-y-2">
            {CATEGORY_OPTIONS.filter(cat => posts.some(p => p.category === cat)).map(cat => {
              const count = posts.filter(p => p.category === cat).length;
              const pct   = Math.round((count / posts.length) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">{cat}</span>
                    <span className="text-gray-400">{count} post{count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Authors + Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Top Authors</h2>
              <button onClick={() => setAuthorModal(emptyAuthor())} className="text-sm text-violet-600 font-medium hover:underline">+ Add</button>
            </div>
            <div className="space-y-3">
              {authors.map(author => {
                const count = posts.filter(p => p.author === author.name).length;
                return (
                  <div key={author.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-base flex-shrink-0">{author.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{author.name}</p>
                      <p className="text-xs text-gray-400 truncate">{author.role}</p>
                    </div>
                    <span className="text-xs font-bold text-violet-600 flex-shrink-0">{count} posts</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { icon: "📝", label: "Write New Post",  action: () => setPostModal(emptyPost()),       color: "hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200" },
                { icon: "✍️", label: "Add Author",       action: () => setAuthorModal(emptyAuthor()),   color: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" },
                { icon: "🏷️", label: "Manage Topics",    action: () => setTab("topics"),                color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" },
                { icon: "🌐", label: "Preview Blog",     action: () => window.open("/blog", "_blank"),  color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" },
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
      {postModal   && <PostModal   initial={postModal}   authors={authors} onSave={savePost}   onClose={() => setPostModal(null)}   saving={saving} />}
      {authorModal && <AuthorModal initial={authorModal}                   onSave={saveAuthor} onClose={() => setAuthorModal(null)} saving={saving} />}
      {deleteTarget && <DeleteConfirm label={deleteTarget.label} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} deleting={deleting} />}
    </div>
  );
}