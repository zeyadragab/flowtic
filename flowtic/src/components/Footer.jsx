import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LINKS = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Support', href: '#contact' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-dark)',
        padding: '48px 0',
      }}
      role="contentinfo"
    >
      <div
        className="container-custom"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 32,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: 'var(--gradient-blue)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 900,
              color: 'white',
            }}
          >
            FT
          </div>
          <span style={{ fontSize: 18, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>Flowtic</span>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation" style={{ display: 'flex', gap: 32 }}>
          {LINKS.map(({ label, href }) => (
            <motion.div key={label} whileHover={{ y: -2 }}>
              <Link
                to={href}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Copyright */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          © 2026 Flowtic Egypt
        </div>
      </div>
    </footer>
  );
}
