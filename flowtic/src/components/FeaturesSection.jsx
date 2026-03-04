import { motion, useReducedMotion } from 'framer-motion';
import { Ticket, ScanFace, Scale, Coffee } from 'lucide-react';

const features = [
  {
    icon: Ticket,
    title: 'Smart Booking',
    desc: 'Secure your seats in seconds.',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: ScanFace,
    title: 'AI Verification',
    desc: 'Fraud-proof entry systems.',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    icon: Scale,
    title: 'Fair Resale',
    desc: 'No scams. Capped prices.',
    color: '#0891b2',
    bg: '#ecfeff',
  },
  {
    icon: Coffee,
    title: 'Refreshments',
    desc: 'Order direct from seat.',
    color: '#d97706',
    bg: '#fffbeb',
  },
];

export default function FeaturesSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="features"
      className="section-padding"
      style={{ background: '#f8fbff' }}
      aria-labelledby="features-heading"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>Core Benefits</span>
          <h2
            id="features-heading"
            style={{
              fontSize: 'clamp(30px, 5vw, 52px)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-1.5px',
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            Built for the Modern Fan.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 480, margin: '0 auto', fontWeight: 500 }}>
            Simple tools, powerful experiences. We handle the tech, you enjoy the show.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}
        >
          {features.map((f, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: reduce ? 0 : 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={reduce ? {} : { y: -8, transition: { duration: 0.25 } }}
              className="glass"
              style={{
                padding: 40,
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle bg accent */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  background: f.bg,
                  borderRadius: '50%',
                  opacity: 0.6,
                  pointerEvents: 'none',
                }}
              />

              <motion.div
                whileHover={reduce ? {} : { scale: 1.1, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  width: 56,
                  height: 56,
                  background: f.bg,
                  borderRadius: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 28,
                  color: f.color,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <f.icon size={26} />
              </motion.div>

              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  fontWeight: 500,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {f.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
