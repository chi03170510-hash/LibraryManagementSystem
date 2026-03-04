import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaBell, FaBookOpen, FaHistory, FaUsers } from 'react-icons/fa';
import { useBooks } from '../context/BookContext';
import './Landing.css';

const quickStats = [
  { label: 'Reading now', value: '12', meta: 'Due today', accent: 'primary' },
  { label: 'Saved titles', value: '38', meta: 'From 6 lists', accent: 'neutral' },
  { label: 'Borrow queue', value: '04', meta: 'Ready at desk', accent: 'warning' },
];

const featureCards = [
  {
    icon: <FaBookOpen />,
    title: 'Browse beautifully',
    desc: 'Filter and save your next reads with a single tap.',
    to: '/reader/books',
  },
  {
    icon: <FaHistory />,
    title: 'Borrow timeline',
    desc: 'Track due dates and renew instantly from anywhere.',
    to: '/reader/transactions',
  },
  {
    icon: <FaUsers />,
    title: 'Clubs & notes',
    desc: 'Swap highlights with the community and build reading lists.',
    to: '/reader/social',
  },
  {
    icon: <FaBell />,
    title: 'Smart reminders',
    desc: 'Friendly nudges for pick-ups, returns, and new arrivals.',
    to: '/reader/notifications',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { books, refreshBooks, loading } = useBooks();
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!books || books.length === 0) {
      refreshBooks();
    }
  }, [books, refreshBooks]);

  const featured = useMemo(() => (books || []).slice(0, 8), [books]);

  const next = () => setIndex((prev) => (featured.length ? (prev + 1) % featured.length : 0));
  const prev = () => setIndex((prev) => (featured.length ? (prev - 1 + featured.length) % featured.length : 0));

  useEffect(() => {
    if (!featured.length) return;
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 3500);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [featured.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [featured.length]);

  return (
    <div className="landing">
      <section className="landing__hero">
        <div className="landing__hero-content">
          <p className="landing__eyebrow">Reader home</p>
          <h1>Stay in rhythm with your reading life</h1>
          <p className="landing__subtitle">
            Quick jumps to current loans, saved notes, and curated drops from the PTIT Library team.
          </p>
          <div className="landing__cta">
            <button className="btn-primary" onClick={() => navigate('/reader/books')}>
              Continue exploring <FaArrowRight />
            </button>
            <button className="btn-muted" onClick={() => navigate('/reader/streak')}>
              View streak
            </button>
          </div>
          <div className="landing__quick-grid">
            {quickStats.map((stat) => (
              <article key={stat.label} className={`quick-card quick-card--${stat.accent}`}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.meta}</small>
              </article>
            ))}
          </div>
        </div>
        <div className="landing__hero-visual" aria-hidden>
          <div className="visual-card">
            <span>Up next</span>
            <strong>{featured?.[0]?.title ?? 'Loading list...'}</strong>
            <p>{featured?.[0]?.author ?? 'We will suggest a book shortly.'}</p>
            <button type="button" onClick={() => navigate('/reader/books')}>
              Open reading list
            </button>
          </div>
          <div className="visual-accent" />
        </div>
      </section>

      <section className="landing__carousel">
        <header>
          <div>
            <p className="landing__eyebrow">Spotlight</p>
            <h2>Fresh picks for this week</h2>
          </div>
            <div className="landing__carousel-actions">
            <button onClick={prev} aria-label="Previous spotlight">
              ‹
            </button>
            <button onClick={next} aria-label="Next spotlight">
              ›
            </button>
          </div>
        </header>
        <div className="landing__carousel-viewport">
          {!featured.length ? (
            <div className="carousel-empty">{loading ? 'Loading books…' : 'No spotlight books yet.'}</div>
          ) : (
            featured.map((b, i) => (
              <article
                key={b.id}
                className={`spotlight-card ${i === index ? 'is-active' : ''}`}
                onClick={() => navigate(`/reader/books/${b.id}`)}
              >
                {b.coverPhotoUrl ? <img src={b.coverPhotoUrl} alt={b.title} /> : <div className="cover-fallback">{b.title.charAt(0)}</div>}
                <div>
                  <span>{b.category || 'General'}</span>
                  <h3>{b.title}</h3>
                  <p>{b.author}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/reader/books/${b.id}`);
                    }}
                  >
                    View details
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="landing__feature-grid">
        {featureCards.map((card) => (
          <article key={card.title} className="feature-pill" onClick={() => navigate(card.to)}>
            <div className="feature-pill__icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <span>Open</span>
          </article>
        ))}
      </section>

      <section className="landing__stats">
        <article>
          <strong>10k+</strong>
          <span>Available titles</span>
        </article>
        <article>
          <strong>92%</strong>
          <span>Pick-up satisfaction</span>
        </article>
        <article>
          <strong>48h</strong>
          <span>Avg. hold time</span>
        </article>
        <article>
          <strong>1.2k</strong>
          <span>Community reviews</span>
        </article>
      </section>

      <section className="landing__secondary">
        <div className="panel">
          <h2>Need a quick recommendation?</h2>
          <p>Tell us what you enjoy and we will curate a shelf for you every Monday morning.</p>
          <div>
            <button className="btn-primary" onClick={() => navigate('/reader/books')}>
              Build my list
            </button>
            <button className="btn-muted" onClick={() => navigate('/reader/social')}>
              Join the club
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
