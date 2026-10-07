import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const STATUS_COLORS = {
  'New':          'badge-warning',
  'Under Review': 'badge-info',
  'Inspection':   'badge-info',
  'Verified':     'badge-success',
  'Not Verified': 'badge-danger',
  'Action Taken': 'badge-success',
  'Resolved':     'badge-neutral',
};

export default function Complaints() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [alert, setAlert]       = useState(null);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      if (res.data.success) setData(res.data.data);
    } catch { showAlert('error', 'Failed to load complaints.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      showAlert('success', 'Complaint deleted.');
      loadData();
    } catch { showAlert('error', 'Failed to delete.'); }
  };

  const filtered = filterStatus
    ? data.filter(c => c.status === filterStatus)
    : data;

  const newCount = data.filter(c => c.status === 'New').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaints</h1>
          <p className="page-subtitle">
            {data.length} total
            {newCount > 0 && <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>{newCount} new</span>}
          </p>
        </div>
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '160px' }}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {Object.keys(STATUS_COLORS).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
          {alert.msg}
        </div>
      )}

      {loading ? (
        <div className="loading-state"><span className="loading-spinner"></span> Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="table-container">
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <div className="empty-state-title">{filterStatus ? `No "${filterStatus}" complaints` : 'No Complaints Yet'}</div>
            <div className="empty-state-text">Student complaints will appear here.</div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Complainant</th>
                <th>Department</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {item.category}
                  </td>
                  <td>{item.anonymous ? <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Anonymous</span> : (item.name || '—')}</td>
                  <td>{item.department || '—'}</td>
                  <td>
                    <span className={`badge ${STATUS_COLORS[item.status] || 'badge-neutral'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/complaints/${item._id}`} className="btn btn-sm btn-primary">View</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}