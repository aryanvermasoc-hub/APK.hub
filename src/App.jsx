import AppRouter from './router';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-100" style={{ backgroundColor: 'var(--bg)' }}>
      <main className="flex-grow">
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}

export default App;