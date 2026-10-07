import fs from 'fs';
import path from 'path';

const genPage = (name, endpoint, fields) => `import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ${name}() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(null);
  
  const loadData = async () => {
    const res = await api.get('${endpoint}');
    if (res.data.success) setData(res.data.data);
  };
  
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form._id) {
      await api.put(\`${endpoint}/\${form._id}\`, form);
    } else {
      await api.post('${endpoint}', form);
    }
    setForm(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      await api.delete(\`${endpoint}/\${id}\`);
      loadData();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>${name}</h2>
        <button className="btn btn-primary" onClick={() => setForm({ ${fields.map(f => `'${f.name}': ${f.default}`).join(', ')} })}>Add New</button>
      </div>

      {form && (
        <div className="form-card">
          <h3>{form._id ? 'Edit' : 'Create'}</h3>
          <form onSubmit={handleSubmit}>
            ${fields.map(f => `
            <div className="form-group">
              <label className="form-label">${f.label}</label>
              ${f.type === 'checkbox' 
                ? `<input type="checkbox" checked={form.${f.name}} onChange={e => setForm({...form, ${f.name}: e.target.checked})} />` 
                : `<input className="form-input" required type="${f.type}" value={form.${f.name} || ''} onChange={e => setForm({...form, ${f.name}: e.target.value})} />`
              }
            </div>`).join('')}
            <div style={{display:'flex', gap:'1rem'}}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              ${fields.map(f => `<th>${f.label}</th>`).join('')}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item._id}>
                ${fields.map(f => `<td>{${f.type === 'checkbox' ? `item.${f.name} ? 'Yes' : 'No'` : `item.${f.name}`}}</td>`).join('')}
                <td>
                  <button className="btn btn-sm btn-primary" style={{marginRight: '0.5rem'}} onClick={() => setForm(item)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`;

fs.writeFileSync('src/pages/Announcements.jsx', genPage('Announcements', '/announcements', [
  { name: 'title', label: 'Title', type: 'text', default: "''" },
  { name: 'description', label: 'Description', type: 'text', default: "''" },
  { name: 'isActive', label: 'Active', type: 'checkbox', default: 'true' }
]));

fs.writeFileSync('src/pages/Programmes.jsx', genPage('Programmes', '/programmes', [
  { name: 'title', label: 'Title', type: 'text', default: "''" },
  { name: 'description', label: 'Description', type: 'text', default: "''" },
  { name: 'date', label: 'Date', type: 'text', default: "''" },
  { name: 'month', label: 'Month', type: 'text', default: "''" },
  { name: 'venue', label: 'Venue', type: 'text', default: "''" },
  { name: 'time', label: 'Time', type: 'text', default: "''" },
  { name: 'image', label: 'Image Path', type: 'text', default: "''" },
  { name: 'isUpcoming', label: 'Upcoming', type: 'checkbox', default: 'true' }
]));

fs.writeFileSync('src/pages/Excom.jsx', genPage('Excom', '/excom', [
  { name: 'name', label: 'Name', type: 'text', default: "''" },
  { name: 'role', label: 'Role', type: 'text', default: "''" },
  { name: 'image', label: 'Image Path', type: 'text', default: "''" },
  { name: 'order', label: 'Order', type: 'number', default: '0' },
  { name: 'isActive', label: 'Active', type: 'checkbox', default: 'true' }
]));

fs.writeFileSync('src/pages/Gallery.jsx', genPage('Gallery', '/gallery', [
  { name: 'image', label: 'Image Path', type: 'text', default: "''" },
  { name: 'caption', label: 'Caption', type: 'text', default: "''" },
  { name: 'order', label: 'Order', type: 'number', default: '0' },
  { name: 'isActive', label: 'Active', type: 'checkbox', default: 'true' }
]));

// Complaints list
fs.writeFileSync('src/pages/Complaints.jsx', `import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Complaints() {
  const [data, setData] = useState([]);
  
  const loadData = async () => {
    const res = await api.get('/complaints');
    if (res.data.success) setData(res.data.data);
  };
  
  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      await api.delete(\`/complaints/\${id}\`);
      loadData();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Complaints</h2>
      </div>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Department</th>
              <th>Name</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item._id}>
                <td>{item.category}</td>
                <td>{item.department || '-'}</td>
                <td>{item.anonymous ? 'Anonymous' : (item.name || '-')}</td>
                <td><span className="badge">{item.status}</span></td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={\`/complaints/\${item._id}\`} className="btn btn-sm btn-primary" style={{marginRight: '0.5rem'}}>View</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`);

// Complaint Details
fs.writeFileSync('src/pages/ComplaintDetails.jsx', `import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    api.get(\`/complaints/\${id}\`).then(res => setComplaint(res.data.data)).catch(console.error);
  }, [id]);

  const updateStatus = async (status) => {
    await api.put(\`/complaints/\${id}\`, { status });
    setComplaint({ ...complaint, status });
  };

  if (!complaint) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Complaint Details</h2>
        <button className="btn" onClick={() => navigate('/complaints')}>Back</button>
      </div>
      <div className="form-card">
        <div style={{marginBottom:'1rem'}}><strong>Category:</strong> {complaint.category}</div>
        <div style={{marginBottom:'1rem'}}><strong>Department:</strong> {complaint.department || '-'}</div>
        <div style={{marginBottom:'1rem'}}><strong>Name:</strong> {complaint.anonymous ? 'Anonymous' : (complaint.name || '-')}</div>
        <div style={{marginBottom:'1rem'}}><strong>WhatsApp:</strong> {complaint.anonymous ? '-' : (complaint.whatsapp || '-')}</div>
        <div style={{marginBottom:'1rem'}}><strong>Date:</strong> {new Date(complaint.createdAt).toLocaleString()}</div>
        <div style={{marginBottom:'1rem'}}><strong>Complaint:</strong> <p style={{marginTop:'0.5rem', padding:'1rem', background:'#f9fafb', borderRadius:'4px'}}>{complaint.complaint}</p></div>
        
        <div style={{marginTop:'2rem'}}>
          <strong>Status:</strong>
          <select 
            className="form-input" 
            style={{width:'auto', marginLeft:'1rem'}} 
            value={complaint.status} 
            onChange={e => updateStatus(e.target.value)}
          >
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Inspection">Inspection</option>
            <option value="Verified">Verified</option>
            <option value="Not Verified">Not Verified</option>
            <option value="Action Taken">Action Taken</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>
    </div>
  );
}`);

console.log('Pages setup complete.');
