import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

const events = [
  {
    emoji: '🎵',
    title: 'Jazz Festival Egypt',
    date: 'Mar 15',
    time: '8:00 PM',
    loc: 'Cairo Opera House',
    price: '250 EGP',
    tag: 'Music',
    tagColor: '#7c3aed',
    tagBg: '#f5f3ff',
  },
  {
    emoji: '⚽',
    title: 'Derby: Ahly vs Zamalek',
    date: 'Feb 28',
    time: '6:00 PM',
    loc: 'Cairo International Stadium',
    price: '350 EGP',
    tag: 'Sports',
    tagColor: '#0891b2',
    tagBg: '#ecfeff',
    featured: true,
  },
  {
    emoji: '🏛️',
    title: 'Heritage Exhibition',
    date: 'Mar 10',
    time: '10:00 AM',
    loc: 'Egyptian Museum',
    price: '150 EGP',
    tag: 'Culture',
    tagColor: '#d97706',
    tagBg: '#fffbeb',
  },
];

export default function Tickets() {
  const reduce = useReducedMotion();

  return (
    <section
      className="section-padding"
      style={{ background: '#f8fbff' }}
      aria-labelledby="tickets-heading"
    >
      <div className="container-custom">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 24,
            marginBottom: 56,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>Trending</span>
            <h2
              id="tickets-heading"
              style={{
                fontSize: 'clamp(30px, 5vw, 52px)',
                fontWeight: 900,
                letterSpacing: '-1.5px',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              Featured Events.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/events" style={{ textDecoration: 'none' }}>
              <motion.span
                whileHover={reduce ? {} : { x: 3 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: 'var(--blue-main)',
                  cursor: 'pointer',
                }}
              >
                Browse all events <ArrowRight size={13} />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {events.map((ev, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: reduce ? 0 : 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={reduce ? {} : { y: -8, transition: { duration: 0.25 } }}
              className="glass"
              style={{
                padding: 28,
                overflow: 'hidden',
                position: 'relative',
                border: ev.featured ? '1.5px solid #bfdbfe' : undefined,
                boxShadow: ev.featured
                  ? '0 20px 40px rgba(37,99,235,0.12)'
                  : undefined,
              }}
            >
              {ev.featured && (
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'var(--blue-main)',
                    color: 'white',
                    fontSize: 9,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    padding: '4px 10px',
                    borderRadius: 100,
                  }}
                >
                  Popular
                </div>
              )}

              {/* Image placeholder */}
              <div
                style={{
                  height: 160,
                  background: `linear-gradient(135deg, ${ev.tagBg}, #f8fafc)`,
                  borderRadius: 20,
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                  border: `1px solid ${ev.tagColor}20`,
                }}
              >
                {ev.emoji}
              </div>

              {/* Tag */}
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  background: ev.tagBg,
                  color: ev.tagColor,
                  borderRadius: 100,
                  fontSize: 9,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: 12,
                }}
              >
                {ev.tag}
              </span>

              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                  marginBottom: 16,
                }}
              >
                {ev.title}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {[
                  { Icon: Calendar, val: ev.date },
                  { Icon: Clock, val: ev.time },
                  { Icon: MapPin, val: ev.loc },
                ].map(({ Icon, val }) => (
                  <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={13} color="var(--blue-main)" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{val}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 20,
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--blue-main)', letterSpacing: '-0.5px' }}>
                  {ev.price}
                </span>
                <motion.button
                  whileHover={reduce ? {} : { scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '9px 20px',
                    background: 'var(--blue-main)',
                    color: 'white',
                    borderRadius: 100,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                  }}
                >
                  Buy Ticket
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
