import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else {
        setError(err.response?.data?.error || 'Signup failed');
      }
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-[radial-gradient(circle_at_top_right,_#1E1B4B,_#0F172A)]">
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        {error && <div className="text-red-400 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm text-slate-400">Full Name</label>
            <input name="name" type="text" className="w-full p-3 bg-slate-900/60 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" value={formData.name} onChange={handleChange} required minLength="20" maxLength="60" placeholder="Minimum 20 characters" />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm text-slate-400">Email Address</label>
            <input name="email" type="email" className="w-full p-3 bg-slate-900/60 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm text-slate-400">Address</label>
            <input name="address" type="text" className="w-full p-3 bg-slate-900/60 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" value={formData.address} onChange={handleChange} required maxLength="400" />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm text-slate-400">Password</label>
            <input name="password" type="password" className="w-full p-3 bg-slate-900/60 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" value={formData.password} onChange={handleChange} required minLength="8" maxLength="16" placeholder="1 uppercase, 1 special char" />
          </div>
          <button type="submit" className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium rounded-lg transition shadow-md hover:shadow-lg hover:-translate-y-0.5">Sign Up</button>
        </form>
        <p className="mt-6 text-center text-slate-400">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
