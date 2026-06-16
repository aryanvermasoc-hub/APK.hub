import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser, setSession, setRole } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Renamed 'error' to 'authError' to avoid conflicting with the 'error' state variable above
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else if (data) {
      // Fetch the real, up-to-date role from the database profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      let userRole = profile?.role || data.user.user_metadata?.role || 'Normal User';

      // Self-healing: If the user logs in but isn't in the profiles table, add them now
      if (!profile) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          role: userRole
        });
      }

      // Prevent banned users from logging in
      if (userRole === 'Banned') {
        await supabase.auth.signOut();
        setError("Your account has been banned.");
        setLoading(false);
        return;
      }

      setUser(data.user);
      setSession(data.session);
      if (setRole) setRole(userRole);

      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    /* We use the container and section classes to center the form on the screen */
    <main className="section container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      
      {/* We apply our global .card class to instantly get the correct background, border, and shadows */}
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>Login to APK.hub</h2>
        
        {/* Error Message Box */}
        {error && (
          <div style={{ 
            backgroundColor: 'color-mix(in srgb, var(--error) 10%, transparent)', 
            color: '#ffffff', 
            border: '1px solid var(--error)',
            padding: 'var(--space-3)', 
            borderRadius: 'var(--radius)', 
            marginBottom: 'var(--space-4)', 
            textAlign: 'center', 
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        {/* Notice how clean the form is! 
          Because of index.css, the inputs and labels automatically style themselves. 
        */}
        <form onSubmit={handleLogin}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="email" style={{ color: '#ffffff' }}>Email</label>
            <input 
              id="email"
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="password" style={{ color: '#ffffff' }}>Password</label>
            <input 
              id="password"
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: 'var(--space-3)', marginTop: 'var(--space-2)' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          {/* Global a:not(.btn) CSS handles the hover and blue color automatically */}
          <Link to="/register">
            Register here
          </Link>
        </div>
        
      </div>
    </main>
  );
};

export default Login;