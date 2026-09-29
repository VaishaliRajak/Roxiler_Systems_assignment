import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Store } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="flex items-center justify-between p-4 px-8 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-xl font-bold">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <Store size={20} />
        </div>
        RateMyStore
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <User size={18} />
          <span>{user.name} ({user.role.replace('_', ' ')})</span>
        </div>
        <Link to="/change-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition">Change Password</Link>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition font-medium border border-slate-600">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
