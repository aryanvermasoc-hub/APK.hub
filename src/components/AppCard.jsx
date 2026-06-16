import { Link } from 'react-router-dom';

const AppCard = ({ app }) => {
  return (
    <div className="app-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div className="app-icon-wrapper" style={{ margin: 0, width: '3.5rem', height: '3.5rem', flexShrink: 0 }}>
          {app.icon_url ? (
            <img 
              src={app.icon_url} 
              alt={app.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} 
            />
          ) : (
            '📱'
          )}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: '#ffffff' }}>
            {app.title || app.name}
          </h3>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: '500' }}>{app.type}</span>
        </div>
      </div>
      <p style={{ fontSize: '0.9rem', flexGrow: 1, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#ffffff' }}>
        {app.description || app.desc}
      </p>
      <div style={{ marginTop: '1.25rem' }}>
        <Link to={`/apps/${app.id || app._id}`} className="btn btn-secondary" style={{ width: '100%' }}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default AppCard;