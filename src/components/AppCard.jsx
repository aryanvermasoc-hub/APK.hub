import { Link } from 'react-router-dom';

const AppCard = ({ app }) => {
  return (
    <div className="app-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <img 
          src={app.icon_url || "https://ui-avatars.com/api/?name=" + (app.title || app.name) + "&background=1f2937&color=fff"} 
          alt={`${app.title || app.name} logo`} 
          className="w-12 h-12 rounded-lg object-cover bg-gray-800 shrink-0"
        />
        <div style={{ overflow: 'hidden' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: '#ffffff' }}>
            {app.title || app.name}
          </h3>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: '500' }}>{app.type}</span>
        </div>
      </div>
    <p className="line-clamp-3" style={{ fontSize: '0.9rem', flexGrow: 1, margin: 0, color: '#ffffff' }}>
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