import { useState, useEffect } from 'react';
import api from '../services/api';

const emptyForm = { image: '', caption: '', order: 0, isActive: true };

export default function Gallery() {
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
      const res = await api.get('/gallery');
      if (res.data.success) setData(res.data.data);
    } catch { showAlert('error', 'Failed to load gallery.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form._id) {
        await api.put(`/gallery/${form._id}`, form);
        showAlert('success', 'Gallery item updated.');
      } else {
        await api.post('/gallery', form);
        showAlert('success', 'Gallery item added.');
      }
      setForm(null);
      loadData();
    } catch { showAlert('error', 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      showAlert('success', 'Deleted.');
      loadData();
    } catch { showAlert('error', 'Failed to delete.'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gallery</h1>
          <p className="page-subtitle">{data.length} photo{data.length !== 1 ? 's' : ''}</p>
        </div>
        <button id="gallery-add-btn" className="btn btn-primary" onClick={() => setForm({ ...emptyForm })}>
          + Add Photo
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
            {form._id ? '✏️ Edit Photo' : '➕ Add Gallery Photo'}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="gallery-image">Image URL / Path</label>
              <input id="gallery-image" className="form-input" required type="text"
                placeholder="/images/gallery-photo.jpg or https://..."
                value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>
            {form.image && (
              <div style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
                <img src={form.image} alt="preview" className="img-preview-lg"
                  style={{ maxHeight: '160px' }}
                  onError={e => e.target.style.display = 'none'} />
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="gallery-caption">Caption</label>
                <input id="gallery-caption" className="form-input" required type="text"
                  placeholder="Brief description of the photo"
                  value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="gallery-order">Display Order</label>
                <input id="gallery-order" className="form-input" required type="number" min="0"
                  value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="form-group">
              <div className="form-checkbox-group">
                <input id="gallery-active" type="checkbox" checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                <label htmlFor="gallery-active" className="form-label" style={{ margin: 0 }}>
                  Visible on public gallery
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" id="gallery-save" className="btn btn-primary" disabled={saving}>
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
            <div className="empty-state-icon">🖼️</div>
            <div className="empty-state-title">Gallery is Empty</div>
            <div className="empty-state-text">Click "Add Photo" to add your first gallery image.</div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Caption</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item._id}>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt={item.caption}
                        className="img-preview"
                        onError={e => e.target.style.display = 'none'} />
                    ) : (
                      <div className="img-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🖼️</div>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-primary)' }}>{item.caption}</td>
                  <td style={{ color: 'var(--text-muted)' }}>#{item.order}</td>
                  <td>
                    <span className={`badge ${item.isActive ? 'badge-success' : 'badge-neutral'}`}>
                      {item.isActive ? '● Active' : '○ Hidden'}
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