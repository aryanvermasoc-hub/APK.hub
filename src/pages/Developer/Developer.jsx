import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import useAuthStore from '../../store/authStore';
import Spinner from '../../components/Spinner';

const Developer = () => {
  const { user, role } = useAuthStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // States for data
  const [stats, setStats] = useState({ totalListings: 0, totalViews: 0, totalDownloads: 0 });
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Form states for creating/editing listing
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'APK', category: 'Games', 
    website_url: '', is_published: true
  });
  const [files, setFiles] = useState({ icon: null, apk: null });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (role !== 'Developer' && role !== 'Admin') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [role, navigate]);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Listings & Stats
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (listingsError) {
        console.error("Listings Error:", listingsError.message);
      } else {
        const currentListings = listingsData || [];
        setListings(currentListings);
        
        // Calculate stats
        const views = currentListings.reduce((acc, curr) => acc + (curr.views || 0), 0);
        const downloads = currentListings.reduce((acc, curr) => acc + (curr.downloads || 0), 0);
        setStats({ totalListings: currentListings.length, totalViews: views, totalDownloads: downloads });

        // 2. Fetch Reviews
        if (currentListings.length > 0) {
            const listingIds = currentListings.map(l => l.id);
            const { data: reviewsData, error: reviewsError } = await supabase
              .from('reviews')
              .select('*, listings(title)')
              .in('listing_id', listingIds)
              .order('created_at', { ascending: false });
            
            if (reviewsError) {
              console.error("Reviews Error:", reviewsError.message);
            } else {
              setReviews(reviewsData || []);
            }
        } else {
            setReviews([]); 
        }
      }
    } catch (err) {
      console.error("Critical Dashboard Error:", err.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  // --- Listing Management ---
  const handleFileChange = (e, type) => {
    setFiles({ ...files, [type]: e.target.files[0] });
  };

  const uploadFile = async (file, bucket) => {
    if (!file) return null;
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSaveListing = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let icon_url = formData.icon_url;
      let apk_url = formData.apk_url;

      if (files.icon) icon_url = await uploadFile(files.icon, 'icons');
      if (files.apk) apk_url = await uploadFile(files.apk, 'apks');

      const payload = { ...formData, icon_url, apk_url, user_id: user.id };

      if (editingId) {
        await supabase.from('listings').update(payload).eq('id', editingId);
      } else {
        await supabase.from('listings').insert([payload]);
      }

      setFormData({ title: '', description: '', type: 'APK', category: 'Games', website_url: '', is_published: true });
      setFiles({ icon: null, apk: null });
      setEditingId(null);
      fetchDashboardData();
    } catch (error) {
      alert("Error saving listing: " + error.message);
    }
    setIsUploading(false);
  };

  const editListing = (app) => {
    setEditingId(app.id);
    setFormData({
      title: app.title, description: app.description, type: app.type, 
      category: app.category || 'Games', website_url: app.website_url || '', 
      is_published: app.is_published
    });
    setActiveTab('create');
  };

  const deleteListing = async (id) => {
    if (window.confirm("Delete this listing?")) {
      await supabase.from('listings').delete().eq('id', id);
      fetchDashboardData();
    }
  };

  const togglePublish = async (id, currentStatus) => {
    await supabase.from('listings').update({ is_published: !currentStatus }).eq('id', id);
    fetchDashboardData();
  };

  const deleteReview = async (id) => {
    if (window.confirm("Delete this review?")) {
      await supabase.from('reviews').delete().eq('id', id);
      fetchDashboardData();
    }
  };

  // --- Loading State ---
  if (isLoadingData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 'var(--space-4)' }}>
        <Spinner />
        <p style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <main className="section container" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
      
      {/* Sidebar Navigation */}
      <aside className="card" style={{ flex: '1 1 250px', position: 'sticky', top: 'var(--space-4)' }}>
        <h2 style={{ marginBottom: 'var(--space-6)', fontSize: '1.25rem' }}>Dev Console</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {['dashboard', 'create', 'listings', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
              style={{ justifyContent: 'flex-start', width: '100%', textTransform: 'capitalize' }}
            >
              {tab === 'create' ? (editingId ? 'Edit Listing' : 'New Listing') : tab}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <section className="card" style={{ flex: '3 1 600px', minHeight: '60vh' }}>
        
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Overview Statistics</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              
              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)' }}>Total Listings</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalListings}</p>
              </div>

              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'var(--success)' }}>Total Downloads</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalDownloads}</p>
              </div>

              <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'var(--warning)' }}>Total Views</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{stats.totalViews}</p>
              </div>

            </div>
          </div>
        )}

        {/* TAB: CREATE/EDIT LISTING */}
        {activeTab === 'create' && (
          <div>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>{editingId ? 'Edit Listing' : 'Create New Listing'}</h2>
            
            <form onSubmit={handleSaveListing} style={{ maxWidth: '800px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ color: '#ffffff' }}>Title</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#ffffff' }}>App Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="APK">APK only</option>
                    <option value="Website">Website only</option>
                    <option value="APK + Website">APK + Website</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#ffffff' }}>Category</label>
                  <input required type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Games, Tools" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ color: '#ffffff' }}>Description</label>
                <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              {(formData.type === 'Website' || formData.type === 'APK + Website') && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#ffffff' }}>Website URL</label>
                  <input type="url" value={formData.website_url} onChange={(e) => setFormData({...formData, website_url: e.target.value})} placeholder="https://..." />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#ffffff' }}>Upload App Icon (Image)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'icon')} />
                </div>
                {(formData.type === 'APK' || formData.type === 'APK + Website') && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#ffffff' }}>Upload APK File</label>
                    <input type="file" accept=".apk" onChange={(e) => handleFileChange(e, 'apk')} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input type="checkbox" id="publish" checked={formData.is_published} onChange={(e) => setFormData({...formData, is_published: e.target.checked})} style={{ width: 'auto' }} />
                <label htmlFor="publish" style={{ margin: 0, cursor: 'pointer', color: '#ffffff' }}>Publish immediately</label>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="btn btn-primary"
                  style={{ flexGrow: 1, padding: 'var(--space-3)' }}
                >
                  {isUploading ? 'Uploading Data... Please wait' : 'Save Listing'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => {setEditingId(null); setActiveTab('listings');}} className="btn btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* TAB: MANAGE LISTINGS */}
        {activeTab === 'listings' && (
          <div>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Manage Listings</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: 'var(--space-3)' }}>Title</th>
                    <th style={{ padding: 'var(--space-3)' }}>Type</th>
                    <th style={{ padding: 'var(--space-3)' }}>Stats</th>
                    <th style={{ padding: 'var(--space-3)' }}>Status</th>
                    <th style={{ padding: 'var(--space-3)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 'var(--space-3)', fontWeight: '600', color: '#ffffff' }}>{app.title}</td>
                      <td style={{ padding: 'var(--space-3)', color: '#ffffff' }}>{app.type}</td>
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
                        <button onClick={() => togglePublish(app.id, app.is_published)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}>
                          {app.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button onClick={() => editListing(app)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
                        <button onClick={() => deleteListing(app.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: REVIEWS */}
        {activeTab === 'reviews' && (
          <div>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Review Moderation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {reviews.length === 0 ? (
                 <p style={{ color: 'var(--text-muted)' }}>No reviews have been left on your apps yet.</p>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} style={{ padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: '0 0 var(--space-1) 0', fontWeight: '600', color: 'var(--primary)' }}>
                        {rev.listings?.title} <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.875rem' }}>- by {rev.user_email}</span>
                      </p>
                      <p style={{ margin: '0 0 var(--space-1) 0', color: 'var(--warning)', letterSpacing: '2px' }}>{'★'.repeat(rev.rating)}</p>
                      <p style={{ margin: 0, fontSize: '0.95rem' }}>{rev.comment}</p>
                    </div>
                    <button onClick={() => deleteReview(rev.id)} className="btn" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 15%, transparent)', color: 'var(--error)' }}>
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
};

export default Developer;