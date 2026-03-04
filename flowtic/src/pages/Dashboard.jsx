import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TABS = [
  { key: 'tickets',  icon: '🎟️', label: 'My Tickets'  },
  { key: 'watchlist', icon: '👀', label: 'Watchlist'    },
  { key: 'profile',  icon: '👤', label: 'Profile'      },
];

export default function Dashboard() {
  const [tab,       setTab]       = useState('tickets');
  const [purchases, setPurchases] = useState([]);
  const [loading,   setLoading]   = useState(true);

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  }, []);

  useEffect(() => {
    api.get('/api/purchases')
      .then(r => setPurchases(r.data))
      .catch(() => setPurchases([]))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = purchases.filter(p => p.status === 'confirmed');
  const totalSpent = purchases.reduce((s, p) => s + (p.totalPrice || 0), 0);

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` || '?';
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Guest';

  return (
    <div className="min-h-screen" style={{ background: '#04081a' }}>

      {/* Header */}
      <div className="pt-24 pb-8 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#08002e,#0d0040,#04081a)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(124,58,237,0.15),transparent 60%)' }} />
        <div className="relative max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
              style={{ background: 'linear-gradient(135deg,#ffd700,#ff8c00)', color: '#0a0e27' }}>
              {initials}
            </div>
            <div>
              <h1 className="font-black text-white text-xl">Welcome, {user.firstName || 'there'} 👋</h1>
              <p className="text-sm text-[#6070a0]">{user.email} · Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : '2025'}</p>
            </div>
          </div>
          <Link to="/" className="px-4 py-2 rounded-full text-sm no-underline transition-all hover:-translate-x-1"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#a0a8c0' }}>
            ← Home
          </Link>
        </div>

        {/* Quick stats */}
        <div className="relative max-w-5xl mx-auto mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { n: purchases.length.toString(), l: 'Total Tickets', c: '#ffd700' },
            { n: upcoming.length.toString(),  l: 'Upcoming',      c: '#8b5cf6' },
            { n: totalSpent.toLocaleString(), l: 'EGP Spent',     c: '#3b82f6' },
            { n: purchases.length > 0 ? '⭐' : '—', l: 'Active Fan', c: '#10b981' },
          ].map(({ n, l, c }) => (
            <div key={l} className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${c}25` }}>
              <div className="text-xl font-black mb-0.5" style={{ color: c }}>{n}</div>
              <div className="text-xs text-[#5a6080]">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24 pt-8">
        {/* Tab nav */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl w-fit"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(({ key, icon, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-0 cursor-pointer transition-all duration-200"
              style={{
                background: tab === key ? 'linear-gradient(135deg,#ffd700,#ff8c00)' : 'transparent',
                color:      tab === key ? '#0a0e27' : '#8090b0',
              }}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        {/* TICKETS tab */}
        {tab === 'tickets' && (
          <div className="flex flex-col gap-5">
            {loading && (
              <div className="text-center py-20 text-[#5a6080]">
                <p className="text-lg font-semibold">Loading your tickets…</p>
              </div>
            )}

            {!loading && purchases.length === 0 && (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🎟️</p>
                <h3 className="font-bold text-white text-xl mb-2">No Tickets Yet</h3>
                <p className="text-[#6070a0] mb-6">Browse events and grab your first ticket!</p>
                <Link to="/events"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-[#0a0e27] no-underline"
                  style={{ background: 'linear-gradient(135deg,#ffd700,#ff8c00)' }}>
                  🎟️ Browse Events
                </Link>
              </div>
            )}

            {!loading && purchases.map((p) => (
              <div key={p._id} className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-5">
                  {/* Event image */}
                  {p.event?.image && (
                    <img src={p.event.image} alt=""
                      style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }} />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{p.event?.title || 'Event'}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        style={{
                          background: p.status === 'confirmed' ? 'rgba(16,185,129,0.12)' : p.status === 'cancelled' ? 'rgba(239,68,68,0.12)' : 'rgba(100,100,120,0.2)',
                          color: p.status === 'confirmed' ? '#34d399' : p.status === 'cancelled' ? '#f87171' : '#6070a0'
                        }}>
                        {p.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-[#6070a0]">
                      {p.event?.date     && <span>📅 {p.event.date}</span>}
                      {p.ticketTier      && <span>🎟️ {p.ticketTier}</span>}
                      {p.event?.location && <span>📍 {p.event.location}</span>}
                      <span>💳 {p.totalPrice} EGP</span>
                      {p.quantity > 1    && <span>×{p.quantity}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl"
                      style={{
                        background: p.status === 'confirmed' ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)',
                        border: p.status === 'confirmed' ? '2px dashed rgba(255,215,0,0.4)' : '2px dashed rgba(255,255,255,0.1)'
                      }}>
                      {p.status === 'confirmed' ? '📱' : '✅'}
                    </div>
                    <p className="text-[10px] text-[#5a6080]">#{p._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                {p.status === 'confirmed' && (
                  <div className="px-5 pb-4 flex flex-wrap gap-2">
                    <button className="px-4 py-1.5 rounded-xl text-xs font-semibold text-[#0a0e27] border-0 cursor-pointer hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#ffd700,#ff8c00)' }}>
                      📱 View E-Ticket
                    </button>
                    <Link to="/market" className="px-4 py-1.5 rounded-xl text-xs font-semibold no-underline"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                      🔄 Resell Ticket
                    </Link>
                    <Link to="/food" className="px-4 py-1.5 rounded-xl text-xs font-semibold no-underline"
                      style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
                      🍕 Order Food
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {!loading && purchases.length > 0 && (
              <Link to="/events"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white no-underline self-start"
                style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.15)' }}>
                🎟️ Browse More Events
              </Link>
            )}
          </div>
        )}

        {/* WATCHLIST tab */}
        {tab === 'watchlist' && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">👀</p>
            <h3 className="font-bold text-white text-xl mb-2">Your Watchlist is Empty</h3>
            <p className="text-[#6070a0] mb-6">Save events to your watchlist and get notified when tickets drop.</p>
            <Link to="/events" className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-[#0a0e27] no-underline"
              style={{ background: 'linear-gradient(135deg,#ffd700,#ff8c00)' }}>
              🎟️ Browse Events
            </Link>
          </div>
        )}

        {/* PROFILE tab */}
        {tab === 'profile' && (
          <div className="max-w-lg rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="font-bold text-white text-xl mb-6">Profile Settings</h2>
            <div className="flex flex-col gap-4">
              {[
                { l: 'First Name', v: user.firstName || '' },
                { l: 'Last Name',  v: user.lastName  || '' },
                { l: 'Email',      v: user.email     || '' },
              ].map(({ l, v }) => (
                <div key={l}>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#6070a0' }}>{l}</label>
                  <input defaultValue={v} className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(255,215,0,0.5)'; }}
                    onBlur={e =>  { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  />
                </div>
              ))}
              <button className="mt-2 py-3 rounded-2xl font-bold text-[#0a0e27] border-0 cursor-pointer hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg,#ffd700,#ff8c00)' }}>
                💾 Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
