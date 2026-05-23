import { useState, useEffect, useRef } from "react";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from './firebase/config';

// ─── FIREBASE HOOK ────────────────────────────────────────────────────────────
function useProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'problems'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProblems(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addProblem = async (form) => {
    await addDoc(collection(db, 'problems'), {
      ...form,
      createdAt: serverTimestamp(),
      lastPracticed: form.lastPracticed || null,
    });
  };

  const editProblem = async (updated) => {
    const { id, ...rest } = updated;
    await updateDoc(doc(db, 'problems', id), rest);
  };

  const deleteProblem = async (id) => {
    await deleteDoc(doc(db, 'problems', id));
  };

  const toggleRevision = async (id) => {
    const prob = problems.find(p => p.id === id);
    if (prob) await updateDoc(doc(db, 'problems', id), { revision: !prob.revision });
  };

  return { problems, loading, addProblem, editProblem, deleteProblem, toggleRevision };
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TOPICS = [
  { id: "arrays", label: "Arrays", icon: "⬛" },
  { id: "strings", label: "Strings", icon: "🔤" },
  { id: "linked-list", label: "Linked List", icon: "🔗" },
  { id: "stack", label: "Stack", icon: "📚" },
  { id: "queue", label: "Queue", icon: "🎫" },
  { id: "sliding-window", label: "Sliding Window", icon: "🪟" },
  { id: "binary-search", label: "Binary Search", icon: "🔍" },
  { id: "two-pointers", label: "Two Pointers", icon: "👆" },
  { id: "prefix-sum", label: "Prefix Sum", icon: "➕" },
  { id: "recursion", label: "Recursion", icon: "♻️" },
  { id: "backtracking", label: "Backtracking", icon: "↩️" },
  { id: "trees", label: "Trees", icon: "🌳" },
  { id: "bst", label: "BST", icon: "🌲" },
  { id: "heap", label: "Heap", icon: "⛰️" },
  { id: "graphs", label: "Graphs", icon: "🕸️" },
  { id: "advanced-graphs", label: "Advanced Graphs", icon: "🗺️" },
  { id: "dp", label: "Dynamic Programming", icon: "💡" },
  { id: "greedy", label: "Greedy", icon: "🤑" },
  { id: "tries", label: "Tries", icon: "🌐" },
  { id: "bit-manipulation", label: "Bit Manipulation", icon: "⚙️" },
  { id: "math", label: "Math", icon: "🔢" },
  { id: "segment-tree", label: "Segment Tree", icon: "📊" },
  { id: "dsu", label: "Disjoint Set Union", icon: "🔀" },
  { id: "codeforces", label: "Codeforces Practice", icon: "🏆" },
  { id: "revision", label: "Revision List", icon: "📌" },
  { id: "mock", label: "Mock Interviews", icon: "🎯" },
  { id: "contests", label: "Contest Questions", icon: "⚔️" },
  { id: "favorites", label: "Favorite Problems", icon: "⭐" },
];

const PLATFORMS = ["LeetCode", "Codeforces", "CodeChef", "AtCoder", "GFG", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const STATUSES = ["Solved", "Revising", "Needs Practice"];

const PLATFORM_COLORS = {
  LeetCode:   { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  Codeforces: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  CodeChef:   { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" },
  AtCoder:    { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  GFG:        { bg: "#F0FDF4", text: "#15803D", border: "#86EFAC" },
  Other:      { bg: "#F8FAFC", text: "#475569", border: "#E2E8F0" },
};

const DIFF_COLORS = {
  Easy:   { bg: "#F0FDF4", text: "#166534", border: "#86EFAC" },
  Medium: { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  Hard:   { bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" },
};

const STATUS_COLORS = {
  Solved:           { bg: "#F0FDF4", text: "#166534", dot: "#22C55E" },
  Revising:         { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
  "Needs Practice": { bg: "#FFF1F2", text: "#9F1239", dot: "#EF4444" },
};

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --font:'DM Sans',sans-serif;
  --mono:'DM Mono',monospace;
  --bg:#F9FAFB;
  --surface:#FFFFFF;
  --surface2:#F3F4F6;
  --border:#E5E7EB;
  --border2:#D1D5DB;
  --text:#111827;
  --text2:#374151;
  --text3:#6B7280;
  --text4:#9CA3AF;
  --accent:#2563EB;
  --accent-light:#EFF6FF;
  --accent-hover:#1D4ED8;
  --green:#22C55E;
  --amber:#F59E0B;
  --red:#EF4444;
  --shadow:0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.05);
  --shadow2:0 4px 6px -1px rgba(0,0,0,.08),0 2px 4px -1px rgba(0,0,0,.04);
  --shadow3:0 10px 15px -3px rgba(0,0,0,.08),0 4px 6px -2px rgba(0,0,0,.04);
  --radius:10px;
  --radius2:14px;
  --sidebar:240px;
  --transition:.18s cubic-bezier(.4,0,.2,1);
}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}
input,textarea,select,button{font-family:var(--font)}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px}
.app{display:flex;height:100vh;overflow:hidden}
.sidebar{width:var(--sidebar);flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;transition:width var(--transition)}
.sidebar.collapsed{width:56px}
.sidebar-logo{padding:18px 16px 14px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border)}
.logo-mark{width:30px;height:30px;border-radius:8px;background:var(--accent);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;flex-shrink:0}
.logo-text{font-size:15px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden}
.logo-text span{color:var(--accent)}
.sidebar-nav{flex:1;overflow-y:auto;padding:10px 0}
.nav-section-label{padding:8px 16px 4px;font-size:10px;font-weight:600;color:var(--text4);text-transform:uppercase;letter-spacing:.7px;white-space:nowrap;overflow:hidden}
.nav-item{display:flex;align-items:center;gap:10px;padding:7px 14px;cursor:pointer;border-radius:var(--radius);margin:1px 6px;transition:background var(--transition),color var(--transition);color:var(--text3);font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden}
.nav-item:hover{background:var(--surface2);color:var(--text)}
.nav-item.active{background:var(--accent-light);color:var(--accent)}
.nav-icon{font-size:15px;flex-shrink:0;width:20px;text-align:center}
.nav-count{margin-left:auto;font-size:10px;background:var(--surface2);color:var(--text4);padding:2px 7px;border-radius:20px;flex-shrink:0}
.nav-item.active .nav-count{background:rgba(37,99,235,.15);color:var(--accent)}
.sidebar-footer{padding:12px;border-top:1px solid var(--border)}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.topbar{height:56px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;gap:12px;flex-shrink:0}
.topbar-title{font-size:16px;font-weight:600;color:var(--text);flex:1}
.search-wrap{position:relative;flex:1;max-width:320px}
.search-input{width:100%;padding:7px 12px 7px 34px;border:1.5px solid var(--border);border-radius:var(--radius);font-size:13px;background:var(--surface2);color:var(--text);outline:none;transition:border var(--transition),background var(--transition)}
.search-input:focus{border-color:var(--accent);background:var(--surface)}
.search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text4);font-size:14px;pointer-events:none}
.topbar-actions{display:flex;align-items:center;gap:8px}
.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--radius);font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid transparent;transition:all var(--transition)}
.btn-primary{background:var(--accent);color:#fff;border-color:var(--accent)}
.btn-primary:hover{background:var(--accent-hover);border-color:var(--accent-hover)}
.btn-secondary{background:var(--surface);color:var(--text2);border-color:var(--border)}
.btn-secondary:hover{background:var(--surface2);border-color:var(--border2)}
.btn-ghost{background:transparent;color:var(--text3);border-color:transparent;padding:6px 10px}
.btn-ghost:hover{background:var(--surface2);color:var(--text)}
.btn-danger{background:#FFF1F2;color:#9F1239;border-color:#FECDD3}
.btn-danger:hover{background:#FFE4E6;border-color:#FDA4AF}
.btn-sm{padding:5px 10px;font-size:12px}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:500;border-width:1px;border-style:solid}
.page-content{flex:1;overflow-y:auto;padding:24px}
.page-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:24px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius2);padding:18px 20px;display:flex;align-items:flex-start;gap:14px;box-shadow:var(--shadow);transition:box-shadow var(--transition)}
.stat-card:hover{box-shadow:var(--shadow2)}
.stat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.stat-body{flex:1}
.stat-val{font-size:26px;font-weight:700;color:var(--text);line-height:1}
.stat-label{font-size:12px;color:var(--text3);margin-top:3px}
.stat-sub{font-size:11px;color:var(--text4);margin-top:2px}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius2);box-shadow:var(--shadow);overflow:hidden;margin-bottom:10px}
.topic-header{display:flex;align-items:center;gap:10px;padding:13px 16px;cursor:pointer;user-select:none;transition:background var(--transition)}
.topic-header:hover{background:var(--surface2)}
.topic-icon-wrap{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;background:var(--surface2);flex-shrink:0}
.topic-title-group{flex:1}
.topic-name{font-size:13px;font-weight:600;color:var(--text)}
.topic-meta{font-size:11px;color:var(--text4);margin-top:1px}
.topic-actions{display:flex;align-items:center;gap:8px}
.chevron{color:var(--text4);font-size:12px;transition:transform var(--transition);flex-shrink:0}
.chevron.open{transform:rotate(90deg)}
.progress-bar-wrap{height:4px;background:var(--surface2);border-radius:4px;overflow:hidden;margin-top:5px;max-width:120px}
.progress-bar-fill{height:100%;border-radius:4px;background:var(--accent);transition:width .4s ease}
.topic-body{border-top:1px solid var(--border)}
.problem-row{display:flex;align-items:center;gap:10px;padding:11px 16px;border-bottom:1px solid var(--border);transition:background var(--transition);animation:fadeIn .2s ease}
.problem-row:last-child{border-bottom:none}
.problem-row:hover{background:var(--surface2)}
@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.prob-check{width:16px;height:16px;border:1.5px solid var(--border2);border-radius:4px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all var(--transition)}
.prob-check.checked{background:var(--accent);border-color:var(--accent)}
.prob-name{font-size:13px;font-weight:500;color:var(--text);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}
.prob-name a{color:inherit;text-decoration:none}
.prob-name a:hover{color:var(--accent)}
.prob-badges{display:flex;align-items:center;gap:5px;flex-wrap:wrap;flex-shrink:0}
.prob-meta{font-size:11px;color:var(--text4);flex-shrink:0;white-space:nowrap}
.prob-actions{display:flex;gap:4px;flex-shrink:0;opacity:0;transition:opacity var(--transition)}
.problem-row:hover .prob-actions{opacity:1}
.icon-btn{width:26px;height:26px;border:none;background:transparent;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:13px;transition:all var(--transition)}
.icon-btn:hover{background:var(--surface);color:var(--text)}
.icon-btn.danger:hover{background:#FFF1F2;color:#EF4444}
.empty-topic{padding:24px 16px;text-align:center;color:var(--text4);font-size:13px}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;backdrop-filter:blur(2px);animation:fadeOverlay .15s ease}
@keyframes fadeOverlay{from{opacity:0}to{opacity:1}}
.modal{background:var(--surface);border-radius:var(--radius2);box-shadow:var(--shadow3);width:100%;max-width:540px;max-height:90vh;overflow-y:auto;animation:slideUp .2s ease}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.modal-header{padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between}
.modal-title{font-size:16px;font-weight:650;color:var(--text)}
.modal-body{padding:20px 24px}
.form-row{margin-bottom:14px}
.form-row label{display:block;font-size:12px;font-weight:500;color:var(--text2);margin-bottom:5px}
.form-row input,.form-row select,.form-row textarea{width:100%;padding:8px 12px;border:1.5px solid var(--border);border-radius:var(--radius);font-size:13px;color:var(--text);background:var(--surface);outline:none;transition:border var(--transition)}
.form-row input:focus,.form-row select:focus,.form-row textarea:focus{border-color:var(--accent)}
.form-row textarea{min-height:80px;resize:vertical;line-height:1.5}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.filter-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.filter-chip{padding:5px 12px;border-radius:20px;border:1.5px solid var(--border);font-size:12px;font-weight:500;cursor:pointer;background:var(--surface);color:var(--text3);transition:all var(--transition)}
.filter-chip:hover{border-color:var(--border2);color:var(--text)}
.filter-chip.active{background:var(--accent-light);border-color:var(--accent);color:var(--accent)}
.progress-table{width:100%;border-collapse:collapse}
.progress-table th{text-align:left;padding:8px 10px;font-size:11px;font-weight:600;color:var(--text4);text-transform:uppercase;letter-spacing:.4px;border-bottom:1px solid var(--border)}
.progress-table td{padding:8px 10px;border-bottom:1px solid var(--border);font-size:13px}
.progress-table tr:last-child td{border-bottom:none}
.progress-table tr:hover td{background:var(--surface2)}
.page-title{font-size:22px;font-weight:700;color:var(--text);margin-bottom:4px}
.page-subtitle{font-size:13px;color:var(--text3);margin-bottom:20px}
.avatar{width:32px;height:32px;border-radius:50%;background:var(--accent-light);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--accent)}
.notes-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius2);padding:16px;cursor:pointer;transition:all var(--transition);box-shadow:var(--shadow)}
.notes-card:hover{box-shadow:var(--shadow2);border-color:var(--border2)}
.notes-title{font-size:13px;font-weight:600;color:var(--text);margin-bottom:4px}
.notes-preview{font-size:12px;color:var(--text3);line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.notes-meta{font-size:11px;color:var(--text4);margin-top:8px}
.contest-row{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);transition:background var(--transition)}
.contest-row:hover{background:var(--surface2)}
.contest-row:last-child{border-bottom:none}
.toast{position:fixed;bottom:24px;right:24px;background:var(--text);color:#fff;padding:10px 18px;border-radius:var(--radius);font-size:13px;font-weight:500;box-shadow:var(--shadow3);z-index:9999;animation:toastIn .25s ease}
@keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.settings-section{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius2);padding:20px;margin-bottom:14px;box-shadow:var(--shadow)}
.settings-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)}
.settings-row:last-child{border-bottom:none}
.toggle{width:36px;height:20px;border-radius:20px;background:var(--border2);cursor:pointer;position:relative;transition:background var(--transition)}
.toggle.on{background:var(--accent)}
.toggle::after{content:'';width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:transform var(--transition);box-shadow:0 1px 3px rgba(0,0,0,.2)}
.toggle.on::after{transform:translateX(16px)}
.loading-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:'DM Sans',sans-serif;gap:12px}
.loading-spinner{width:32px;height:32px;border:3px solid #E5E7EB;border-top-color:#2563EB;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
`;

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function Badge({ children, style }) {
  return <span className="badge" style={style}>{children}</span>;
}
function DiffBadge({ diff }) {
  if (!diff) return null;
  const c = DIFF_COLORS[diff] || DIFF_COLORS.Easy;
  return <Badge style={{ background: c.bg, color: c.text, borderColor: c.border }}>{diff}</Badge>;
}
function PlatformBadge({ platform }) {
  if (!platform) return null;
  const c = PLATFORM_COLORS[platform] || PLATFORM_COLORS.Other;
  return <Badge style={{ background: c.bg, color: c.text, borderColor: c.border }}>{platform}</Badge>;
}
function StatusBadge({ status }) {
  if (!status) return null;
  const c = STATUS_COLORS[status] || STATUS_COLORS.Solved;
  return (
    <Badge style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {status}
    </Badge>
  );
}
function Toast({ msg }) {
  if (!msg) return null;
  return <div className="toast">{msg}</div>;
}
function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="icon-btn" onClick={onClose} style={{ fontSize: 18 }}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
function FormRow({ label, children }) {
  return <div className="form-row"><label>{label}</label>{children}</div>;
}

// ─── PROBLEM FORM ─────────────────────────────────────────────────────────────
function ProblemForm({ initial = {}, topics, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "", url: "", platform: "LeetCode", difficulty: "Easy",
    topic: topics?.[0]?.id || "", status: "Needs Practice",
    notes: "", revision: false, lastPracticed: "", ...initial,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <>
      <FormRow label="Problem Title *">
        <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Two Sum" />
      </FormRow>
      <FormRow label="Problem URL">
        <input value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://leetcode.com/problems/..." />
      </FormRow>
      <div className="form-grid">
        <FormRow label="Platform">
          <select value={form.platform} onChange={e => set("platform", e.target.value)}>
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
        </FormRow>
        <FormRow label="Difficulty">
          <select value={form.difficulty} onChange={e => set("difficulty", e.target.value)}>
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
          </select>
        </FormRow>
        <FormRow label="Topic">
          <select value={form.topic} onChange={e => set("topic", e.target.value)}>
            {topics.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </FormRow>
        <FormRow label="Status">
          <select value={form.status} onChange={e => set("status", e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </FormRow>
      </div>
      <FormRow label="Last Practiced">
        <input type="date" value={form.lastPracticed} onChange={e => set("lastPracticed", e.target.value)} />
      </FormRow>
      <FormRow label="Notes">
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Key observations, approach, time/space complexity..." />
      </FormRow>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" id="rev-check" checked={form.revision} onChange={e => set("revision", e.target.checked)} style={{ width: 16, height: 16 }} />
        <label htmlFor="rev-check" style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500, cursor: "pointer" }}>Mark for Revision</label>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={() => form.title.trim() && onSave(form)}>Save Problem</button>
      </div>
    </>
  );
}

// ─── TOPIC SECTION ────────────────────────────────────────────────────────────
function TopicSection({ topic, problems, filter, onAdd, onEdit, onDelete, onToggleRevision }) {
  const [open, setOpen] = useState(false);
  const filtered = problems.filter(p => {
    if (filter.status && p.status !== filter.status) return false;
    if (filter.platform && p.platform !== filter.platform) return false;
    if (filter.difficulty && p.difficulty !== filter.difficulty) return false;
    return true;
  });
  const solved = problems.filter(p => p.status === "Solved").length;
  const pct = problems.length ? Math.round((solved / problems.length) * 100) : 0;
  return (
    <div className="card">
      <div className="topic-header" onClick={() => setOpen(o => !o)}>
        <div className="topic-icon-wrap">{topic.icon}</div>
        <div className="topic-title-group">
          <div className="topic-name">{topic.label}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="topic-meta">{solved}/{problems.length} solved</div>
            <div className="progress-bar-wrap" style={{ maxWidth: 80 }}>
              <div className="progress-bar-fill" style={{ width: pct + "%" }} />
            </div>
            <div className="topic-meta" style={{ color: "var(--accent)" }}>{pct}%</div>
          </div>
        </div>
        <div className="topic-actions" onClick={e => e.stopPropagation()}>
          <button className="btn btn-primary btn-sm" onClick={() => onAdd(topic.id)}>+ Add</button>
        </div>
        <div className={`chevron ${open ? "open" : ""}`}>▶</div>
      </div>
      {open && (
        <div className="topic-body">
          {filtered.length === 0 ? (
            <div className="empty-topic">
              <div style={{ fontSize: 28, marginBottom: 6 }}>📋</div>
              <div>No problems yet. Click <strong>+ Add</strong> to get started.</div>
            </div>
          ) : filtered.map(prob => (
            <div className="problem-row" key={prob.id}>
              <div
                className={`prob-check ${prob.status === "Solved" ? "checked" : ""}`}
                onClick={() => onEdit({ ...prob, status: prob.status === "Solved" ? "Needs Practice" : "Solved" })}
              >
                {prob.status === "Solved" && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
              </div>
              <div className="prob-name">
                {prob.url ? <a href={prob.url} target="_blank" rel="noreferrer">{prob.title}</a> : prob.title}
              </div>
              <div className="prob-badges">
                <PlatformBadge platform={prob.platform} />
                <DiffBadge diff={prob.difficulty} />
                <StatusBadge status={prob.status} />
                {prob.revision && <Badge style={{ background: "#FFFBEB", color: "#92400E", borderColor: "#FDE68A" }}>📌 Revision</Badge>}
              </div>
              <div className="prob-meta">{fmt(prob.lastPracticed)}</div>
              <div className="prob-actions">
                <button className="icon-btn" title="Edit" onClick={() => onEdit(prob)}>✏️</button>
                <button className="icon-btn" title="Toggle Revision" onClick={() => onToggleRevision(prob.id)}>📌</button>
                <button className="icon-btn danger" title="Delete" onClick={() => onDelete(prob.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function Dashboard({ problems }) {
  const solved = problems.filter(p => p.status === "Solved").length;
  const revising = problems.filter(p => p.status === "Revising").length;
  const needsPractice = problems.filter(p => p.status === "Needs Practice").length;
  const forRevision = problems.filter(p => p.revision).length;
  const topicStats = TOPICS.map(t => {
    const tp = problems.filter(p => p.topic === t.id);
    return { ...t, total: tp.length, solved: tp.filter(p => p.status === "Solved").length };
  }).filter(t => t.total > 0);
  return (
    <div className="page-content">
      <div className="page-title">Dashboard</div>
      <div className="page-subtitle">Your DSA practice overview at a glance.</div>
      <div className="page-grid">
        {[
          { icon: "✅", bg: "#F0FDF4", val: solved,       color: "#22C55E",       label: "Problems Solved" },
          { icon: "🔄", bg: "#FFFBEB", val: revising,     color: "#F59E0B",       label: "Revising" },
          { icon: "⚠️", bg: "#FFF1F2", val: needsPractice,color: "#EF4444",       label: "Needs Practice" },
          { icon: "📌", bg: "#EFF6FF", val: forRevision,  color: "#2563EB",       label: "Marked for Revision" },
          { icon: "📊", bg: "#F5F3FF", val: problems.length, color: "var(--text)", label: "Total Tracked" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-body">
              <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      {topicStats.length > 0 && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 15, fontWeight: 650, color: "var(--text)" }}>Progress by Topic</div>
          </div>
          <table className="progress-table">
            <thead><tr><th>Topic</th><th>Solved</th><th>Total</th><th>Progress</th></tr></thead>
            <tbody>
              {topicStats.sort((a, b) => b.solved - a.solved).map(t => {
                const pct = t.total ? Math.round((t.solved / t.total) * 100) : 0;
                return (
                  <tr key={t.id}>
                    <td><span style={{ marginRight: 6 }}>{t.icon}</span>{t.label}</td>
                    <td style={{ fontWeight: 600, color: "#22C55E" }}>{t.solved}</td>
                    <td style={{ color: "var(--text3)" }}>{t.total}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="progress-bar-wrap" style={{ flex: 1, maxWidth: "none" }}>
                          <div className="progress-bar-fill" style={{ width: pct + "%" }} />
                        </div>
                        <span style={{ fontSize: 11, color: "var(--text3)", minWidth: 28 }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {problems.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>Start your DSA journey</div>
          <div style={{ fontSize: 13 }}>Go to Practice and add your first problem.</div>
        </div>
      )}
    </div>
  );
}

function Practice({ problems, onAdd, onEdit, onDelete, onToggleRevision, search }) {
  const [filter, setFilter] = useState({ status: "", platform: "", difficulty: "" });
  const [openModal, setOpenModal] = useState(false);
  const [editingProb, setEditingProb] = useState(null);
  const [addTopic, setAddTopic] = useState("");

  const handleAdd = (topicId) => { setAddTopic(topicId); setEditingProb(null); setOpenModal(true); };
  const handleEditModal = (prob) => { setEditingProb(prob); setAddTopic(prob.topic); setOpenModal(true); };
  const handleSave = async (form) => {
    if (editingProb && editingProb.id) { await onEdit({ ...editingProb, ...form }); }
    else { await onAdd({ ...form, topic: addTopic }); }
    setOpenModal(false);
  };

  const searchedProblems = search
    ? problems.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()))
    : problems;

  return (
    <div className="page-content">
      <div className="page-title">Topic-wise Practice</div>
      <div className="page-subtitle">Browse and manage problems by topic.</div>
      <div className="filter-bar">
        {["", ...STATUSES].map(s => (
          <button key={s} className={`filter-chip ${filter.status === s ? "active" : ""}`} onClick={() => setFilter(f => ({ ...f, status: s }))}>
            {s || "All Status"}
          </button>
        ))}
        <div style={{ width: 1, height: 20, background: "var(--border)" }} />
        {["", ...DIFFICULTIES].map(d => (
          <button key={d} className={`filter-chip ${filter.difficulty === d ? "active" : ""}`} onClick={() => setFilter(f => ({ ...f, difficulty: d }))}>
            {d || "All Levels"}
          </button>
        ))}
        <div style={{ width: 1, height: 20, background: "var(--border)" }} />
        {["", ...PLATFORMS].map(p => (
          <button key={p} className={`filter-chip ${filter.platform === p ? "active" : ""}`} onClick={() => setFilter(f => ({ ...f, platform: p }))}>
            {p || "All Platforms"}
          </button>
        ))}
      </div>
      {TOPICS.map(t => (
        <TopicSection key={t.id} topic={t} filter={filter}
          problems={searchedProblems.filter(p => p.topic === t.id)}
          onAdd={handleAdd} onEdit={handleEditModal} onDelete={onDelete} onToggleRevision={onToggleRevision} />
      ))}
      <Modal open={openModal} title={editingProb?.id ? "Edit Problem" : "Add Problem"} onClose={() => setOpenModal(false)}>
        <ProblemForm
          initial={editingProb ? { ...editingProb } : { topic: addTopic }}
          topics={TOPICS} onSave={handleSave} onCancel={() => setOpenModal(false)} />
      </Modal>
    </div>
  );
}

function Revision({ problems, onEdit, onDelete }) {
  const [openModal, setOpenModal] = useState(false);
  const [editingProb, setEditingProb] = useState(null);
  const revProbs = problems.filter(p => p.revision || p.status === "Revising");

  const handleEditModal = (prob) => { setEditingProb(prob); setOpenModal(true); };
  const handleSave = async (form) => { await onEdit({ ...editingProb, ...form }); setOpenModal(false); };

  return (
    <div className="page-content">
      <div className="page-title">Revision Planner</div>
      <div className="page-subtitle">Problems marked for revision or currently revising.</div>
      {revProbs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📌</div>
          <div style={{ fontSize: 14 }}>No problems marked for revision yet.</div>
        </div>
      ) : (
        <div className="card">
          {revProbs.map(prob => (
            <div className="problem-row" key={prob.id}>
              <div className="prob-name">
                {prob.url ? <a href={prob.url} target="_blank" rel="noreferrer">{prob.title}</a> : prob.title}
              </div>
              <div className="prob-badges">
                <PlatformBadge platform={prob.platform} />
                <DiffBadge diff={prob.difficulty} />
                <StatusBadge status={prob.status} />
              </div>
              <div className="prob-meta">{TOPICS.find(t => t.id === prob.topic)?.label}</div>
              <div className="prob-meta">{fmt(prob.lastPracticed)}</div>
              <div className="prob-actions">
                <button className="icon-btn" onClick={() => handleEditModal(prob)}>✏️</button>
                <button className="icon-btn danger" onClick={() => onDelete(prob.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={openModal} title="Edit Problem" onClose={() => setOpenModal(false)}>
        <ProblemForm initial={editingProb ? { ...editingProb } : {}} topics={TOPICS} onSave={handleSave} onCancel={() => setOpenModal(false)} />
      </Modal>
    </div>
  );
}

function Notes({ problems }) {
  const withNotes = problems.filter(p => p.notes && p.notes.trim());
  return (
    <div className="page-content">
      <div className="page-title">Notes</div>
      <div className="page-subtitle">All your problem notes in one place.</div>
      {withNotes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📝</div>
          <div style={{ fontSize: 14 }}>No notes yet. Add notes when editing problems.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
          {withNotes.map(p => (
            <div className="notes-card" key={p.id}>
              <div className="notes-title">{p.title}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                <PlatformBadge platform={p.platform} />
                <DiffBadge diff={p.difficulty} />
              </div>
              <div className="notes-preview" style={{ marginTop: 8 }}>{p.notes}</div>
              <div className="notes-meta">Last practiced: {fmt(p.lastPracticed)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Contests({ problems }) {
  const contestProbs = problems.filter(p => p.topic === "contests");
  return (
    <div className="page-content">
      <div className="page-title">Contest Tracker</div>
      <div className="page-subtitle">Problems from contests and competitive programming.</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 20 }}>
        {["LeetCode", "Codeforces", "CodeChef", "AtCoder"].map(pl => {
          const c = contestProbs.filter(p => p.platform === pl);
          return (
            <div className="stat-card" key={pl}>
              <div className="stat-icon" style={{ background: PLATFORM_COLORS[pl]?.bg || "#F8FAFC" }}>🏆</div>
              <div className="stat-body">
                <div className="stat-val" style={{ color: PLATFORM_COLORS[pl]?.text }}>{c.length}</div>
                <div className="stat-label">{pl}</div>
                <div className="stat-sub">{c.filter(p => p.status === "Solved").length} solved</div>
              </div>
            </div>
          );
        })}
      </div>
      {contestProbs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>⚔️</div>
          <div>Add contest problems from Practice → Contest Questions topic.</div>
        </div>
      ) : (
        <div className="card">
          {contestProbs.map(p => (
            <div className="contest-row" key={p.id}>
              <div style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>{p.title}</div>
              <PlatformBadge platform={p.platform} />
              <DiffBadge diff={p.difficulty} />
              <StatusBadge status={p.status} />
              <div style={{ fontSize: 11, color: "var(--text4)" }}>{fmt(p.lastPracticed)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Settings() {
  const [notif, setNotif] = useState(true);
  const [spaced, setSpaced] = useState(false);
  return (
    <div className="page-content">
      <div className="page-title">Settings</div>
      <div className="page-subtitle">Customize your DSA tracker.</div>
      <div className="settings-section">
        <div style={{ fontSize: 15, fontWeight: 650, marginBottom: 12 }}>Features</div>
        {[["Daily Revision Reminders", notif, setNotif], ["Spaced Repetition (AI)", spaced, setSpaced]].map(([label, val, set]) => (
          <div className="settings-row" key={label}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
            <div className={`toggle ${val ? "on" : ""}`} onClick={() => set(v => !v)} />
          </div>
        ))}
      </div>
      <div className="settings-section">
        <div style={{ fontSize: 15, fontWeight: 650, marginBottom: 8 }}>Firestore Schema</div>
        <div style={{ fontSize: 12, color: "var(--text3)", background: "var(--surface2)", padding: "14px 16px", borderRadius: "var(--radius)", fontFamily: "var(--mono)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
{`Collection: problems/{id}
────────────────────────────
title         string
url           string
platform      LeetCode | Codeforces | CodeChef | AtCoder | GFG
difficulty    Easy | Medium | Hard
topic         string (topic id)
status        Solved | Revising | Needs Practice
revision      boolean
notes         string
lastPracticed date string
createdAt     timestamp`}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const { problems, loading, addProblem, editProblem, deleteProblem, toggleRevision } = useProblems();
  const [page, setPage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  };

  const handleAdd = async (form) => { await addProblem(form); showToast("✅ Problem added"); };
  const handleEdit = async (prob) => { await editProblem(prob); showToast("✏️ Problem updated"); };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;
    await deleteProblem(id);
    showToast("🗑 Deleted");
  };

  const navItems = [
    { label: "Dashboard", icon: "🏠" },
    { label: "Practice",  icon: "💻" },
    { label: "Revision",  icon: "📌" },
    { label: "Notes",     icon: "📝" },
    { label: "Contests",  icon: "🏆" },
    { label: "Settings",  icon: "⚙️" },
  ];

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="loading-screen">
        <div className="loading-spinner" />
        <div style={{ fontSize: 14, color: "#6B7280" }}>Loading your problems...</div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* SIDEBAR */}
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-logo">
            <div className="logo-mark">D</div>
            {!collapsed && <div className="logo-text">dsa<span>.track</span></div>}
          </div>
          <div className="sidebar-nav">
            {!collapsed && <div className="nav-section-label">Navigation</div>}
            {navItems.map(n => (
              <div key={n.label} className={`nav-item ${page === n.label ? "active" : ""}`} onClick={() => setPage(n.label)}>
                <div className="nav-icon">{n.icon}</div>
                {!collapsed && <span>{n.label}</span>}
                {!collapsed && n.label === "Practice" && <span className="nav-count">{problems.length}</span>}
                {!collapsed && n.label === "Revision" && problems.filter(p => p.revision).length > 0 &&
                  <span className="nav-count">{problems.filter(p => p.revision).length}</span>}
              </div>
            ))}
            {!collapsed && (
              <>
                <div className="nav-section-label" style={{ marginTop: 10 }}>Quick Topics</div>
                {TOPICS.slice(0, 12).map(t => {
                  const c = problems.filter(p => p.topic === t.id).length;
                  return (
                    <div key={t.id} className="nav-item" onClick={() => setPage("Practice")}>
                      <div className="nav-icon">{t.icon}</div>
                      <span>{t.label}</span>
                      {c > 0 && <span className="nav-count">{c}</span>}
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <div className="sidebar-footer">
            <div className="nav-item" onClick={() => setCollapsed(c => !c)}>
              <div className="nav-icon">{collapsed ? "▶" : "◀"}</div>
              {!collapsed && <span>Collapse</span>}
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{page}</div>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input className="search-input" placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="topbar-actions">
              <div style={{ fontSize: 13, color: "var(--text3)", background: "var(--surface2)", padding: "5px 12px", borderRadius: "var(--radius)", fontWeight: 500 }}>
                ✅ {problems.filter(p => p.status === "Solved").length} solved
              </div>
              <div className="avatar">U</div>
            </div>
          </div>

          {page === "Dashboard" && <Dashboard problems={problems} />}
          {page === "Practice"  && <Practice  problems={problems} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onToggleRevision={toggleRevision} search={search} />}
          {page === "Revision"  && <Revision  problems={problems} onEdit={handleEdit} onDelete={handleDelete} />}
          {page === "Notes"     && <Notes     problems={problems} />}
          {page === "Contests"  && <Contests  problems={problems} />}
          {page === "Settings"  && <Settings />}
        </div>
      </div>
      <Toast msg={toast} />
    </>
  );
}