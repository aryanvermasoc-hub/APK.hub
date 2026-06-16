import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Page Imports (We will create these files next)
import Home from '../pages/Home/Home';
import Apps from '../pages/Apps/Apps';
import AppDetails from '../pages/AppDetails/AppDetails';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Profile from '../pages/Profile/Profile';
import Developer from '../pages/Developer/Developer';
import Admin from '../pages/Admin';
import Layout from '../components/Layout/Layout';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/:id" element={<AppDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Normal User & Developer) */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Developer Only Route */}
          <Route path="/developer" element={<Developer />} />
          
          {/* Admin Only Route */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRouter;