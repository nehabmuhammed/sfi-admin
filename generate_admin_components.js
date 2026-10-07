import fs from 'fs';
import path from 'path';

// Sidebar.jsx
fs.writeFileSync('src/components/Sidebar.jsx', `import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout } = useContext(AuthContext);

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Announcements', path: '/announcements' },
    { name: 'Programmes', path: '/programmes' },
    { name: 'ExCom', path: '/excom' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Complaints', path: '/complaints' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">IGC Union Admin</div>
      <nav className="sidebar-nav">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={\`sidebar-link \${pathname.startsWith(link.path) ? 'active' : ''}\`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="btn btn-danger" style={{width: '100%'}} onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}`);

// Topbar.jsx
fs.writeFileSync('src/components/Topbar.jsx', `import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Topbar() {
  const { user } = useContext(AuthContext);
  return (
    <header className="topbar">
      <div></div>
      <div>
        Welcome, <strong>{user?.name || 'Admin'}</strong>
      </div>
    </header>
  );
}`);

// ProtectedRoute.jsx
fs.writeFileSync('src/components/ProtectedRoute.jsx', `import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}`);

// AdminLayout.jsx
fs.writeFileSync('src/layouts/AdminLayout.jsx', `import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}`);

// Login.jsx
fs.writeFileSync('src/pages/Login.jsx', `import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Admin Login</h2>
        {error && <div style={{color:'red', marginBottom:'1rem'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
}`);

// Dashboard.jsx
fs.writeFileSync('src/pages/Dashboard.jsx', `import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard/stats').then(res => setStats(res.data.data)).catch(console.error);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card-title">Announcements</div>
          <div className="stat-card-value">{stats?.announcements || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">Programmes</div>
          <div className="stat-card-value">{stats?.programmes || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">ExCom Members</div>
          <div className="stat-card-value">{stats?.excom || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">Gallery Items</div>
          <div className="stat-card-value">{stats?.gallery || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">New Complaints</div>
          <div className="stat-card-value">{stats?.newComplaints || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">Resolved Complaints</div>
          <div className="stat-card-value">{stats?.resolvedComplaints || 0}</div>
        </div>
      </div>
    </div>
  );
}`);

console.log('Components setup part 1 complete.');
