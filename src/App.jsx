import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; 

function App() {
  
  // The Reload Warning Hook
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // This tells the browser to pause and show the warning dialog
      event.preventDefault();
      
      // ⚠️ We can set the custom string here, but Chrome/Edge/Safari 
      // will ignore this text for security reasons and show their default message.
      event.returnValue = 'You will be logged out if you reload!'; 
    };

    // Attach the listener when the app loads
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean it up when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); 

  return (
    // Wrap everything in BrowserRouter so routing and scrolling work together
    <BrowserRouter>
      
      {/* Instantly scrolls to the top when the URL changes */}
      <ScrollToTop /> 

      <div className="min-h-screen flex flex-col font-sans text-gray-100" style={{ backgroundColor: 'var(--bg)' }}>
        <main className="flex-grow">
          <AppRouter />
        </main>
        <Footer />
      </div>

    </BrowserRouter>
  );
}

export default App;