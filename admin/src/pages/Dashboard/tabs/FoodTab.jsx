import { useState, useEffect, useCallback } from 'react';
import { Search, Pencil, Trash2, Utensils, Tag, DollarSign, Image as ImageIcon } from 'lucide-react';
import api from '../../../services/api';
import { C, BLANK_FOOD } from '../constants';
import { Confirm, Modal, Field, inputCls, SectionHeader, Loader, Pagination, Badge } from '../ui';

export default function FoodTab({ toast }) {
  const [data,    setData]    = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState(BLANK_FOOD);
  const [saving,  setSaving]  = useState(false);
  const [confirm, setConfirm] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (search) params.search = search;
    api.get('/api/admin/food', { params })
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  function openCreate() { setForm(BLANK_FOOD); setModal({ mode: 'create' }); }
  function openEdit(item) {
    setForm({ name: item.name, category: item.category, price: item.price, description: item.description, image: item.image, emoji: item.emoji, available: item.available });
    setModal({ mode: 'edit', id: item._id });
  }

  async function save() {
    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price) };
      if (modal.mode === 'create') await api.post('/api/admin/food', body);
      else                          await api.put(`/api/admin/food/${modal.id}`, body);
      toast('Food item successfully saved', 'success'); setModal(null); fetchData();
    } catch (e) { toast(e.response?.data?.message || 'Error saving item', 'error'); }
    finally { setSaving(false); }
  }

  async function del(id) {
    try { await api.delete(`/api/admin/food/${id}`); toast('Item removed from menu', 'success'); setConfirm(null); fetchData(); }
    catch { toast('Delete operation failed', 'error'); }
  }

  async function toggleAvail(item) {
    try { 
      await api.put(`/api/admin/food/${item._id}`, { available: !item.available }); 
      fetchData(); 
    } catch { 
      toast('Failed to update availability', 'error'); 
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {confirm && <Confirm msg="Remove this item from the food menu? This action is permanent." onYes={() => del(confirm)} onNo={() => setConfirm(null)}/>}
      {modal && (
        <Modal title={modal.mode === 'create' ? 'Add Menu Item' : 'Update Menu Item'} onClose={() => setModal(null)}>
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
              <Field label="Emoji Icon">
                 <input style={inputCls} placeholder="e.g. 🍔" value={form.emoji} onChange={e => f('emoji', e.target.value)}/>
              </Field>
              <Field label="Category">
                 <input style={inputCls} placeholder="e.g. Fast Food" value={form.category} onChange={e => f('category', e.target.value)}/>
              </Field>
            </div>
            <Field label="Item Name">
               <input style={inputCls} placeholder="Enter food name" value={form.name} onChange={e => f('name', e.target.value)}/>
            </Field>
            <Field label="Price (EGP)">
               <input type="number" style={inputCls} placeholder="0.00" value={form.price} onChange={e => f('price', e.target.value)}/>
            </Field>
            <Field label="Image URL">
               <input style={inputCls} placeholder="https://..." value={form.image} onChange={e => f('image', e.target.value)}/>
            </Field>
            <Field label="Description">
               <textarea style={{ ...inputCls, minHeight: 90, resize: 'vertical' }} placeholder="Describe the item..." value={form.description} onChange={e => f('description', e.target.value)}/>
            </Field>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-[20px] mb-6">
              <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded-lg" id="isAvail" checked={form.available} onChange={e => f('available', e.target.checked)}/>
              <label htmlFor="isAvail" className="text-sm font-bold text-slate-700 cursor-pointer">Available for Order</label>
            </div>
            <button onClick={save} disabled={saving} className="w-full py-4 rounded-2xl font-black text-sm cursor-pointer border-0 shadow-xl shadow-blue-100 transition-all hover:translate-y-[-2px]"
              style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: '#fff', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Processing...' : 'Save Item to Menu'}
            </button>
          </div>
        </Modal>
      )}

      <SectionHeader title="Gastronomy" count={data.total} onAdd={openCreate} addLabel="Add Food Item"/>
      
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl max-w-md bg-white border border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all mb-2">
        <Search size={18} className="text-slate-400"/>
        <input className="bg-transparent outline-none text-sm font-bold text-slate-700 flex-1 placeholder:text-slate-300" placeholder="Search menu items..." 
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
      </div>

      {loading ? <Loader/> : (
        <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Item Details</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Cuisine Type</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Unit Price</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Availability</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 && <tr><td colSpan={5} className="py-20 text-center font-bold text-slate-400">No food items found</td></tr>}
              {data.items.map(item => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[18px] bg-slate-50 flex items-center justify-center text-2xl shadow-inner border border-slate-100">
                        {item.emoji}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-tight">Food Product</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                       <Tag size={10} className="text-slate-400" />
                       <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className="text-sm font-black text-slate-900">{item.price.toLocaleString()} <span className="text-[10px] text-slate-400">EGP</span></span>
                  </td>
                  <td className="px-6 py-5">
                    <button onClick={() => toggleAvail(item)} className="cursor-pointer border-0 bg-transparent p-0 transform hover:scale-105 transition-transform">
                      {item.available 
                        ? <Badge label="In Stock" color="#10b981"/> 
                        : <Badge label="Sold Out" color="#ef4444"/>}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                       <button onClick={() => openEdit(item)} className="w-10 h-10 rounded-[14px] flex items-center justify-center bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all cursor-pointer border-0 shadow-sm"><Pencil size={15}/></button>
                       <button onClick={() => setConfirm(item._id)} className="w-10 h-10 rounded-[14px] flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer border-0 shadow-sm"><Trash2 size={15}/></button>
                    </div>
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
