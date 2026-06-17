import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--bg)' }}>
      <Navbar />

      <main style={{ flex: 1, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}
        className="md:px-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;