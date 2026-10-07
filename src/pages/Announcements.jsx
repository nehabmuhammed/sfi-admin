import { useState, useEffect } from 'react';
import api from '../services/api';

const emptyForm = { title: '', description: '', isActive: true };

export default function Announcements() {
  const [data, setData]         = useState([]);
  const [form, setForm]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [alert, setAlert]       = useState(null);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/announcements');
      if (res.data.success) setData(res.data.data);
    } catch { showAlert('error', 'Failed to load announcements.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form._id) {
        await api.put(`/announcements/${form._id}`, form);
        showAlert('success', 'Announcement updated successfully.');
      } else {
        await api.post('/announcements', form);
        showAlert('success', 'Announcement created successfully.');
      }
      setForm(null);
      loadData();
    } catch { showAlert('error', 'Failed to save announcement.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      showAlert('success', 'Deleted successfully.');
      loadData();
    } catch { showAlert('error', 'Failed to delete.'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">{data.length} announcement{data.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          id="announcement-add-btn"
          className="btn btn-primary"
          onClick={() => setForm({ ...emptyForm })}
        >
          + Add Announcement
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
          {alert.msg}
        </div>
      )}

      {/* Form */}
      {form && (
        <div className="form-card">
          <div className="form-card-title">
            {form._id ? '✏️ Edit Announcement' : '➕ New Announcement'}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="ann-title">Title</label>
              <input
                id="ann-title"
                className="form-input"
                required
                type="text"
                placeholder="Announcement title..."
                value={form.title || ''}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ann-desc">Description</label>
              <textarea
                id="ann-desc"
                className="form-textarea"
                required
                placeholder="Announcement description..."
                value={form.description || ''}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <div className="form-checkbox-group">
                <input
                  id="ann-active"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                />
                <label htmlFor="ann-active" className="form-label" style={{ margin: 0 }}>Active (visible on public site)</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" id="ann-save" className="btn btn-primary" disabled={saving}>
                {saving ? <><span className="loading-spinner" style={{width:'14px',height:'14px'}}></span> Saving...</> : '💾 Save'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setForm(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="loading-state"><span className="loading-spinner"></span> Loading...</div>
      ) : data.length === 0 ? (
        <div className="table-container">
          <div className="empty-state">
            <div className="empty-state-icon">📢</div>
            <div className="empty-state-title">No Announcements Yet</div>
            <div className="empty-state-text">Click "Add Announcement" to create your first one.</div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</td>
                  <td style={{ maxWidth: '300px' }} className="truncate">{item.description}</td>
                  <td>
                    <span className={`badge ${item.isActive ? 'badge-success' : 'badge-neutral'}`}>
                      {item.isActive ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-sm btn-secondary" onClick={() => setForm({ ...item })}>Edit</button>
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