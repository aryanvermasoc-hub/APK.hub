import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
      <Navbar />

      <main style={{ flex: 1, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}
        className="md:px-6">
        {children}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        padding: '2rem 1rem',
        marginTop: '2rem',
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '1.5rem', height: '1.5rem',
              borderRadius: '0.25rem',
              backgroundColor: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '0.7rem', fontWeight: 700
            }}>⚙</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text)', textTransform: 'uppercase' }}>
              APK<span style={{ color: 'var(--primary)' }}>.hub</span>
            </span>
          </div>
          {/* Speed stripe */}
          <div style={{ width: '4rem', height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)' }} />
          <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
            &copy; {new Date().getFullYear()} APK.hub &mdash; All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;