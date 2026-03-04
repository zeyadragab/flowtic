import { motion, useReducedMotion } from 'framer-motion';
import { Scan, ShieldCheck, Zap } from 'lucide-react';

const items = [
  {
    icon: Scan,
    title: 'Face ID Entry',
    desc: 'Biometric verification means zero fraud at the gate.',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    icon: ShieldCheck,
    title: 'Fraud Control',
    desc: 'AI monitors every transaction in real time.',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: Zap,
    title: 'Real-time Crowd AI',
    desc: 'Smart analytics for seamless crowd management.',
    color: '#0891b2',
    bg: '#ecfeff',
  },
];

export default function AIFeaturesSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="section-padding"
      style={{ background: 'white' }}
      aria-labelledby="ai-heading"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>Cutting Edge</span>
          <h2
            id="ai-heading"
            style={{
              fontSize: 'clamp(30px, 5vw, 52px)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
            }}
          >
            Smart Technology,{' '}
            <span className="gradient-text">Zero Friction.</span>
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 32,
          }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0 }}
            >
              {/* Icon circle */}
              <motion.div
                whileHover={reduce ? {} : { scale: 1.1 }}
                animate={reduce ? {} : {
                  boxShadow: [
                    `0 0 0 0 ${item.color}20`,
                    `0 0 0 16px ${item.color}00`,
                    `0 0 0 0 ${item.color}00`,
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  marginBottom: 28,
                  border: `1px solid ${item.color}20`,
                }}
              >
                <item.icon size={36} />
              </motion.div>

              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: 10,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  lineHeight: 1.6,
                  maxWidth: 260,
                }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
