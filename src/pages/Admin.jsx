import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase'; // Adjust your path if needed
import useAuthStore from '../store/authStore';
import Spinner from '../components/Spinner';

export default function Admin() {
  const { role } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0, totalListings: 0, totalReviews: 0, totalDownloads: 0, totalViews: 0 });
  
  const [usersList, setUsersList] = useState([]);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (role === 'Admin') {
      fetchAllData();
    }
  }, [role]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, listingsRes, reviewsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('listings').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*, listings(title)').order('created_at', { ascending: false })
      ]);

      const uData = usersRes.data || [];
      const lData = listingsRes.data || [];
      const rData = reviewsRes.data || [];

      setUsersList(uData);
      setListings(lData);
      setReviews(rData);

      const totalDownloads = lData.reduce((acc, curr) => acc + (curr.downloads || 0), 0);
      const totalViews = lData.reduce((acc, curr) => acc + (curr.views || 0), 0);
      setStats({
        totalUsers: uData.length,
        totalListings: lData.length,
        totalReviews: rData.length,
        totalDownloads,
        totalViews
      });
    } catch (error) {
      console.error("Admin fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Update failed. Row Level Security (RLS) blocked the action.");
      }
      setUsersList(usersList.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating role:", error.message);
      alert("Error: " + error.message);
    }
  };

  const togglePublishListing = async (id, currentStatus) => {
    await supabase.from('listings').update({ is_published: !currentStatus }).eq('id', id);
    fetchAllData();
  };

  const deleteListing = async (id) => {
    if (window.confirm("WARNING: Delete this listing permanently from the platform?")) {
      await supabase.from('listings').delete().eq('id', id);
      fetchAllData();
    }
  };

  const deleteReview = async (id) => {
    if (window.confirm("Delete this review permanently?")) {
      await supabase.from('reviews').delete().eq('id', id);
      fetchAllData();
    }
  };

  // SECURITY WALL: Kick out anyone who isn't an Admin
  if (role !== 'Admin') {
    return (
      <div className="section container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <h1 style={{ color: 'var(--error)' }}>Access Denied. Admins Only.</h1>
      </div>
    );
  }

  // --- Loading State ---
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 'var(--space-4)' }}>
        <Spinner />
        <p style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Loading Admin Command Center...</p>
      </div>
    );
  }

  return (
    <main className="section container" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
      
      {/* Admin Sidebar */}
      <aside className="card" style={{ flex: '1 1 250px', position: 'sticky', top: 'var(--space-4)' }}>
        <h2 style={{ marginBottom: 'var(--space-6)', fontSize: '1.25rem' }}>Admin Control</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {['dashboard', 'users', 'listings', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', width: '100%', textTransform: 'capitalize' }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <section className="card" style={{ flex: '3 1 600px', minHeight: '60vh' }}>
        
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Platform Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
              
              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Total Users</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalUsers}</p>
              </div>
              
              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)' }}>Total Apps</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalListings}</p>
              </div>
              
              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'var(--success)' }}>Global Downloads</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalDownloads}</p>
              </div>
              
              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'var(--warning)' }}>Total Reviews</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalReviews}</p>
              </div>

              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#a855f7' }}>Global Views</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalViews}</p>
              </div>

            </div>
          </div>
        )}

        {/* TAB: USERS */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>User Management</h2>
            
            <input 
              type="text" 
              placeholder="Search by email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: '400px', marginBottom: 'var(--space-6)' }}
            />
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: 'var(--space-3)' }}>Email</th>
                    <th style={{ padding: 'var(--space-3)' }}>Role</th>
                    <th style={{ padding: 'var(--space-3)' }}>Joined</th>
                    <th style={{ padding: 'var(--space-3)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.filter(u => u.email?.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="break-all" style={{ padding: 'var(--space-3)', fontWeight: '500', color: '#ffffff', maxWidth: '200px' }}>
                    {u.username && <div style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>{u.username}</div>}
                    <div style={{ fontSize: u.username ? '0.85rem' : '1rem', color: u.username ? 'var(--text-muted)' : '#ffffff' }}>{u.email}</div>
                  </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span style={{ 
                          padding: 'var(--space-1) var(--space-2)', 
                          borderRadius: 'var(--radius)', 
                          fontSize: '0.75rem', 
                          fontWeight: '600',
                          /* Dynamic Badge Colors Based on Role */
                          backgroundColor: 
                            u.role === 'Admin' ? 'color-mix(in srgb, var(--error) 15%, transparent)' :
                            u.role === 'Developer' ? 'color-mix(in srgb, var(--primary) 15%, transparent)' :
                            u.role === 'Pending Developer' ? 'color-mix(in srgb, var(--warning) 15%, transparent)' :
                            'var(--secondary)',
                          color: 
                            u.role === 'Admin' ? 'var(--error)' :
                            u.role === 'Developer' ? 'var(--primary)' :
                            u.role === 'Pending Developer' ? 'var(--warning)' :
                            'var(--text-muted)'
                        }}>
                          {u.role || 'Normal User'}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <select 
                          value={u.role || 'Normal User'} 
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          style={{ padding: 'var(--space-1) var(--space-2)', fontSize: '0.875rem', width: 'auto' }}
                        >
                          <option value="Normal User">Set Normal User</option>
                          <option value="Pending Developer">Pending Developer</option>
                          <option value="Developer">Approve Developer</option>
                          <option value="Admin">Make Admin</option>
                          <option value="Banned">Ban User 🚫</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: GLOBAL LISTINGS */}
        {activeTab === 'listings' && (
          <div>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Global Listings</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: 'var(--space-3)' }}>Title</th>
                    <th style={{ padding: 'var(--space-3)' }}>Type / Category</th>
                    <th style={{ padding: 'var(--space-3)' }}>Stats</th>
                    <th style={{ padding: 'var(--space-3)' }}>Status</th>
                    <th style={{ padding: 'var(--space-3)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 'var(--space-3)', fontWeight: '600', color: '#ffffff' }}>{app.title}</td>
                      <td style={{ padding: 'var(--space-3)', color: '#ffffff' }}>{app.type} - <span style={{ color: 'var(--text-muted)' }}>{app.category}</span></td>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{app.downloads || 0} DLs / {app.views || 0} Views</td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span style={{ 
                          padding: 'var(--space-1) var(--space-2)', 
                          borderRadius: 'var(--radius)', 
                          fontSize: '0.75rem', 
                          fontWeight: '600',
                          backgroundColor: app.is_published ? 'color-mix(in srgb, var(--success) 15%, transparent)' : 'color-mix(in srgb, var(--warning) 15%, transparent)',
                          color: app.is_published ? 'var(--success)' : 'var(--warning)'
                        }}>
                          {app.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3)', display: 'flex', gap: 'var(--space-3)' }}>
                        <button onClick={() => togglePublishListing(app.id, app.is_published)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}>
                          {app.is_published ? 'Force Unpublish' : 'Force Publish'}
                        </button>
                <button onClick={() => deleteListing(app.id)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: '500' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: GLOBAL REVIEWS */}
        {activeTab === 'reviews' && (
          <div>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Global Review Moderation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No reviews currently exist on the platform.</p>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} style={{ padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: '0 0 var(--space-1) 0', fontWeight: '600', color: 'var(--primary)' }}>
                        {rev.listings?.title} <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.875rem' }}>- User ID: {rev.user_id.substring(0,8)}...</span>
                      </p>
                      <p style={{ margin: '0 0 var(--space-1) 0', color: 'var(--warning)', letterSpacing: '2px' }}>{'★'.repeat(rev.rating)}</p>
                      <p style={{ margin: 0, fontSize: '0.95rem' }}>{rev.comment}</p>
                    </div>
                    <button onClick={() => deleteReview(rev.id)} className="btn" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 15%, transparent)', color: '#ffffff' }}>
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </section>
    </main>
  );
}