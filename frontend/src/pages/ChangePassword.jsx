import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/change-password', { newPassword });
      setMessage(res.data.message);
      setError('');
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Failed to update password');
      setMessage('');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-lg max-w-md mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>
        {message && <div className="text-emerald-400 mb-4">{message}</div>}
        {error && <div className="text-red-400 mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm text-slate-400">New Password</label>
            <input 
              type="password" 
              className="w-full p-3 bg-slate-900/60 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required 
              minLength="8" 
              maxLength="16" 
              placeholder="1 uppercase, 1 special char (e.g. Pass@123)"
            />
          </div>
          <button type="submit" className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium rounded-lg transition shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Update Password
          </button>
          <button type="button" className="w-full mt-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 font-medium rounded-lg transition" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
