import { motion, useReducedMotion } from 'framer-motion';
import { Rocket, BarChart3, Users2, Settings2, ArrowRight } from 'lucide-react';

const perks = [
  { icon: BarChart3, label: 'Real-time analytics' },
  { icon: Users2, label: 'Audience management' },
  { icon: Settings2, label: 'Custom event builder' },
];

export default function ForCreators() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        margin: '0 16px 64px',
        borderRadius: 48,
        overflow: 'hidden',
        background: 'var(--bg-dark)',
        position: 'relative',
      }}
      aria-labelledby="creators-heading"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dot grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container-custom"
        style={{
          padding: '96px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{
            width: 72,
            height: 72,
            background: 'var(--gradient-blue)',
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            boxShadow: '0 16px 48px rgba(37,99,235,0.4)',
          }}
        >
          <Rocket size={32} color="white" />
        </motion.div>

        <motion.h2
          id="creators-heading"
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: 'clamp(36px, 6vw, 68px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            color: 'white',
            marginBottom: 24,
          }}
        >
          Organize Your Next{' '}
          <br />
          <span style={{ color: '#60a5fa' }}>Big Event.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
          style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            fontWeight: 500,
            maxWidth: 520,
            marginBottom: 56,
          }}
        >
          Egypt's most powerful toolkit for event promoters. Scale from 50 to 50,000 attendees without breaking a sweat.
        </motion.p>

        {/* Perks row */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.26 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 56,
          }}
        >
          {perks.map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 100,
                color: 'rgba(255,255,255,0.8)',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Icon size={14} style={{ opacity: 0.7 }} />
              {label}
            </div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          whileHover={reduce ? {} : { scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '16px 40px',
            background: 'white',
            color: 'var(--blue-main)',
            borderRadius: 100,
            fontWeight: 800,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(255,255,255,0.15)',
          }}
        >
          Get Started <ArrowRight size={15} />
        </motion.button>
      </div>
    </section>
  );
}
