import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ShoppingBag, Utensils, Zap, CreditCard, ChevronRight,
  MapPin, Search, Plus, Minus, X, CheckCircle2
} from 'lucide-react';
import api from '../services/api';

export default function Food() {
  const reduce = useReducedMotion();
  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('All');
  const [search, setSearch]             = useState('');
  const [cart, setCart]                 = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    api.get('/api/food')
      .then(r => setItems(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(items.map(i => i.category).filter(Boolean))],
    [items]
  );

  /* Cart Logic */
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) return prev.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i =>
      i._id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    ));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);

  const filteredItems = items.filter(item => {
    const matchesTab    = activeTab === 'All' || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ background: '#fcfdfe', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Hero */}
      <section style={{
        paddingTop: 160, paddingBottom: 60,
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
        borderBottom: '1px solid #eef2f6'
      }}>
        <div className="container-custom">
          <div style={{ maxWidth: 800 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}
            >
              <span className="badge" style={{ background: '#fff1f2', color: '#e11d48', border: 'none', fontWeight: 800 }}>
                <MapPin size={12} style={{ marginRight: 6 }} /> Cairo International Stadium
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>• Doors Open</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--text-primary)', marginBottom: 20, lineHeight: 1.1 }}
            >
              Order Food Directly <span style={{ color: 'var(--blue-main)' }}>to Your Seat.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ fontSize: 18, color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.6, maxWidth: 640 }}
            >
              Skip the long queues. Scan your ticket, choose your favorites, and we'll notify you the moment your order is ready for pickup at section A-12.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container-custom" style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>

        {/* Main Menu */}
        <div>
          {/* Search & Tabs */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <Search size={20} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text" placeholder="Search menu items…" value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '18px 24px 18px 56px', borderRadius: 20,
                  border: '1px solid #eef2f6', background: 'white', fontSize: 16, fontWeight: 500,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)', outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--blue-main)'}
                onBlur={e => e.target.style.borderColor = '#eef2f6'}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {categories.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 24px', borderRadius: 100, border: 'none',
                    background: activeTab === tab ? 'var(--blue-main)' : 'white',
                    color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)', transition: 'all 0.2s'
                  }}
                >{tab}</button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              <Utensils size={32} style={{ opacity: 0.2, marginBottom: 16 }} />
              <p style={{ fontWeight: 600 }}>Loading menu…</p>
            </div>
          )}

          {/* Menu Grid */}
          {!loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {filteredItems.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  <Utensils size={32} style={{ opacity: 0.2, marginBottom: 12 }} />
                  <p style={{ fontWeight: 600 }}>No items found.</p>
                </div>
              ) : filteredItems.map((item, i) => (
                <motion.div key={item._id} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: 'white', borderRadius: 24, border: '1px solid #eef2f6',
                    overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    display: 'flex', flexDirection: 'column'
                  }}
                >
                  {/* Image or emoji fallback */}
                  <div style={{ height: 200, overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 80 }}>{item.emoji || '🍽️'}</span>
                    }
                  </div>

                  <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{item.name}</h3>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', background: '#f8fafc', padding: '3px 10px', borderRadius: 8, whiteSpace: 'nowrap' }}>
                        {item.category}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 20, flex: 1 }}>{item.description}</p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>
                        {item.price} <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>EGP</span>
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(item)}
                        style={{
                          padding: '10px 20px', borderRadius: 12, background: 'var(--blue-soft)',
                          color: 'var(--blue-main)', border: 'none', fontWeight: 800,
                          fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
                        }}
                      >
                        <Plus size={16} /> Add to Order
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <aside style={{ position: 'sticky', top: 120 }}>
          <div style={{
            background: 'white', borderRadius: 28, border: '1px solid #eef2f6',
            padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={20} color="var(--blue-main)" />
                <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>Your Order</h2>
              </div>
              <span style={{ background: 'var(--blue-soft)', color: 'var(--blue-main)', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 800 }}>
                {cartCount} Items
              </span>
            </div>

            <div style={{ minHeight: 120 }}>
              <AnimatePresence mode="popLayout">
                {cart.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}
                  >
                    <Utensils size={32} style={{ opacity: 0.2, marginBottom: 16 }} />
                    <p style={{ fontSize: 14, fontWeight: 600 }}>Your tray is empty.</p>
                    <p style={{ fontSize: 12 }}>Add some bites to start ordering!</p>
                  </motion.div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {cart.map(item => (
                      <motion.div key={item._id}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                        style={{ display: 'flex', gap: 12, alignItems: 'center' }}
                      >
                        <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                          {item.image
                            ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : item.emoji || '🍽️'
                          }
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{item.price * item.qty} EGP</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', borderRadius: 8, padding: 4 }}>
                          <button onClick={() => updateQty(item._id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><Minus size={12} /></button>
                          <span style={{ fontSize: 13, fontWeight: 800, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                          <button onClick={() => updateQty(item._id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><Plus size={12} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item._id)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {cart.length > 0 && (
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #eef2f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>Subtotal</span>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{cartTotal} EGP</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>Service Fee</span>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>15 EGP</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 16, fontWeight: 900 }}>Total</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--blue-main)', letterSpacing: '-0.5px' }}>{cartTotal + 15} EGP</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCheckout(true)}
                  style={{
                    width: '100%', padding: '18px', borderRadius: 16, background: 'var(--gradient-blue)',
                    color: 'white', fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: 'var(--shadow-blue)'
                  }}
                >
                  Purchase Now <ChevronRight size={18} />
                </motion.button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, color: '#059669', fontSize: 12, fontWeight: 700 }}>
                  <CreditCard size={14} /> Encrypted Payment
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 20, padding: 20, background: '#ecfdf5', borderRadius: 20, border: '1px solid #10b98120', display: 'flex', gap: 14 }}>
            <Zap size={20} color="#10b981" />
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#064e3b', marginBottom: 4 }}>Fast Lane Pickup</p>
              <p style={{ fontSize: 12, color: '#059669', lineHeight: 1.5, fontWeight: 500 }}>
                Use the QR code in your dashboard for priority collection at Section A-12.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', padding: 20, zIndex: 1000
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              style={{ background: 'white', padding: 48, borderRadius: 32, maxWidth: 460, width: '100%', textAlign: 'center' }}
            >
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle2 size={40} />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Order Confirmed!</h2>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.6, marginBottom: 32 }}>
                Your order has been placed. We'll notify you when it's ready for pickup.
              </p>
              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 20, marginBottom: 32, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>Pickup Slot</span>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>Approx. 30 min</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>Location</span>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>Counter 03, Section A</span>
                </div>
              </div>
              <button
                onClick={() => { setCart([]); setShowCheckout(false); }}
                style={{
                  width: '100%', padding: '16px', borderRadius: 16, background: 'var(--text-primary)',
                  color: 'white', fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer'
                }}
              >Done</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
