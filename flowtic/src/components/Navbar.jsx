import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';

const navLinks = [
  { label: 'Events', href: '/events' },
  { label: 'Market', href: '/market' },
  { label: 'Food', href: '/food' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Read user from localStorage on mount and on storage changes
  useEffect(() => {
    const readUser = () => {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    readUser();
    window.addEventListener('storage', readUser);
    return () => window.removeEventListener('storage', readUser);
  }, []);

  // Re-check on every route change (covers same-tab login)
  useEffect(() => {
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setProfileOpen(false);
    navigate('/');
  };

  // Build initials avatar
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(226,232,240,0.8)' : '1px solid transparent',
        padding: scrolled ? '12px 0' : '20px 0',
      }}
    >
      <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 36,
              height: 36,
              background: 'var(--gradient-blue)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 900,
              fontSize: 13,
              letterSpacing: '-0.5px',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            }}
          >
          </motion.div>
          <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Flowtic
          </span>
        </Link>

        {/* Desktop Links */}
        <nav aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', gap: 40 }} className="hidden md:flex">
          {navLinks.map((link) => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: active ? 'var(--blue-main)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: 'var(--blue-main)',
                      borderRadius: 2,
                    }}
                  />
                )}
              </Link>
            );
          })}

          {user ? (
            /* ── Logged-in: cart + profile ── */
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
                title="Cart"
                style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: 'var(--bg-secondary)', border: '1.5px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative',
                }}
              >
                <ShoppingCart size={17} />
              </motion.button>

              {/* Profile avatar with dropdown */}
              <div style={{ position: 'relative' }}>
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  title="Profile"
                  style={{
                    width: 38, height: 38, borderRadius: 12,
                    background: 'var(--gradient-blue)',
                    border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'white',
                    fontWeight: 800, fontSize: 13, letterSpacing: '0.5px',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                  }}
                >
                  {initials || <User size={17} />}
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                        background: 'white', borderRadius: 16,
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 16px 40px rgba(15,23,42,0.12)',
                        padding: '8px', minWidth: 220,
                        zIndex: 200,
                      }}
                    >
                      {/* User info header */}
                      <div style={{ padding: '12px 14px 14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 6 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
                          {user.firstName} {user.lastName}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                          {user.email}
                        </div>
                      </div>

                      {/* View Profile */}
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        style={{ textDecoration: 'none' }}
                      >
                        <div
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                            fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <User size={15} color="var(--blue-main)" />
                          View Profile
                        </div>
                      </Link>

                      {/* Logout */}
                      <div
                        onClick={handleLogout}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                          fontSize: 13, fontWeight: 700, color: '#dc2626',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={15} />
                        Sign Out
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* ── Logged-out: Sign In button ── */
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex',
                  padding: '10px 24px',
                  background: 'var(--blue-main)',
                  color: 'white',
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  boxShadow: '0 4px 16px rgba(37,99,235,0.25)',
                  cursor: 'pointer',
                }}
              >
                Sign In
              </motion.span>
            </Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden"
          style={{
            padding: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)',
          }}
        >
          <AnimatePresence mode="wait">
            {menuOpen
              ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={22} /></motion.span>
              : <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={22} /></motion.span>
            }
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '24px 32px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              transformOrigin: 'top',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            }}
            className="md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={link.href}
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    display: 'block',
                    paddingBottom: 16,
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {user ? (
              <>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.18 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '16px', background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)', borderRadius: 16,
                      fontSize: 13, fontWeight: 700,
                    }}
                  >
                    <User size={16} color="var(--blue-main)" />
                    {user.firstName} {user.lastName}
                  </motion.span>
                </Link>
                <div
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '16px', background: '#fef2f2',
                    color: '#dc2626', borderRadius: 16,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </div>
              </>
            ) : (
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18 }}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '16px',
                    background: 'var(--blue-main)',
                    color: 'white',
                    borderRadius: 16,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                  }}
                >
                  Sign In
                </motion.span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
