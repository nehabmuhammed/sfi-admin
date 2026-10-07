import { useState, useEffect } from 'react';
import api from '../services/api';

const emptyForm = { name: '', role: '', image: '', order: 0, isActive: true };

export default function Excom() {
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
      const res = await api.get('/excom');
      if (res.data.success) setData(res.data.data);
    } catch { showAlert('error', 'Failed to load ExCom members.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form._id) {
        await api.put(`/excom/${form._id}`, form);
        showAlert('success', 'ExCom member updated.');
      } else {
        await api.post('/excom', form);
        showAlert('success', 'ExCom member added.');
      }
      setForm(null);
      loadData();
    } catch { showAlert('error', 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this ExCom member?')) return;
    try {
      await api.delete(`/excom/${id}`);
      showAlert('success', 'Removed successfully.');
      loadData();
    } catch { showAlert('error', 'Failed to delete.'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Committee</h1>
          <p className="page-subtitle">{data.length} member{data.length !== 1 ? 's' : ''}</p>
        </div>
        <button id="excom-add-btn" className="btn btn-primary" onClick={() => setForm({ ...emptyForm })}>
          + Add Member
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
            {form._id ? '✏️ Edit Member' : '➕ Add ExCom Member'}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="excom-name">Full Name</label>
                <input id="excom-name" className="form-input" required type="text"
                  placeholder="e.g. John Doe"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="excom-role">Role / Position</label>
                <input id="excom-role" className="form-input" required type="text"
                  placeholder="e.g. President"
                  value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="excom-image">Photo URL / Path</label>
              <input id="excom-image" className="form-input" type="text"
                placeholder="/images/member.jpg"
                value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="excom-order">Display Order</label>
                <input id="excom-order" className="form-input" required type="number" min="0"
                  value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <div className="form-checkbox-group" style={{ paddingBottom: '0.1rem' }}>
                  <input id="excom-active" type="checkbox" checked={form.isActive}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                  <label htmlFor="excom-active" className="form-label" style={{ margin: 0 }}>
                    Active (visible on site)
                  </label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" id="excom-save" className="btn btn-primary" disabled={saving}>
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
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-title">No ExCom Members Yet</div>
            <div className="empty-state-text">Click "Add Member" to get started.</div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item._id}>
                  <td style={{ color: 'var(--text-muted)', width: '60px' }}>#{item.order}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.image && (
                        <img src={item.image} alt={item.name}
                          className="img-preview"
                          style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                          onError={e => e.target.style.display = 'none'} />
                      )}
                      {item.name}
                    </div>
                  </td>
                  <td>{item.role}</td>
                  <td>
                    <span className={`badge ${item.isActive ? 'badge-success' : 'badge-neutral'}`}>
                      {item.isActive ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-sm btn-secondary" onClick={() => setForm({ ...item })}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>Remove</button>
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