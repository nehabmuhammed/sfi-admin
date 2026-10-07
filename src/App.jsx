import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
export default App;