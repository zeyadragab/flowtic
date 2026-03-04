import { useState, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api.js';
import { Canvas } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, Torus, GradientTexture, PresentationControls, ContactShadows } from '@react-three/drei';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, ShieldCheck, Github as Google, Sparkles } from 'lucide-react';

/* ─── 3D Element ─── */
function RotatingTorus() {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <Torus args={[1, 0.4, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <MeshWobbleMaterial
          color="#2563eb"
          speed={2}
          factor={0.6}
        >
           <GradientTexture
            stops={[0, 0.5, 1]}
            colors={['#3b82f6', '#2563eb', '#1e40af']}
            size={100}
          />
        </MeshWobbleMaterial>
      </Torus>
    </Float>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/register', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>
      
      {/* ─── Right Side: 3D Experience (Sticky behavior) ─── */}
      <div style={{ flex: 1, position: 'relative', background: '#f8fbff', display: 'flex', alignItems: 'center', justifyContent: 'center', order: 2 }} className="hidden lg:flex">
         <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(circle, var(--blue-main) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
         
         <div style={{ width: '80%', height: '80%', zIndex: 2 }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={1} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <Suspense fallback={null}>
                 <PresentationControls global config={{ mass: 1, tension: 500 }} snap={{ mass: 2, tension: 1500 }} rotation={[0, 0.3, 0]} polar={[-Math.PI / 4, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}>
                    <RotatingTorus />
                 </PresentationControls>
                 <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#2563eb" />
              </Suspense>
            </Canvas>
         </div>

         <div style={{ position: 'absolute', top: 64, right: 64, zIndex: 5, maxWidth: 380, textAlign: 'right' }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-1px' }}>Elevate your Access.</h2>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.6 }}>Discover, book, and resell tickets for Egypt's most exclusive events.</p>
         </div>
      </div>

      {/* ─── Left Side: Signup Form ─── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', order: 1 }}>
         <div style={{ width: '100%', maxWidth: 480 }}>
            
            <div style={{ textAlign: 'left', marginBottom: 40 }}>
               <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                   <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--blue-main)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: 'var(--shadow-blue)' }}>
                      🎟️
                   </div>
                   <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                      Flow<span style={{ color: 'var(--blue-main)' }}>tic</span>
                   </span>
               </Link>
               <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>Create your account</h1>
               <p style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 500 }}>Join 50,000+ others discovering the best of Egypt.</p>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '40px 0' }}
                >
                   <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                   <h2 style={{ fontSize: 22, fontWeight: 900, color: '#059669', marginBottom: 8 }}>Account Created!</h2>
                   <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Redirecting to login portal…</p>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>First Name</label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="text" required placeholder="Ahmed"
                          value={form.firstName}
                          onChange={e => setForm({...form, firstName: e.target.value})}
                          style={{
                            width: '100%', padding: '12px 16px 12px 42px', borderRadius: 14,
                            background: 'var(--bg-secondary)', border: '1.5px solid var(--border-subtle)',
                            fontSize: 14, fontWeight: 500, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                          }}
                          onFocus={e => { e.target.style.borderColor = 'var(--blue-main)'; e.target.style.background = 'white'; }}
                          onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.background = 'var(--bg-secondary)'; }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>Last Name</label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="text" required placeholder="Mohamed"
                          value={form.lastName}
                          onChange={e => setForm({...form, lastName: e.target.value})}
                          style={{
                            width: '100%', padding: '12px 16px 12px 42px', borderRadius: 14,
                            background: 'var(--bg-secondary)', border: '1.5px solid var(--border-subtle)',
                            fontSize: 14, fontWeight: 500, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                          }}
                          onFocus={e => { e.target.style.borderColor = 'var(--blue-main)'; e.target.style.background = 'white'; }}
                          onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.background = 'var(--bg-secondary)'; }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="email" required placeholder="name@email.com"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        style={{
                          width: '100%', padding: '12px 16px 12px 42px', borderRadius: 14,
                          background: 'var(--bg-secondary)', border: '1.5px solid var(--border-subtle)',
                          fontSize: 14, fontWeight: 500, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                        }}
                        onFocus={e => { e.target.style.borderColor = 'var(--blue-main)'; e.target.style.background = 'white'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.background = 'var(--bg-secondary)'; }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type={showPass ? 'text' : 'password'} required placeholder="Create a strong password"
                        value={form.password}
                        onChange={e => setForm({...form, password: e.target.value})}
                        style={{
                          width: '100%', padding: '12px 42px 12px 42px', borderRadius: 14,
                          background: 'var(--bg-secondary)', border: '1.5px solid var(--border-subtle)',
                          fontSize: 14, fontWeight: 500, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                        }}
                        onFocus={e => { e.target.style.borderColor = 'var(--blue-main)'; e.target.style.background = 'white'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.background = 'var(--bg-secondary)'; }}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4 }}>
                     <input type="checkbox" required style={{ width: 16, height: 16, accentColor: 'var(--blue-main)', marginTop: 2, cursor: 'pointer' }} />
                     <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        I agree to the <a href="#" style={{ color: 'var(--blue-main)', fontWeight: 800, textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--blue-main)', fontWeight: 800, textDecoration: 'none' }}>Privacy Policy</a>.
                     </span>
                  </div>

                  {error && (
                    <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fef2f2',
                      border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, fontWeight: 600 }}>
                      {error}
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '16px', borderRadius: 16, background: 'var(--gradient-blue)',
                      color: 'white', fontWeight: 900, fontSize: 16, border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      boxShadow: 'var(--shadow-blue)', marginTop: 8, letterSpacing: '0.4px'
                    }}
                  >
                    {loading ? 'Creating account...' : 'Create Account'} <Sparkles size={18} />
                  </motion.button>

                  <div style={{ display: 'flex', items: 'center', gap: 12, margin: '8px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)', alignSelf: 'center' }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quick Sign Up</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)', alignSelf: 'center' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { icon: <Google size={18} />, label: 'Google' },
                      { icon: <ShieldCheck size={18} />, label: 'Facebook' },
                    ].map(btn => (
                      <button 
                        key={btn.label}
                        type="button"
                        style={{ 
                          padding: '11px', borderRadius: 14, background: 'white', 
                          border: '1.5px solid var(--border-subtle)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                      >
                        {btn.icon} {btn.label}
                      </button>
                    ))}
                  </div>

                  <p style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 24 }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--blue-main)', fontWeight: 800, textDecoration: 'none' }}>Sign in here</Link>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

         </div>
      </div>

    </div>
  );
}
