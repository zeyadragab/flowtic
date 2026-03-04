import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Shield, LogOut, Ticket, Settings, ChevronRight } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  const infoRows = [
    { icon: User,   label: 'Full Name',  value: `${user.firstName} ${user.lastName}` },
    { icon: Mail,   label: 'Email',      value: user.email },
    { icon: Shield, label: 'Role',       value: user.role ?? 'User' },
  ];

  const quickLinks = [
    { icon: Ticket,   label: 'My Tickets',   sub: 'View purchased tickets' },
    { icon: Settings, label: 'Account Settings', sub: 'Manage preferences' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fbff 0%, #eff6ff 100%)',
        paddingTop: 100,
        paddingBottom: 80,
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{
            background: 'white',
            borderRadius: 28,
            padding: '40px 40px 36px',
            marginBottom: 20,
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 8px 32px rgba(15,23,42,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            flexWrap: 'wrap',
          }}
        >
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              background: 'var(--gradient-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-1px',
              boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
              flexShrink: 0,
            }}
          >
            {initials}
          </motion.div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--blue-main)', marginBottom: 6 }}>
              Account
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 4 }}>
              {user.firstName} {user.lastName}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
              {user.email}
            </p>
          </div>

          {/* Logout button */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 100,
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              color: '#dc2626',
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <LogOut size={15} />
            Sign Out
          </motion.button>
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          style={{
            background: 'white',
            borderRadius: 24,
            padding: '28px 32px',
            marginBottom: 20,
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: 20 }}>
            Session Info
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {infoRows.map(({ icon: Icon, label, value }, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: 'var(--bg-secondary)',
                }}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'white',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} color="var(--blue-main)" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textTransform: label === 'Role' ? 'capitalize' : 'none' }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick links card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          style={{
            background: 'white',
            borderRadius: 24,
            padding: '28px 32px',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: 20 }}>
            Quick Links
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {quickLinks.map(({ icon: Icon, label, sub }, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(37,99,235,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} color="var(--blue-main)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{sub}</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
