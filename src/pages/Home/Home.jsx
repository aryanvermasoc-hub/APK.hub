import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Spinner from '../../components/Spinner';

const FEATURES = [
  {
    icon: '📦',
    title: 'Direct APKs',
    desc: 'Download verified APK files straight to your device — no third-party installers, no bloat.',
  },
  {
    icon: '🌐',
    title: 'Web Apps',
    desc: 'Discover powerful PWAs and useful sites hand-picked by our developer community.',
  },
  {
    icon: '⭐',
    title: 'Real Reviews',
    desc: 'Authentic ratings from real users so you only install what\'s actually worth it.',
  },
  {
    icon: '🔒',
    title: 'Verified Devs',
    desc: 'Every publisher is approved by our admin team — no random uploads, no surprises.',
  },
];

const Home = () => {
  const [recentApps, setRecentApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { role } = useAuthStore();

  useEffect(() => {
    const fetchRecentApps = async () => {
      try {
        setRecentApps([]);
      } catch (error) {
        console.error('Failed to fetch recent apps:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentApps();
  }, []);

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '1.5rem',
            padding: '0.3rem 0.9rem',
            borderRadius: '9999px',
            border: '1px solid rgba(249,115,22,0.3)',
            backgroundColor: 'rgba(249,115,22,0.08)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--primary)',
          }}>
            <span>⚡</span> Community APK & Web App Platform
          </div>

          <h1 className="hero-title">
            Discover &amp; Share<br />
            <span className="highlight">Great Apps</span>
          </h1>

          <p className="hero-subtitle">
            Your centralized hub for finding APKs and Web Apps. Download, review,
            and explore safely within our growing community.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/apps" className="btn btn-primary btn-lg">
              ▶ Browse Library
            </Link>
            {role === 'Developer' && (
              <Link to="/developer" className="btn btn-secondary btn-lg">
                🔧 Publish an App
              </Link>
            )}
            {!role && (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Join the Community
              </Link>
            )}
          </div>

          {/* Decorative speed lines */}
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '0.25rem', opacity: 0.4 }}>
            {[40, 80, 120, 80, 40].map((w, i) => (
              <div key={i} style={{
                height: '2px', width: `${w}px`,
                background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                borderRadius: '1px',
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              marginBottom: '0.5rem',
            }}>Platform Features</p>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 0 }}>Why Use APK.hub?</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.25rem',
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENTLY ADDED ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', marginBottom: 0 }}>Recently Added</h2>
            </div>
            <Link to="/apps" className="btn btn-ghost btn-sm">
              View All →
            </Link>
          </div>

          {isLoading ? (
            <div className="loading-container" style={{ minHeight: '200px' }}>
              <Spinner className="w-8 h-8" />
              <span className="loading-text">Loading new apps...</span>
            </div>
          ) : recentApps.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}>
              {recentApps.map((app) => (
                <div key={app._id || app.id} className="app-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div className="app-icon-wrapper" style={{ margin: 0, width: '3rem', height: '3rem' }}>
                      {app.icon || '📱'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: '#ffffff' }}>{app.name}</h3>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: '500' }}>{app.type}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', flexGrow: 1, color: '#ffffff' }}>{app.desc || app.description}</p>
                  <div style={{ marginTop: '1rem' }}>
                    <Link to={`/apps/${app._id || app.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🏁</div>
              <p className="empty-state-title">Track is clear</p>
              <p className="empty-state-desc">No apps have been added yet. Be the first to publish one!</p>
              {role === 'Developer' && (
                <Link to="/developer" className="btn btn-primary">Publish Your App</Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      {!role && (
        <section className="section">
          <div className="container">
            <div className="page-header" style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.75rem' }}>
                Join the Crew
              </p>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.75rem' }}>
                Ready to get behind the wheel?
              </h2>
              <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
                Register as a developer to publish apps, or sign up as a user to leave reviews and track your downloads.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary btn-lg">Create Account</Link>
                <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;