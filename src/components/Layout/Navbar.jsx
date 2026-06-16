import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `relative font-medium text-sm tracking-wider uppercase transition-colors duration-150 pb-1 ${
      isActive(path)
        ? 'text-[var(--primary)]'
        : 'text-[var(--text-muted)] hover:text-[var(--text)]'
    }`;

  return (
    <header className="speed-stripe sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 no-underline group"
            onClick={() => setMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm shadow-[var(--glow-orange)] transition-shadow group-hover:shadow-[0_0_16px_rgba(249,115,22,0.5)]"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              ⚙
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text)', textTransform: 'uppercase' }}>
              APK<span style={{ color: 'var(--primary)' }}>.hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/apps" className={navLinkClass('/apps')}>Browse</Link>
            {(role === 'Developer' || role === 'Admin') && (
              <Link to="/developer" className={navLinkClass('/developer')}>Dev Console</Link>
            )}
            {role === 'Admin' && (
              <Link
                to="/admin"
                className="text-sm font-semibold tracking-wider uppercase transition-colors"
                style={{ color: 'var(--danger)', fontFamily: 'var(--font-display)' }}
              >
                ⚠ Admin
              </Link>
            )}
          </nav>

          {/* Auth Controls – Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 no-underline group">
                  <div className="avatar w-8 h-8 text-sm group-hover:shadow-[var(--glow-orange)] transition-shadow">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    {user.email.split('@')[0]}
                  </span>
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded transition-colors hover:bg-[var(--surface-2)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none' }}
          >
            <span className={`block w-5 h-0.5 bg-[var(--text-muted)] transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[var(--text-muted)] transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[var(--text-muted)] transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[var(--border)] py-4 flex flex-col gap-2">
            <Link to="/" className="sidebar-nav-btn" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
            <Link to="/apps" className="sidebar-nav-btn" onClick={() => setMenuOpen(false)}>📦 Browse Apps</Link>
            {(role === 'Developer' || role === 'Admin') && (
              <Link to="/developer" className="sidebar-nav-btn" onClick={() => setMenuOpen(false)}>🔧 Dev Console</Link>
            )}
            {role === 'Admin' && (
              <Link to="/admin" className="sidebar-nav-btn" style={{ color: 'var(--danger)' }} onClick={() => setMenuOpen(false)}>⚠ Admin Panel</Link>
            )}
            <div className="border-t border-[var(--border)] pt-3 mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to="/profile" className="sidebar-nav-btn" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
                  <button onClick={handleLogout} className="btn btn-danger btn-sm text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;