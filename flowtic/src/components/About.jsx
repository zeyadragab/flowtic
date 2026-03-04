import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const STATS = [
  { value: '2M+', label: 'Fans' },
  { value: '27', label: 'Cities' },
  { value: '99%', label: 'Security' },
];

export default function About() {
  const reduce = useReducedMotion();

  return (
    <section
      id="about"
      className="section-padding"
      style={{ background: 'white', overflow: 'hidden' }}
      aria-labelledby="about-heading"
    >
      <div className="container-custom">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 80,
            alignItems: 'center',
          }}
        >
          {/* Left – text */}
          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="badge" style={{ marginBottom: 20, display: 'inline-flex' }}>Our Mission</span>

            <h2
              id="about-heading"
              style={{
                fontSize: 'clamp(30px, 5vw, 52px)',
                fontWeight: 900,
                letterSpacing: '-1.5px',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: 24,
              }}
            >
              Reinventing the{' '}
              <span className="gradient-text">Event Experience.</span>
            </h2>

            <p
              style={{
                fontSize: 17,
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                fontWeight: 500,
                marginBottom: 40,
              }}
            >
              We started Flowtic to solve the complexities of event ticketing in Egypt.
              By combining AI verification with a seamless user interface, we ensure you
              spend less time booking and more time experiencing.
            </p>

            <motion.button
              whileHover={reduce ? {} : { x: 4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: 'var(--blue-main)',
                cursor: 'pointer',
                padding: 0,
                marginBottom: 40,
              }}
            >
              Learn more <ArrowRight size={14} />
            </motion.button>

            {/* Stats row */}
            <div
              style={{
                display: 'flex',
                gap: 40,
                paddingTop: 32,
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              {STATS.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                >
                  <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--text-primary)' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginTop: 4 }}>
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right – visual card */}
          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            style={{ position: 'relative' }}
          >
            {/* Glow */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: -40,
                background: 'radial-gradient(ellipse, #dbeafe 0%, transparent 60%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />

            <motion.div
              animate={reduce ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="glass"
              style={{
                padding: 40,
                borderRadius: 40,
                position: 'relative',
                background: 'white',
                boxShadow: '0 32px 64px rgba(37,99,235,0.08), 0 0 0 1px rgba(37,99,235,0.05)',
              }}
            >
              {/* Progress steps */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: 16 }}>
                  Booking Flow
                </div>
                {['Choose Event', 'Select Seats', 'Secure Payment', 'Get eTicket'].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 0',
                      borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: i < 3 ? 'var(--blue-main)' : 'var(--blue-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 800,
                        color: i < 3 ? 'white' : 'var(--blue-main)',
                        flexShrink: 0,
                      }}
                    >
                      {i < 3 ? '✓' : `${i + 1}`}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: i < 3 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div
                style={{
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #eff6ff, #f0f9ff)',
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  border: '1px solid #bfdbfe',
                }}
              >
                <span style={{ fontSize: 24 }}>🎟️</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                    Ticket Ready!
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
                    Scan at the venue gate
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: 'white',
                      borderRadius: 10,
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 3,
                      padding: 6,
                    }}
                  >
                    {[...Array(4)].map((_, k) => (
                      <div key={k} style={{ background: 'var(--text-primary)', borderRadius: 2 }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
