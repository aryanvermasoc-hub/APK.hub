import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly jump to the top left of the screen
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't show anything on screen, it just runs the logic above
  return null; 
}