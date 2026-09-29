import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Store, Star, Plus, X } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const statsRes = await axios.get('http://localhost:5000/api/users/dashboard');
      setStats(statsRes.data);

      const usersRes = await axios.get('http://localhost:5000/api/users');
      setUsers(usersRes.data);

      const storesRes = await axios.get('http://localhost:5000/api/stores');
      setStores(storesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/users', newUser);
      setShowAddUser(false);
      setNewUser({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Failed to add user');
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/stores', { ...newStore, owner_id: parseInt(newStore.owner_id) });
      setShowAddStore(false);
      setNewStore({ name: '', email: '', address: '', owner_id: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Failed to add store');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase()) ||
    (u.address && u.address.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">System Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Users size={32} />
          </div>
          <div>
            <div className="text-slate-400 text-sm font-medium">Total Users</div>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Store size={32} />
          </div>
          <div>
            <div className="text-slate-400 text-sm font-medium">Total Stores</div>
            <div className="text-2xl font-bold">{stats.totalStores}</div>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="p-4 bg-amber-500/10 text-amber-400 rounded-xl">
            <Star size={32} />
          </div>
          <div>
            <div className="text-slate-400 text-sm font-medium">Total Ratings</div>
            <div className="text-2xl font-bold">{stats.totalRatings}</div>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-lg mb-8">{error}</div>}

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md mb-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">User Listings</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition text-sm font-medium" onClick={() => setShowAddUser(!showAddUser)}>
              {showAddUser ? <X size={16} /> : <Plus size={16} />}
              <span>{showAddUser ? 'Close' : 'Add User'}</span>
            </button>
          </div>
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full sm:w-64 p-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 transition" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {showAddUser && (
          <div className="bg-slate-900/40 p-6 rounded-lg mb-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" className="p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:border-indigo-500 outline-none" placeholder="Full Name (Min 20 chars)" required minLength="20" maxLength="60" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              <input type="email" className="p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:border-indigo-500 outline-none" placeholder="Email Address" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              <input type="password" className="p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:border-indigo-500 outline-none" placeholder="Password (8-16 chars, 1 upper, 1 special)" required minLength="8" maxLength="16" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
              <input type="text" className="p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:border-indigo-500 outline-none" placeholder="Address" required maxLength="400" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} />
              <select className="p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:border-indigo-500 outline-none" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="NORMAL_USER">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
              </select>
              <button type="submit" className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition font-medium">Create User</button>
            </form>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">Name</th>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">Email</th>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">Address</th>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">Role</th>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">Store Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-4 border-b border-slate-700">{u.name}</td>
                  <td className="p-4 border-b border-slate-700">{u.email}</td>
                  <td className="p-4 border-b border-slate-700">{u.address}</td>
                  <td className="p-4 border-b border-slate-700">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      u.role === 'SYSTEM_ADMIN' ? 'bg-red-500/10 text-red-400' : 
                      u.role === 'STORE_OWNER' ? 'bg-amber-500/10 text-amber-400' : 
                      'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 border-b border-slate-700">{u.role === 'STORE_OWNER' && u.store_rating ? Number(u.store_rating).toFixed(1) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-bold">Store Listings</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition text-sm font-medium" onClick={() => setShowAddStore(!showAddStore)}>
            {showAddStore ? <X size={16} /> : <Plus size={16} />}
            <span>{showAddStore ? 'Close' : 'Add Store'}</span>
          </button>
        </div>

        {showAddStore && (
          <div className="bg-slate-900/40 p-6 rounded-lg mb-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Add New Store</h3>
            <form onSubmit={handleAddStore} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" className="p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:border-indigo-500 outline-none" placeholder="Store Name" required value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} />
              <input type="email" className="p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:border-indigo-500 outline-none" placeholder="Store Email" required value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} />
              <input type="text" className="p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:border-indigo-500 outline-none" placeholder="Address" required maxLength="400" value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} />
              <select className="p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:border-indigo-500 outline-none" required value={newStore.owner_id} onChange={e => setNewStore({...newStore, owner_id: e.target.value})}>
                <option value="">Select Store Owner</option>
                {users.filter(u => u.role === 'STORE_OWNER').map(owner => (
                  <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                ))}
              </select>
              <button type="submit" className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition font-medium col-span-1 sm:col-span-2">Create Store</button>
            </form>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">Store Name</th>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">Email</th>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">Address</th>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">Overall Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-4 border-b border-slate-700">{s.name}</td>
                  <td className="p-4 border-b border-slate-700">{s.email}</td>
                  <td className="p-4 border-b border-slate-700">{s.address}</td>
                  <td className="p-4 border-b border-slate-700">
                    <div className="flex items-center gap-1 text-amber-500 font-medium">
                      <Star size={16} fill="currentColor" />
                      {Number(s.overall_rating).toFixed(1)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
