import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const STATUSES = [
  'New', 'Under Review', 'Inspection', 'Verified',
  'Not Verified', 'Action Taken', 'Resolved'
];

const STATUS_COLORS = {
  'New':          'badge-warning',
  'Under Review': 'badge-info',
  'Inspection':   'badge-info',
  'Verified':     'badge-success',
  'Not Verified': 'badge-danger',
  'Action Taken': 'badge-success',
  'Resolved':     'badge-neutral',
};

export default function ComplaintDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [alert, setAlert]         = useState(null);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  useEffect(() => {
    api.get(`/complaints/${id}`)
      .then(res => setComplaint(res.data.data))
      .catch(() => showAlert('error', 'Failed to load complaint.'));
  }, [id]);

  const updateStatus = async (status) => {
    setSaving(true);
    try {
      await api.put(`/complaints/${id}`, { status });
      setComplaint(prev => ({ ...prev, status }));
      showAlert('success', `Status updated to "${status}".`);
    } catch { showAlert('error', 'Failed to update status.'); }
    finally { setSaving(false); }
  };

  if (!complaint) return (
    <div className="loading-state">
      <span className="loading-spinner"></span> Loading complaint...
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaint Details</h1>
          <p className="page-subtitle">Submitted {new Date(complaint.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/complaints')}>
          ← Back to Complaints
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
          {alert.msg}
        </div>
      )}

      {/* Status Section */}
      <div className="card" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div>
          <div className="detail-label">Current Status</div>
          <span className={`badge ${STATUS_COLORS[complaint.status] || 'badge-neutral'}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
            {complaint.status}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div className="detail-label">Update Status</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            {STATUSES.map(s => (
              <button
                key={s}
                className={`btn btn-xs ${complaint.status === s ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => updateStatus(s)}
                disabled={saving || complaint.status === s}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="detail-card">
        <div className="detail-grid" style={{ marginBottom: '1.5rem' }}>
          <div>
            <div className="detail-label">Category</div>
            <div className="detail-value" style={{ textTransform: 'capitalize', fontWeight: 600 }}>
              {complaint.category}
            </div>
          </div>
          <div>
            <div className="detail-label">Department</div>
            <div className="detail-value">{complaint.department || '—'}</div>
          </div>
          <div>
            <div className="detail-label">Complainant</div>
            <div className="detail-value">
              {complaint.anonymous
                ? <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Anonymous</span>
                : (complaint.name || '—')}
            </div>
          </div>
          <div>
            <div className="detail-label">WhatsApp</div>
            <div className="detail-value">
              {complaint.anonymous ? '—' : (
                complaint.whatsapp
                  ? <a href={`https://wa.me/${complaint.whatsapp}`} target="_blank" rel="noreferrer"
                       style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>
                      {complaint.whatsapp}
                    </a>
                  : '—'
              )}
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div>
          <div className="detail-label">Complaint</div>
          <div className="detail-value" style={{
            background: 'var(--bg-base)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginTop: '0.5rem',
            border: '1px solid var(--border-subtle)',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap'
          }}>
            {complaint.complaint}
          </div>
        </div>
      </div>
    </div>
  );
}