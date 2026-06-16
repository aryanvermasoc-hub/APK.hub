import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all of your page components
// (Double check these paths match your exact folder structure!)
// Notice we are adding the final filename to the end of the path!
import Home from './pages/Home/Home'; 
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Developer from './pages/Developer/Developer';
import Admin from './pages/Admin';
 
import Apps from './pages/Apps/Apps';
import AppDetails from './pages/AppDetails/AppDetails';
import Profile from './pages/Profile/Profile';
import Layout from './components/Layout/Layout';

const AppRouter = () => {
  return (
    <BrowserRouter>
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

          {/* Protected / Dashboard Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* 404 Catch-All (If they type a weird URL, send them Home) */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRouter;