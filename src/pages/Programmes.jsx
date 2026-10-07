import { useState, useEffect } from 'react';
import api from '../services/api';

const emptyForm = {
  title: '', description: '', date: '', month: '',
  venue: '', time: '', image: '', isUpcoming: true
};

export default function Programmes() {
  const [data, setData]       = useState([]);
  const [form, setForm]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [alert, setAlert]     = useState(null);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/programmes');
      if (res.data.success) setData(res.data.data);
    } catch { showAlert('error', 'Failed to load programmes.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form._id) {
        await api.put(`/programmes/${form._id}`, form);
        showAlert('success', 'Programme updated.');
      } else {
        await api.post('/programmes', form);
        showAlert('success', 'Programme created.');
      }
      setForm(null);
      loadData();
    } catch { showAlert('error', 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this programme?')) return;
    try {
      await api.delete(`/programmes/${id}`);
      showAlert('success', 'Deleted.');
      loadData();
    } catch { showAlert('error', 'Failed to delete.'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Programmes</h1>
          <p className="page-subtitle">{data.length} programme{data.length !== 1 ? 's' : ''} total</p>
        </div>
        <button id="programme-add-btn" className="btn btn-primary" onClick={() => setForm({ ...emptyForm })}>
          + Add Programme
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type === 'success' ? 'success' : 'error'}`}>
          {alert.msg}
        </div>
      )}

      {form && (
        <div className="form-card">
          <div className="form-card-title">
            {form._id ? '✏️ Edit Programme' : '➕ New Programme'}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="prog-title">Title</label>
                <input id="prog-title" className="form-input" required type="text"
                  placeholder="e.g. Annual Fest 2025"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="prog-venue">Venue</label>
                <input id="prog-venue" className="form-input" required type="text"
                  placeholder="e.g. Main Hall"
                  value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prog-desc">Description</label>
              <textarea id="prog-desc" className="form-textarea" required
                placeholder="Programme description..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="prog-date">Date (Day)</label>
                <input id="prog-date" className="form-input" required type="text"
                  placeholder="e.g. 15"
                  value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="prog-month">Month</label>
                <input id="prog-month" className="form-input" required type="text"
                  placeholder="e.g. March"
                  value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="prog-time">Time</label>
                <input id="prog-time" className="form-input" required type="text"
                  placeholder="e.g. 10:00 AM"
                  value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prog-image">Image URL / Path</label>
              <input id="prog-image" className="form-input" type="text"
                placeholder="/images/programme.jpg"
                value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="form-group">
              <div className="form-checkbox-group">
                <input id="prog-upcoming" type="checkbox" checked={form.isUpcoming}
                  onChange={e => setForm({ ...form, isUpcoming: e.target.checked })} />
                <label htmlFor="prog-upcoming" className="form-label" style={{ margin: 0 }}>
                  Mark as upcoming
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" id="prog-save" className="btn btn-primary" disabled={saving}>
                {saving ? <><span className="loading-spinner" style={{width:'14px',height:'14px'}}></span> Saving...</> : '💾 Save'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-state"><span className="loading-spinner"></span> Loading...</div>
      ) : data.length === 0 ? (
        <div className="table-container">
          <div className="empty-state">
            <div className="empty-state-icon">🎓</div>
            <div className="empty-state-title">No Programmes Yet</div>
            <div className="empty-state-text">Click "Add Programme" to get started.</div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</td>
                  <td>{item.date} {item.month}</td>
                  <td>{item.venue}</td>
                  <td>{item.time}</td>
                  <td>
                    <span className={`badge ${item.isUpcoming ? 'badge-info' : 'badge-neutral'}`}>
                      {item.isUpcoming ? '🔜 Upcoming' : '✓ Past'}
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