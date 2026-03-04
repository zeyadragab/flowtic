import { useEffect } from 'react';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

export function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const isErr = type === 'error';
  return (
    <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-xl border bg-[var(--bg-card)] animate-in slide-in-from-right-4 duration-300"
      style={{ borderColor: isErr ? 'var(--danger)' : 'var(--success)' }}>
      <div className={isErr ? 'text-[var(--danger)]' : 'text-[var(--success)]'}>
        {isErr ? <XCircle size={16}/> : <CheckCircle size={16}/>}
      </div>
      <p className="text-xs font-bold text-[var(--text-bold)]">{msg}</p>
      <button onClick={onClose} className="ml-2 text-[var(--text-body)] hover:text-[var(--text-bold)] transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}

export function Confirm({ msg, onYes, onNo }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-[var(--bg-card)] rounded-xl p-6 w-full max-w-[320px] shadow-2xl border border-[var(--border-hairline)] reveal-snappy">
        <h3 className="text-base font-bold text-[var(--text-bold)] mb-2">Confirmation Required</h3>
        <p className="text-[var(--text-body)] text-xs font-medium mb-6 leading-relaxed">{msg}</p>
        <div className="flex gap-2">
          <button onClick={onYes} className="flex-1 py-2 rounded-lg font-bold text-xs bg-[var(--danger)] text-white hover:opacity-90 transition-all">Delete</button>
          <button onClick={onNo} className="flex-1 py-2 rounded-lg font-bold text-xs bg-[var(--bg-hover)] text-[var(--text-bold)] hover:opacity-90 transition-all">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-[500px] bg-[var(--bg-card)] rounded-xl shadow-2xl border border-[var(--border-hairline)] overflow-hidden reveal-snappy flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-hairline)] shrink-0 bg-[var(--bg-header)]">
          <h2 className="font-bold text-[var(--text-bold)] text-lg tracking-tight">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg text-[var(--text-body)] hover:text-[var(--text-bold)] hover:bg-[var(--bg-hover)] transition-all flex items-center justify-center">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-[10px] font-black text-[var(--text-body)] uppercase tracking-widest mb-1.5 ml-0.5">{label}</label>
      {children}
    </div>
  );
}

export const inputCls = {
  width: '100%', 
  padding: '10px 14px', 
  borderRadius: '8px', 
  border: '1px solid var(--border-hairline)',
  background: 'var(--bg-main)', 
  color: 'var(--text-bold)', 
  fontSize: '13px', 
  fontWeight: '600',
  outline: 'none', 
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
};

export function Pagination({ page, pages, setPage }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-body)] disabled:opacity-30 hover:bg-[var(--bg-hover)]">
        <ChevronLeft size={16}/>
      </button>
      <div className="px-4 py-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-bold)] font-bold text-xs border border-[var(--border-hairline)]">
        PAGE {page} / {pages}
      </div>
      <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-body)] disabled:opacity-30 hover:bg-[var(--bg-hover)]">
        <ChevronRight size={16}/>
      </button>
    </div>
  );
}

export function Badge({ label, color }) {
  return (
    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{label}</span>
  );
}

export function SectionHeader({ title, count, onAdd, addLabel }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="font-bold text-[var(--text-bold)] text-2xl tracking-tight">{title}</h2>
        {count != null && <p className="text-xs font-medium text-[var(--text-body)] mt-1 uppercase tracking-wider">{count} entries found</p>}
      </div>
      {onAdd && (
        <button onClick={onAdd}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-[var(--primary)] text-white shadow hover:bg-[var(--primary-hover)] transition-all">
          <Plus size={18}/> {addLabel || 'Add New'}
        </button>
      )}
    </div>
  );
}

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-[var(--bg-hover)] border-t-[var(--primary)] animate-spin" />
      <p className="text-xs font-bold text-[var(--text-body)] uppercase tracking-wider">Accessing records...</p>
    </div>
  );
}

export function Err({ msg }) {
  return (
    <div className="py-20 text-center">
       <p className="text-sm font-bold text-[var(--danger)]">{msg}</p>
       <p className="text-xs font-medium text-[var(--text-body)] mt-2">Please check connection or refresh</p>
    </div>
  );
}
