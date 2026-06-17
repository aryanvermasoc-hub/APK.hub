import { Routes, Route } from 'react-router-dom';

// Import all of your page components
import Home from './pages/Home/Home'; 
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Developer from './pages/Developer/Developer';
import Admin from './pages/Admin';
 
import Apps from './pages/Apps/Apps';
import AppDetails from './pages/AppDetails/AppDetails';
import Profile from './pages/Profile/Profile';
import Layout from './components/Layout/Layout';

// Change from './pages/...' to './components/...'
import About from './components/About';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';

const AppRouter = () => {
  return (
    <Layout>
      {/* The <Routes> wrapper ensures only ONE page loads at a time 
          based on the URL in the browser's address bar.
      */}
      <Routes>
        {/* Public Routes (Anyone can see these) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* App Directory Routes */}
        <Route path="/apps" element={<Apps />} />
        <Route path="/apps/:id" element={<AppDetails />} />

        {/* Footer Legal & Info Routes */}
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Protected / Dashboard Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/admin" element={<Admin />} />
        
        {/* 404 Catch-All (If they type a weird URL, send them Home) */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
};

export default AppRouter;