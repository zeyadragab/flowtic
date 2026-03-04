import { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, Calendar, Filter, User } from 'lucide-react';
import api from '../../../services/api';
import { Confirm, SectionHeader, Loader, Pagination } from '../ui';

export default function UsersTab({ toast }) {
  const [data,    setData]    = useState({ users: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [role,    setRole]    = useState('');
  const [confirm, setConfirm] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (search) params.search = search;
    if (role)   params.role   = role;
    api.get('/api/admin/users', { params })
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page, search, role]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function changeRole(id, newRole) {
    try { await api.put(`/api/admin/users/${id}`, { role: newRole }); toast('Permissions updated', 'success'); fetchData(); }
    catch { toast('Update failed', 'error'); }
  }

  return (
    <div className="flex flex-col gap-12">
      {confirm && <Confirm msg="Deactivate user profile?" onYes={() => { api.delete(`/api/admin/users/${confirm}`).then(() => { toast('User removed', 'success'); setConfirm(null); fetchData(); }); }} onNo={() => setConfirm(null)}/>}
      
      <SectionHeader title="Access Governance" count={data.total}/>

      <div className="grid grid-cols-1 gap-10">
        <div className="flex items-center gap-6 p-4 rounded-[28px] bg-white shadow-sm border border-slate-100">
          <div className="flex-1 flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-2xl">
            <Search size={18} className="text-slate-400"/>
            <input className="bg-transparent outline-none text-sm font-bold text-slate-700 flex-1 placeholder:text-slate-300" 
                   placeholder="Search registry by name or email alias..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 border border-slate-100 rounded-2xl">
            <Filter size={16} className="text-slate-400" />
            <select className="bg-transparent text-xs font-black uppercase tracking-widest text-slate-500 outline-none cursor-pointer"
              value={role} onChange={e => { setRole(e.target.value); setPage(1); }}>
              <option value="">Full Registry</option>
              <option value="user">Standard Members</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>

        {loading ? <Loader/> : (
          <div className="card-elevated overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-left border-b border-slate-50">Member Profile</th>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-left border-b border-slate-50">Authorization</th>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-left border-b border-slate-50">Onboarding Date</th>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right border-b border-slate-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.users.map(u => (
                    <tr key={u._id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 border-4 border-slate-50 flex items-center justify-center text-sm font-black text-white shadow-xl shadow-slate-100">
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base leading-none">{u.firstName} {u.lastName}</p>
                            <p className="text-[11px] font-semibold text-slate-400 mt-2">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <select className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 outline-none transition-all cursor-pointer ${u.role === 'admin' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                          value={u.role} onChange={e => changeRole(u._id, e.target.value)}>
                          <option value="user">Member Access</option>
                          <option value="admin">Admin Privilege</option>
                        </select>
                      </td>
                      <td className="px-10 py-8 whitespace-nowrap">
                         <div className="flex items-center gap-3 text-slate-400">
                            <Calendar size={14} className="opacity-50" />
                            <span className="text-xs font-bold tracking-tight text-slate-500">{new Date(u.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setConfirm(u._id)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-600 hover:shadow-lg transition-all">
                               <Trash2 size={18}/>
                            </button>
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
