import { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, ShieldCheck, ShieldAlert, User, Ticket } from 'lucide-react';
import api from '../../../services/api';
import { C } from '../constants';
import { Confirm, SectionHeader, Loader, Pagination, Badge } from '../ui';

export default function ResaleTab({ toast }) {
  const [data,    setData]    = useState({ listings: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(Page => 1);
  const [search,  setSearch]  = useState('');
  const [confirm, setConfirm] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (search) params.search = search;
    api.get('/api/admin/resale', { params })
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function toggleVerify(item) {
    try { 
      await api.put(`/api/admin/resale/${item._id}`, { verified: !item.verified }); 
      fetchData(); 
      toast(item.verified ? 'Listing unverified' : 'Listing successfully verified', 'success');
    } catch { 
      toast('Failed to update verification status', 'error'); 
    }
  }

  async function del(id) {
    try { 
      await api.delete(`/api/admin/resale/${id}`); 
      toast('Resale listing removed', 'success'); 
      setConfirm(null); 
      fetchData(); 
    } catch { 
      toast('Failed to delete listing', 'error'); 
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {confirm && <Confirm msg="Permanently remove this resale listing?" onYes={() => del(confirm)} onNo={() => setConfirm(null)}/>}
      
      <SectionHeader title="Marketplace Resale" count={data.total}/>
      
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl max-w-md bg-white border border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all mb-2">
        <Search size={18} className="text-slate-400"/>
        <input className="bg-transparent outline-none text-sm font-bold text-slate-700 flex-1 placeholder:text-slate-300" placeholder="Search by event or seller..." 
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
      </div>

      {loading ? <Loader/> : (
        <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Event Ticket</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Seller Identity</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Listing Price</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Market Value</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Trust status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.listings.length === 0 && <tr><td colSpan={6} className="py-20 text-center font-bold text-slate-400">No resale listings available</td></tr>}
              {data.listings.map(l => (
                <tr key={l._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <Ticket size={16} className="text-blue-500" />
                       <span className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{l.eventTitle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <User size={14} />
                       </div>
                       <span className="text-xs font-semibold text-slate-600">{l.sellerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className="text-sm font-black text-emerald-600">{l.price.toLocaleString()} EGP</span>
                  </td>
                  <td className="px-6 py-5 italic">
                     <span className="text-xs font-medium text-slate-400 line-through">{l.originalPrice.toLocaleString()} EGP</span>
                  </td>
                  <td className="px-6 py-5">
                    <button onClick={() => toggleVerify(l)} className="cursor-pointer border-0 bg-transparent p-0 transform hover:scale-105 transition-transform">
                      {l.verified 
                        ? <Badge label="AUTHENTIC" color="#10b981"/> 
                        : <Badge label="PENDING VERIF" color="#f59e0b"/>}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <button onClick={() => setConfirm(l._id)} className="w-10 h-10 rounded-[14px] flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer border-0 shadow-sm shadow-rose-100">
                       <Trash2 size={16}/>
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
