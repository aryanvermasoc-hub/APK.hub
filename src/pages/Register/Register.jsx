import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import useAuthStore from '../../store/authStore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Normal User');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser, setSession, setRole: setGlobalRole } = useAuthStore();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    // INTERCEPT: Force developer role to pending for Admin approval
    let assignedRole = role;
    if (role === 'Developer') {
      assignedRole = 'Pending Developer';
    }

    // Renamed 'error' to 'authError' to avoid state conflict
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: assignedRole, 
        }
      }
    });

    if (authError) {
      setError(authError.message);
    } else if (data) {
      if (data.user) {
        setUser(data.user);
        // Force update the profiles table to ensure no faulty DB triggers auto-approve them
        await supabase.from('profiles').upsert({ 
          id: data.user.id, 
          email: email, 
          role: assignedRole 
        });
      }
      if (data.session) setSession(data.session);
      if (setGlobalRole) setGlobalRole(assignedRole);
      
      if (role === 'Developer') {
        alert("Registration successful! Your developer account is pending Admin approval.");
      }
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <main className="section container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>Create an Account</h2>
        
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

        <form onSubmit={handleRegister}>
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="confirmPassword" style={{ color: '#ffffff' }}>Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password" 
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="role" style={{ color: '#ffffff' }}>Account Type</label>
            <select 
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Normal User">Normal User (Download & Review)</option>
              <option value="Developer">Developer (Publish Apps)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: 'var(--space-3)', marginTop: 'var(--space-4)' }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login">
            Login here
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Register;