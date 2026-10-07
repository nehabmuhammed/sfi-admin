import fs from 'fs';
import path from 'path';

const dirs = [
  'src/components',
  'src/layouts',
  'src/pages',
  'src/services',
  'src/context'
];

dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

// .env
fs.writeFileSync('.env', `VITE_API_URL=http://localhost:5000/api\n`);

// vite.config.js
fs.writeFileSync('vite.config.js', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  }
})
`);

// index.css
fs.writeFileSync('src/index.css', `
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --bg-color: #f3f4f6;
  --sidebar-bg: #1f2937;
  --sidebar-hover: #374151;
  --text-dark: #111827;
  --text-light: #f9fafb;
  --text-muted: #6b7280;
  --white: #ffffff;
  --danger: #ef4444;
  --success: #10b981;
  --warning: #f59e0b;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-dark); }

/* Layout */
.admin-layout { display: flex; min-height: 100vh; }
.sidebar { width: 250px; background-color: var(--sidebar-bg); color: var(--text-light); display: flex; flex-direction: column; }
.sidebar-header { padding: 1.5rem; font-size: 1.25rem; font-weight: bold; border-bottom: 1px solid var(--sidebar-hover); }
.sidebar-nav { flex: 1; padding: 1rem 0; }
.sidebar-link { display: block; padding: 0.75rem 1.5rem; color: var(--text-light); text-decoration: none; transition: background 0.2s; }
.sidebar-link:hover, .sidebar-link.active { background-color: var(--sidebar-hover); }
.sidebar-footer { padding: 1rem; border-top: 1px solid var(--sidebar-hover); }

.main-content { flex: 1; display: flex; flex-direction: column; }
.topbar { background-color: var(--white); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.content-area { padding: 2rem; flex: 1; overflow-y: auto; }

/* Login */
.login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: var(--bg-color); }
.login-card { background: var(--white); padding: 2.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
.login-title { font-size: 1.5rem; margin-bottom: 1.5rem; text-align: center; }
.form-group { margin-bottom: 1rem; }
.form-label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
.form-input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; }
.btn { display: inline-block; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; text-align: center; }
.btn-primary { background-color: var(--primary-color); color: var(--white); width: 100%; }
.btn-primary:hover { background-color: var(--secondary-color); }
.btn-danger { background-color: var(--danger); color: var(--white); }
.btn-sm { padding: 0.25rem 0.5rem; font-size: 0.875rem; }

/* Dashboard Cards */
.dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.stat-card { background: var(--white); padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.stat-card-title { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.stat-card-value { font-size: 2rem; font-weight: bold; }

/* Tables */
.table-container { background: var(--white); border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow-x: auto; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th, .admin-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
.admin-table th { background-color: #f9fafb; font-weight: 600; color: var(--text-muted); }

/* Badges */
.badge { padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
.badge-success { background-color: #d1fae5; color: #065f46; }
.badge-danger { background-color: #fee2e2; color: #991b1b; }
.badge-warning { background-color: #fef3c7; color: #92400e; }

/* Modals/Forms */
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.form-card { background: var(--white); padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 1.5rem; }
`);

// main.jsx
fs.writeFileSync('src/main.jsx', `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`);

// App.jsx
fs.writeFileSync('src/App.jsx', `import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Announcements from './pages/Announcements';
import Programmes from './pages/Programmes';
import Excom from './pages/Excom';
import Gallery from './pages/Gallery';
import Complaints from './pages/Complaints';
import ComplaintDetails from './pages/ComplaintDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="programmes" element={<Programmes />} />
            <Route path="excom" element={<Excom />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;`);

// api.js
fs.writeFileSync('src/services/api.js', `import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(error);
  }
);

export default api;`);

// AuthContext.jsx
fs.writeFileSync('src/context/AuthContext.jsx', `import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    const handleAuthError = () => {
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setUser(res.data.data);
      setIsAuthenticated(true);
    }
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};`);

console.log('Setup basic files complete.');
