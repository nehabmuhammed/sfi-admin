import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        gap: '0.75rem',
        color: 'var(--text-muted)',
        fontSize: '0.875rem'
      }}>
        <span className="loading-spinner"></span> Authenticating...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}