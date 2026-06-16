import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import AppCard from '../../components/AppCard';
import Spinner from '../../components/Spinner';

const FILTERS = ['All', 'APK', 'Website', 'APK + Website'];

const Apps = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (!error && data) setApps(data);
    else if (error) console.error('Error fetching apps:', error.message);
    setLoading(false);
  };

  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || app.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', margin: 0 }}>
            APK.hub
          </p>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', margin: 0, color: '#ffffff' }}>App Directory</h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {apps.length} published {apps.length === 1 ? 'listing' : 'listings'} in the garage
          </p>
        </div>

        {/* Search + Filter row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <span style={{
              position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-dim)', fontSize: '0.9rem', pointerEvents: 'none',
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search apps..."
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="btn btn-sm"
                style={{
                  background: filter === f ? 'var(--primary)' : 'var(--surface-2)',
                  color: filter === f ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${filter === f ? 'var(--primary)' : 'var(--border-bright)'}`,
                  boxShadow: filter === f ? 'var(--glow-orange)' : 'none',
                  transition: 'all 0.18s ease',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-container">
          <Spinner className="w-10 h-10" />
          <span className="loading-text">Loading applications...</span>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔎</div>
          <p className="empty-state-title">No results found</p>
          <p className="empty-state-desc">
            {searchTerm
              ? `No apps matching "${searchTerm}" in the ${filter === 'All' ? 'full directory' : filter + ' category'}.`
              : 'No apps available in this category yet.'}
          </p>
          {searchTerm && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { setSearchTerm(''); setFilter('All'); }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Apps;