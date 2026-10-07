import { useState, useEffect } from 'react';
import api from '../services/api';

const statConfig = [
  { key: 'announcements', label: 'Announcements', icon: '📢', variant: '' },
  { key: 'programmes',    label: 'Programmes',    icon: '🎓', variant: '' },
  { key: 'excom',         label: 'ExCom Members', icon: '👥', variant: '' },
  { key: 'gallery',       label: 'Gallery Items',  icon: '🖼️', variant: '' },
  { key: 'newComplaints',      label: 'New Complaints',      icon: '🔔', variant: 'stat-card--warning' },
  { key: 'resolvedComplaints', label: 'Resolved Complaints', icon: '✅', variant: 'stat-card--success' },
];

export default function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard/stats')
      .then(res => setStats(res.data.data))
      .catch(() => setError('Failed to load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Real-time overview of your union website</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <span className="loading-spinner"></span> Loading stats...
        </div>
      ) : (
        <div className="dashboard-grid">
          {statConfig.map(({ key, label, icon, variant }) => (
            <div key={key} className={`stat-card ${variant}`}>
              <span className="stat-card-icon">{icon}</span>
              <div className="stat-card-value">{stats?.[key] ?? '—'}</div>
              <div className="stat-card-title">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          👋 Welcome to the <strong style={{ color: 'var(--text-primary)' }}>IGC Union Admin Panel</strong>. 
          Use the sidebar to manage announcements, programmes, executive committee members, gallery, and student complaints.
          All changes are immediately reflected on the public website.
        </p>
      </div>
    </div>
  );
}