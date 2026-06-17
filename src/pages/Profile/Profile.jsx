import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import useAuthStore from '../../store/authStore';

const Profile = () => {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyReviews();
  }, [user, navigate]);

  const fetchMyReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*, listings(title)')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', user.id);
      
    if (!error) {
      fetchMyReviews();
    } else {
      alert("Error deleting review: " + error.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <main className="section container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      
      {/* Profile Header */}
      <section className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-6)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flex: 1, minWidth: 0 }}>
          {/* Avatar */}
          <div style={{ 
            width: '5rem', 
            height: '5rem', 
            backgroundColor: 'var(--secondary)', 
            color: 'var(--primary)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '2rem', 
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {user.email.charAt(0).toUpperCase()}
          </div>
          
          <div style={{ minWidth: 0 }}>
            <h1 className="break-all text-white" style={{ margin: 0, fontSize: '1.5rem' }}>{user.email}</h1>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
              Account Type: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{role}</span>
            </p>
            {role === 'Pending Developer' && (
              <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', backgroundColor: 'color-mix(in srgb, var(--warning) 15%, transparent)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius)', fontSize: '0.875rem', fontWeight: '500' }}>
                ⏳ Your developer account is currently pending Admin approval.
              </div>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          {(role === 'Developer' || role === 'Admin') && (
            <Link to="/developer" className="btn btn-primary">
              Developer Dashboard
            </Link>
          )}
          <button 
            onClick={handleLogout}
            className="btn font-medium transition text-gray-400 hover:text-white"
            style={{ 
              backgroundColor: 'color-mix(in srgb, var(--error) 15%, transparent)', 
              border: 'none'
            }}
          >
            LOGOUT
          </button>
        </div>
      </section>

      {/* User's Reviews Section */}
      <section className="card">
        <h2 style={{ marginBottom: 'var(--space-6)' }}>My Reviews</h2>
        
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading your reviews...</p>
        ) : reviews.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--space-8)', 
            backgroundColor: 'var(--secondary)', 
            borderRadius: 'var(--radius)', 
            border: '1px solid var(--border)' 
          }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>You haven't written any reviews yet.</p>
            <Link to="/apps" style={{ fontWeight: '600' }}>Explore apps</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {reviews.map((rev) => (
              <div key={rev.id} style={{ 
                padding: 'var(--space-4)', 
                backgroundColor: 'var(--secondary)', 
                borderRadius: 'var(--radius)', 
                border: '1px solid var(--border)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <div>
                    <Link to={`/apps/${rev.listing_id}`} style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                      {rev.listings?.title || 'Unknown App'}
                    </Link>
                    <p style={{ color: 'var(--warning)', fontSize: '0.875rem', letterSpacing: '2px', marginTop: 'var(--space-1)', marginBottom: 0 }}>
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteReview(rev.id)}
                    style={{ 
                      backgroundColor: 'color-mix(in srgb, var(--error) 15%, transparent)', 
                      color: 'var(--error)', 
                      border: 'none',
                      padding: 'var(--space-1) var(--space-2)',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
                
                {/* Comment Box inside the review card */}
                <p style={{ 
                  color: 'var(--text)', 
                  fontSize: '0.95rem', 
                  backgroundColor: 'var(--surface)', 
                  padding: 'var(--space-3)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius)',
                  margin: 0
                }}>
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;