import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import useAuthStore from '../../store/authStore';

const getFilePathFromUrl = (publicUrl, bucketName) => {
  if (!publicUrl) return null;
  const parts = publicUrl.split(`/public/${bucketName}/`);
  return parts.length > 1 ? parts[1] : null;
};

const Profile = () => {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Profile Data States
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({ username: '', bio: '', developer_name: '', website_url: '' });
  const [isUploading, setIsUploading] = useState(false);

  // Account Data States (Supabase Auth)
  const [accountData, setAccountData] = useState({ email: user?.email || '', password: '', confirmPassword: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyReviews();
    fetchProfileData();
  }, [user, navigate]);

  const fetchProfileData = async () => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data && !error) {
      setProfileData(data);
      setFormData({
        username: data.username || '',
        bio: data.bio || '',
        developer_name: data.developer_name || '',
        website_url: data.website_url || ''
      });
    }
  };

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

  // 2. PASTE THIS FUNCTION INSIDE YOUR COMPONENT
  const handleAvatarUpload = async (event) => {
    try {
      // Get the image the user just selected from their computer
      const file = event.target.files[0];
      if (!file) return;

      // Make a unique name for the new file so it doesn't overwrite anything accidentally
      const newFilePath = `avatars/${user.id}/${Date.now()}-${file.name}`;

      // --- THE DELETION STEP ---
      // If the user already has a picture saved in the database, delete it from the bucket first!
      if (profileData?.avatar_url) {
        const oldFilePath = getFilePathFromUrl(profileData.avatar_url, 'icons');
        
        if (oldFilePath) {
          // Tell Supabase: "Go into the 'icons' bucket and delete this specific file"
          await supabase.storage.from('icons').remove([oldFilePath]);
          console.log("Old picture successfully deleted from storage!");
        }
      }

      // --- THE UPLOAD STEP ---
      // Now upload the brand new image to the bucket
      const { error: uploadError } = await supabase.storage
        .from('icons')
        .upload(newFilePath, file);

      if (uploadError) throw uploadError;

      // Get the public web link for the new image we just uploaded
      const { data: { publicUrl } } = supabase.storage.from('icons').getPublicUrl(newFilePath);

      // --- THE DATABASE STEP ---
      // Finally, update the database to point to the new image link
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (dbError) throw dbError;

      setProfileData(prev => ({ ...prev, avatar_url: publicUrl }));
      alert("Profile picture updated securely!");
      
    } catch (error) {
      console.error("Error updating avatar:", error.message);
      alert("Failed to update picture.");
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;
    
    try {
      if (profileData?.avatar_url) {
        const oldFilePath = getFilePathFromUrl(profileData.avatar_url, 'icons');
        
        if (oldFilePath) {
          await supabase.storage.from('icons').remove([oldFilePath]);
        }

        const { error: dbError } = await supabase
          .from('profiles')
          .update({ avatar_url: null })
          .eq('id', user.id);

        if (dbError) throw dbError;

        setProfileData(prev => ({ ...prev, avatar_url: null }));
        alert("Profile picture removed successfully!");
      }
    } catch (error) {
      console.error("Error removing avatar:", error.message);
      alert("Failed to remove picture.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const payload = { ...formData };
      const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);
      
      if (error) throw error;
      setProfileData({ ...profileData, ...payload });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
    setIsUploading(false);
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      if (accountData.password && accountData.password !== accountData.confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      
      const updates = {};
      if (accountData.email !== user.email) updates.email = accountData.email;
      if (accountData.password) updates.password = accountData.password;

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      
      alert("Account credentials updated! If you changed your email, check your inbox to confirm.");
      setAccountData({ ...accountData, password: '', confirmPassword: '' });
    } catch (err) {
      alert("Error: " + err.message);
    }
    setIsUploading(false);
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
            fontWeight: 'bold',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            {profileData?.avatar_url ? (
              <img src={profileData.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '2rem' }}>{(profileData?.username || user.email).charAt(0).toUpperCase()}</span>
            )}
          </div>
          
          <div style={{ minWidth: 0 }}>
            <h1 className="break-all text-white" style={{ margin: 0, fontSize: '1.5rem' }}>
              {profileData?.username || 'No Username Set'}
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user.email}</p>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
              Account Type: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{role}</span>
            </p>
            {role === 'Pending Developer' && (
              <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', backgroundColor: 'color-mix(in srgb, var(--warning) 15%, transparent)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius)', fontSize: '0.875rem', fontWeight: '500' }}>
                ⏳ Your developer account is currently pending Admin approval.
              </div>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>📅 Joined: {new Date(user.created_at).toLocaleDateString()}</span>
              <span>⭐ Reviews: {reviews.length}</span>
            </div>
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

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
        
        {/* Sidebar Navigation */}
        <aside className="card" style={{ flex: '1 1 250px', position: 'sticky', top: 'var(--space-4)' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <button onClick={() => setActiveTab('reviews')} className={`btn ${activeTab === 'reviews' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }}>My Reviews</button>
            <button onClick={() => setActiveTab('profile')} className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }}>Edit Profile</button>
            <button onClick={() => setActiveTab('account')} className={`btn ${activeTab === 'account' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }}>Account Settings</button>
          </nav>
        </aside>

        {/* Tab Content */}
        <section className="card" style={{ flex: '3 1 500px', minHeight: '50vh' }}>
          
          {/* TAB: REVIEWS */}
          {activeTab === 'reviews' && (
            <div>
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
            </div>
          )}

          {/* TAB: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ marginBottom: 'var(--space-6)' }}>Public Profile</h2>
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '600px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#ffffff' }}>Username</label>
                  <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} placeholder="Your display name" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#ffffff' }}>Bio / About Me</label>
                  <textarea rows="3" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Tell the community about yourself"></textarea>
                </div>

                <div className="mt-4">
                  <label className="block text-gray-400 mb-2">Upload Profile Picture</label>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarUpload} 
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                      style={{ flex: 1, minWidth: '200px' }}
                    />
                    {profileData?.avatar_url && (
                      <button 
                        type="button" 
                        onClick={handleRemoveAvatar}
                        className="btn" 
                        style={{ backgroundColor: 'color-mix(in srgb, var(--error) 15%, transparent)', color: '#ffffff', borderRadius: '9999px', padding: '0.45rem 1.25rem', border: 'none', fontWeight: '600' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {profileData?.avatar_url && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Uploading a new image will instantly replace your current one.</p>}
                </div>

                {(role === 'Developer' || role === 'Admin') && (
                  <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1.1rem' }}>Developer Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 'var(--space-4)' }}>
                      <label style={{ color: '#ffffff' }}>Developer / Studio Name</label>
                      <input type="text" value={formData.developer_name} onChange={(e) => setFormData({...formData, developer_name: e.target.value})} placeholder="e.g. Nitro Games" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ color: '#ffffff' }}>Website URL</label>
                      <input type="url" value={formData.website_url} onChange={(e) => setFormData({...formData, website_url: e.target.value})} placeholder="https://..." />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={isUploading} className="btn btn-primary" style={{ padding: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                  {isUploading ? 'Saving changes...' : 'Save Profile'}
                </button>
              </form>
            </div>
          )}

          {/* TAB: ACCOUNT SETTINGS */}
          {activeTab === 'account' && (
            <div>
              <h2 style={{ marginBottom: 'var(--space-6)' }}>Account Settings</h2>
              <form onSubmit={handleUpdateAccount} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '600px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ color: '#ffffff' }}>Email Address</label>
                  <input type="email" required value={accountData.email} onChange={(e) => setAccountData({...accountData, email: e.target.value})} />
                </div>

                <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
                  <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1.1rem' }}>Change Password</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 'var(--space-4)' }}>
                    <label style={{ color: '#ffffff' }}>New Password (leave blank to keep current)</label>
                    <input type="password" value={accountData.password} onChange={(e) => setAccountData({...accountData, password: e.target.value})} placeholder="••••••••" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ color: '#ffffff' }}>Confirm New Password</label>
                    <input type="password" value={accountData.confirmPassword} onChange={(e) => setAccountData({...accountData, confirmPassword: e.target.value})} placeholder="••••••••" />
                  </div>
                </div>

                <button type="submit" disabled={isUploading} className="btn btn-secondary" style={{ padding: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                  {isUploading ? 'Updating...' : 'Update Account Credentials'}
                </button>
              </form>
            </div>
          )}

        </section>
      </div>
    </main>
  );
};

export default Profile;