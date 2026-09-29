import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import ChangePassword from './pages/ChangePassword';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />; // or some unauthorized page
  }
  
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  switch (user.role) {
    case 'SYSTEM_ADMIN': return <Navigate to="/admin" />;
    case 'STORE_OWNER': return <Navigate to="/store-owner" />;
    case 'NORMAL_USER': return <Navigate to="/user" />;
    default: return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<DashboardRedirect />} />
            
            <Route path="/admin" element={
              <ProtectedRoute roles={['SYSTEM_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/user" element={
              <ProtectedRoute roles={['NORMAL_USER']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/store-owner" element={
              <ProtectedRoute roles={['STORE_OWNER']}>
                <StoreOwnerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
