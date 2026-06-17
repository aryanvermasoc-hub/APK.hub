import { Link } from 'react-router-dom';

const typeColors = {
  'APK': 'badge-green',
  'Website': 'badge-blue',
  'APK + Website': 'badge-orange',
};

const AppCard = ({ app }) => {
  return (
    <div className="app-card group">
      {/* Icon */}
      <div className="flex justify-center mt-2 mb-2">
        <img 
          src={app.icon_url || "https://ui-avatars.com/api/?name=" + app.title + "&background=1f2937&color=fff"} 
          alt={`${app.title} logo`} 
          className="w-12 h-12 rounded-lg object-cover bg-gray-800 shrink-0"
        />
      </div>

      {/* Title & badge */}
      <h3 className="text-center truncate px-2 mb-1" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--text)',
        margin: 0,
      }}>
        {app.title || 'Untitled App'}
      </h3>

      <div className="flex justify-center mb-4 mt-1">
        <span className={`badge ${typeColors[app.type] || 'badge-gray'}`}>
          {app.type}
        </span>
      </div>

      {app.category && (
        <p className="text-center mb-2" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-dim)',
          margin: '0 0 0.5rem',
        }}>
          {app.category}
        </p>
      )}

      <div className="flex justify-center gap-3 mb-3">
        <span className="text-xs text-gray-500 font-mono">👁 {app.views || 0}</span>
        <span className="text-xs text-gray-500 font-mono">⬇ {app.downloads || 0}</span>
      </div>

      {/* CTA */}
      <div className="mt-auto">
        <Link
          to={`/apps/${app.id}`}
          className="btn btn-secondary w-full"
          style={{ width: '100%' }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default AppCard;