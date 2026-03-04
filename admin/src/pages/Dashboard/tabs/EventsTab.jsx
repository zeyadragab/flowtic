import { useState, useEffect, useCallback } from 'react';
import { Search, Pencil, Trash2, Plus, Filter } from 'lucide-react';
import api from '../../../services/api';
import { C, EVENT_CATS, BLANK_EVENT } from '../constants';
import { Confirm, Modal, Field, inputCls, SectionHeader, Loader, Pagination } from '../ui';

export default function EventsTab({ toast }) {
  const [data,    setData]    = useState({ events: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [cat,     setCat]     = useState('All');
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState(BLANK_EVENT);
  const [saving,  setSaving]  = useState(false);
  const [confirm, setConfirm] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 8 }; // Smaller limit for better vertical breathing
    if (search) params.search = search;
    if (cat !== 'All') params.category = cat;
    api.get('/api/admin/events', { params })
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page, search, cat]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  function openCreate() { setForm(BLANK_EVENT); setModal({ mode: 'create' }); }
  function openEdit(ev) {
    setForm({ title: ev.title, category: ev.category, date: ev.date, time: ev.time, location: ev.location, description: ev.description, image: ev.image, price: ev.price, seats: ev.seats, hot: ev.hot });
    setModal({ mode: 'edit', id: ev._id });
  }

  async function save() {
    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price), seats: Number(form.seats) };
      if (modal.mode === 'create') await api.post('/api/admin/events', body);
      else                          await api.put(`/api/admin/events/${modal.id}`, body);
      toast('Success', 'success'); setModal(null); fetchData();
    } catch (e) { toast(e.response?.data?.message || 'Error', 'error'); }
    finally { setSaving(false); }
  }

  return (
    <div className="flex flex-col gap-12">
      {confirm && <Confirm msg="Permanently remove event?" onYes={() => { api.delete(`/api/admin/events/${confirm}`).then(() => { toast('Deleted', 'success'); setConfirm(null); fetchData(); }); }} onNo={() => setConfirm(null)}/>}
      
      {modal && (
        <Modal title={modal.mode === 'create' ? 'Create New Event' : 'Edit Event Details'} onClose={() => setModal(null)}>
          <div className="grid grid-cols-1 gap-8">
            <Field label="Event Metadata"><input style={inputCls} placeholder="Name" value={form.title} onChange={e => f('title', e.target.value)}/></Field>
            <div className="grid grid-cols-2 gap-6">
              <Field label="Classification">
                <select style={inputCls} value={form.category} onChange={e => f('category', e.target.value)}>
                  {EVENT_CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Status">
                 <div className="h-[52px] flex items-center px-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <input type="checkbox" className="w-5 h-5 accent-blue-600 mr-3" checked={form.hot} onChange={e => f('hot', e.target.checked)}/>
                    <span className="text-sm font-bold text-slate-500">Promoted</span>
                 </div>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Field label="Event Date"><input style={inputCls} placeholder="YYYY-MM-DD" value={form.date} onChange={e => f('date', e.target.value)}/></Field>
              <Field label="Doors Open"><input style={inputCls} placeholder="00:00 AM/PM" value={form.time} onChange={e => f('time', e.target.value)}/></Field>
            </div>
            <Field label="Venue Location"><input style={inputCls} placeholder="Full address" value={form.location} onChange={e => f('location', e.target.value)}/></Field>
            <Field label="Cover Image URL"><input style={inputCls} placeholder="https://..." value={form.image} onChange={e => f('image', e.target.value)}/></Field>
            <div className="grid grid-cols-2 gap-6">
              <Field label="Ticket Price (EGP)"><input type="number" style={inputCls} placeholder="0.00" value={form.price} onChange={e => f('price', e.target.value)}/></Field>
              <Field label="Total Capacity"><input type="number" style={inputCls} placeholder="0" value={form.seats} onChange={e => f('seats', e.target.value)}/></Field>
            </div>
            <button onClick={save} disabled={saving} className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              {saving ? 'Processing...' : 'Confirm & Save'}
            </button>
          </div>
        </Modal>
      )}

      <div className="flex items-end justify-between">
        <SectionHeader title="Event Registry" count={data.total} />
        <button onClick={openCreate} className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700 hover:translate-y-[-2px] transition-all">
          <Plus size={18}/> New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <div className="flex items-center gap-6 p-4 rounded-[28px] bg-white shadow-sm border border-slate-100">
          <div className="flex-1 flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-2xl">
            <Search size={18} className="text-slate-400"/>
            <input className="bg-transparent outline-none text-sm font-bold text-slate-700 flex-1 placeholder:text-slate-300" 
              placeholder="Search by name, location or category..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 border border-slate-100 rounded-2xl">
            <Filter size={16} className="text-slate-400" />
            <select className="bg-transparent text-xs font-black uppercase tracking-widest text-slate-500 cursor-pointer outline-none"
              value={cat} onChange={e => { setCat(e.target.value); setPage(1); }}>
              <option value="All">All Categories</option>
              {EVENT_CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {loading ? <Loader/> : (
          <div className="card-elevated overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-left border-b border-slate-50">Identity</th>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-left border-b border-slate-50">Timeline</th>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-left border-b border-slate-50">Revenue</th>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-left border-b border-slate-50">Sales Matrix</th>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right border-b border-slate-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.events.map(ev => (
                    <tr key={ev._id} className="group hover:bg-blue-50/20 transition-colors">
                      <td className="px-10 py-8">
                         <div className="font-bold text-slate-900 text-base">{ev.title}</div>
                         <div className="text-[10px] font-black text-blue-500 uppercase mt-2 tracking-widest">{ev.category}</div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="text-sm font-bold text-slate-700">{ev.date}</div>
                         <div className="text-[11px] font-semibold text-slate-400 mt-1">{ev.time}</div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="text-base font-black text-slate-900">{ev.price.toLocaleString()} <span className="text-[11px] text-slate-400">EGP</span></div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="w-40 space-y-3">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                               <span>{ev.sold} Sold</span>
                               <span>{Math.round((ev.sold/ev.seats)*100)}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                               <div className="h-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.4)] transition-all duration-1000" style={{ width: `${(ev.sold/ev.seats)*100}%` }} />
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(ev)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:border-blue-200 hover:text-blue-600 hover:shadow-lg transition-all"><Pencil size={18}/></button>
                          <button onClick={() => setConfirm(ev._id)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-600 hover:shadow-lg transition-all"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-10 bg-slate-50/30 border-t border-slate-50">
              <Pagination page={page} pages={data.pages} setPage={setPage}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
