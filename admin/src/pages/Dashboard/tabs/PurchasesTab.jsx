import { useState, useEffect, useCallback } from 'react';
import { Trash2, ShoppingBag, User, Calendar, CreditCard } from 'lucide-react';
import api from '../../../services/api';
import { C } from '../constants';
import { Confirm, SectionHeader, Loader, Pagination, Badge } from '../ui';

const STATUS_COLOR = { confirmed: '#10b981', cancelled: '#ef4444', refunded: '#f59e0b' };

export default function PurchasesTab({ toast }) {
  const [data,    setData]    = useState({ purchases: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [status,  setStatus]  = useState('');
  const [confirm, setConfirm] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (status) params.status = status;
    api.get('/api/admin/purchases', { params })
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function changeStatus(id, s) {
    try { 
      await api.put(`/api/admin/purchases/${id}`, { status: s }); 
      toast(`Order marked as ${s}`, 'success'); 
      fetchData(); 
    } catch { 
      toast('Failed to update order status', 'error'); 
    }
  }

  async function del(id) {
    try { 
      await api.delete(`/api/admin/purchases/${id}`); 
      toast('Order record deleted', 'success'); 
      setConfirm(null); 
      fetchData(); 
    } catch { 
      toast('Delete failed', 'error'); 
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {confirm && <Confirm msg="Permanently delete this order record?" onYes={() => del(confirm)} onNo={() => setConfirm(null)}/>}
      
      <SectionHeader title="Sales History" count={data.total}/>
      
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <button onClick={() => { setStatus(''); setPage(1); }}
          className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${status === '' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'}`}>
          All Records
        </button>
        {['confirmed','cancelled','refunded'].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${status === s ? 'shadow-lg border-current' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'}`}
            style={status === s ? { background: `${STATUS_COLOR[s]}10`, color: STATUS_COLOR[s], borderColor: `${STATUS_COLOR[s]}20` } : {}}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <Loader/> : (
        <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                {['Client','Event Details','Tier','Qty','Transaction','Method','Management','Date','Actions'].map(h => (
                  <th key={h} className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.purchases.length === 0 && <tr><td colSpan={9} className="py-20 text-center font-bold text-slate-400">No transactions found</td></tr>}
              {data.purchases.map(p => (
                <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 text-xs font-bold text-slate-900">{p.user?.firstName} {p.user?.lastName}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-900 max-w-[180px] truncate">{p.event?.title}</td>
                  <td className="px-6 py-5">
                     <Badge label={p.ticketTier} color={C.primary}/>
                  </td>
                  <td className="px-6 py-5 text-xs font-black text-slate-400">x{p.quantity}</td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900">{p.totalPrice.toLocaleString()} EGP</td>
                  <td className="px-6 py-5 text-[10px] font-bold uppercase text-slate-400 tracking-tighter">
                     <div className="flex items-center gap-1.5">
                        <CreditCard size={12} />
                        {p.paymentMethod}
                     </div>
                  </td>
                  <td className="px-6 py-5">
                    <select className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl cursor-pointer outline-none border transition-all"
                      style={{ background: `${STATUS_COLOR[p.status]}10`, color: STATUS_COLOR[p.status], borderColor: `${STATUS_COLOR[p.status]}20` }}
                      value={p.status} onChange={e => changeStatus(p._id, e.target.value)}>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                      <option value="refunded">refunded</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 text-[10px] font-bold text-slate-400 whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-5">
                    <button onClick={() => setConfirm(p._id)} className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer border-0">
                       <Trash2 size={15}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 border-t border-slate-50">
             <Pagination page={page} pages={data.pages} setPage={setPage}/>
          </div>
        </div>
      )}
    </div>
  );
}
