import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import useAuthStore from '../../store/authStore';
import Spinner from '../../components/Spinner';

const typeColors = {
  APK: 'badge-green',
  Website: 'badge-blue',
  'APK + Website': 'badge-orange',
};

const AppDetails = () => {
  const { id } = useParams();
  const { user } = useAuthStore();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchAppDetails();
    fetchReviews();
  }, [id]);

  const fetchAppDetails = async () => {
    setLoading(true);
    // Increment the view counter FIRST
    await supabase.rpc('increment_view_count', { row_id: id });
    // Then fetch the newly updated data so the UI is perfectly in sync
    const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
    if (!error && data) setApp(data);
    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews').select('*').eq('listing_id', id).order('created_at', { ascending: false });
    if (!error && data) setReviews(data);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('You must be logged in to leave a review.');
    setSubmittingReview(true);
    const { error } = await supabase.from('reviews').insert([{
      listing_id: id, user_id: user.id, user_email: user.email, rating, comment,
    }]);
    if (!error) { setComment(''); setRating(5); fetchReviews(); }
    else alert(error.message);
    setSubmittingReview(false);
  };

  const handleDeleteReview = async (reviewId) => {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId).eq('user_id', user.id);
    if (!error) fetchReviews();
  };

  const handleDownload = async () => {
    await supabase.rpc('increment_download_count', { row_id: id });
    // Instantly update the UI so the user sees their download register
    setApp(prev => ({ ...prev, downloads: (prev.downloads || 0) + 1 }));
    window.open(app.apk_url, '_blank');
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return (
    <div className="loading-container">
      <Spinner className="w-10 h-10" />
      <span className="loading-text">Loading app details...</span>
    </div>
  );

  if (!app) return (
    <div className="empty-state" style={{ marginTop: '4rem' }}>
      <div className="empty-state-icon">❌</div>
      <p className="empty-state-title">App not found</p>
      <p className="empty-state-desc">This listing may have been removed or doesn't exist.</p>
      <Link to="/apps" className="btn btn-primary">Back to Directory</Link>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Back */}
      <div>
        <Link to="/apps" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          ← Back to Directory
        </Link>
      </div>

      {/* App Header */}
      <div className="page-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Icon */}
            <div style={{
              width: '7rem', height: '7rem', flexShrink: 0,
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border-bright)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', fontSize: '3rem',
            }}>
              {app.icon_url
                ? <img src={app.icon_url} alt={app.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '📱'}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: 0, color: '#ffffff' }}>{app.title}</h1>
                <span className={`badge ${typeColors[app.type] || 'badge-gray'}`}>{app.type}</span>
              </div>

              {app.category && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', margin: '0 0 0.5rem' }}>
                  {app.category}
                </p>
              )}

              {avgRating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span className="stars">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {avgRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0 0 1.25rem', lineHeight: 1.7, maxWidth: '600px' }}>
                {app.description || 'No description provided.'}
              </p>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Downloads', value: app.downloads || 0, icon: '⬇' },
                  { label: 'Views', value: app.views || 0, icon: '👁' },
                ].map(({ label, value, icon }) => (
                  <div key={label}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', margin: '0 0 0.2rem' }}>
                      {icon} {label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                      {value.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {(app.type === 'APK' || app.type === 'APK + Website') && app.apk_url && (
                  <button onClick={handleDownload} className="btn btn-primary">
                    ⬇ Download APK
                  </button>
                )}
                {(app.type === 'Website' || app.type === 'APK + Website') && app.website_url && (
                  <a href={app.website_url} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    🌐 Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      {app.screenshots && app.screenshots.length > 0 && (
        <div className="card">
          <div className="section-header">
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Screenshots</h2>
          </div>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {app.screenshots.map((img, i) => (
              <img key={i} src={img} alt={`Screenshot ${i + 1}`} className="screenshot-img" />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>
            User Reviews {reviews.length > 0 && <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: '0.85rem' }}>({reviews.length})</span>}
          </h2>
        </div>

        {/* Write review */}
        {user ? (
          <form onSubmit={handleReviewSubmit} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
              Write a Review
            </h3>

            <div className="form-group">
              <label className="form-label" style={{ color: '#ffffff' }}>Rating</label>
              <select
                className="form-input"
                style={{ width: '10rem' }}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} Stars {'★'.repeat(n)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#ffffff' }}>Your Review</label>
              <textarea
                required
                rows={3}
                className="form-input"
                placeholder="Share your experience with this app..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div>
              <button type="submit" disabled={submittingReview} className="btn btn-primary" style={{ opacity: submittingReview ? 0.6 : 1 }}>
                {submittingReview ? (
                  <><Spinner className="w-4 h-4" /> Posting...</>
                ) : 'Post Review'}
              </button>
            </div>
          </form>
        ) : (
          <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in</Link>
            <span> &nbsp;to leave a review.</span>
          </div>
        )}

        {/* Review list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {reviews.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem', border: 'none', backgroundColor: 'var(--surface-2)' }}>
              <p className="empty-state-title" style={{ fontSize: '0.95rem' }}>No reviews yet</p>
              <p className="empty-state-desc" style={{ marginBottom: 0 }}>Be the first to post one above.</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.875rem', margin: '0 0 0.2rem' }}>
                      {rev.user_email.split('@')[0]}
                    </p>
                    <span className="stars-sm">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                  </div>
                  {user && user.id === rev.user_id && (
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, marginTop: '0.5rem', lineHeight: 1.6 }}>{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppDetails;