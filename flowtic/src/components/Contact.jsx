import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [focus, setFocus] = useState('');
  const reduce = useReducedMotion();

  const inputStyle = (name) => ({
    width: '100%',
    padding: '16px 20px',
    borderRadius: 20,
    background: focus === name ? 'white' : '#f8fbff',
    border: `1.5px solid ${focus === name ? 'var(--blue-main)' : 'var(--border-subtle)'}`,
    outline: 'none',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    boxShadow: focus === name ? '0 0 0 4px rgba(37,99,235,0.08)' : 'none',
  });

  return (
    <section
      id="contact"
      className="section-padding"
      style={{ background: '#f8fbff' }}
      aria-labelledby="contact-heading"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', marginBottom: 64 }}
        >
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>Support</span>
          <h2
            id="contact-heading"
            style={{
              fontSize: 'clamp(30px, 5vw, 52px)',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Need Help?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 500 }}>
            Our team is available 24/7. We typically respond in under 2 hours.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass"
          style={{ maxWidth: 560, margin: '0 auto', padding: 40, borderRadius: 32 }}
          onSubmit={(e) => e.preventDefault()}
          aria-label="Contact form"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Name"
              style={inputStyle('name')}
              onFocus={() => setFocus('name')}
              onBlur={() => setFocus('')}
              aria-label="Your name"
            />
            <input
              type="email"
              placeholder="Email"
              style={inputStyle('email')}
              onFocus={() => setFocus('email')}
              onBlur={() => setFocus('')}
              aria-label="Your email"
            />
          </div>

          <textarea
            placeholder="How can we help you?"
            rows={5}
            style={{
              ...inputStyle('msg'),
              resize: 'none',
              marginBottom: 16,
              display: 'block',
            }}
            onFocus={() => setFocus('msg')}
            onBlur={() => setFocus('')}
            aria-label="Your message"
          />

          <motion.button
            type="button"
            onClick={() => setSent(true)}
            whileHover={reduce ? {} : { scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
              background: sent ? '#10b981' : 'var(--bg-dark)',
              color: 'white',
              transition: 'background 0.3s',
              boxShadow: sent ? '0 8px 24px rgba(16,185,129,0.2)' : '0 8px 24px rgba(15,23,42,0.12)',
            }}
          >
            {sent ? (
              <>
                <CheckCircle size={16} />
                Message Sent!
              </>
            ) : (
              <>
                <Send size={15} />
                Send Message
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
