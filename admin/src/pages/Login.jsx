import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { C } from './Dashboard/constants';

export default function Login() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', form);
      if (data.user?.role !== 'admin') {
        setError('Access denied. This account does not have admin privileges.');
        return;
      }
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser',  JSON.stringify(data.user));
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-[120px]" />

      <div className="w-full max-w-[400px] relative z-10 reveal">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-[32px] flex items-center justify-center mb-6 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
            <Shield size={40} color="#fff"/>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Flowtic</h1>
          <p className="text-sm font-bold mt-2 uppercase tracking-[0.2em] text-slate-400">Admin Control</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl mb-6 text-sm font-bold bg-rose-50 border border-rose-100 text-rose-500 animate-in fade-in zoom-in duration-300">
              <AlertCircle size={18} className="shrink-0"/>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"/>
                <input
                  type="email"
                  placeholder="admin@flowtic.com"
                  required
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-900 font-bold text-sm transition-all"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Security Key</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"/>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full pl-14 pr-14 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-900 font-bold text-sm transition-all"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-slate-600 transition-colors">
                  {show ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-5 rounded-2xl font-black text-sm cursor-pointer border-0 shadow-xl shadow-blue-100 hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50 mt-4 group"
              style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: '#fff' }}>
              <span className="flex items-center justify-center gap-2">
                {loading ? 'Authenticating...' : 'Establish Connection'}
                {!loading && <Shield size={16} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>
        </div>

        <div className="text-center mt-10">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
             End-to-End Encrypted Session
           </p>
        </div>
      </div>
    </div>
  );
}
