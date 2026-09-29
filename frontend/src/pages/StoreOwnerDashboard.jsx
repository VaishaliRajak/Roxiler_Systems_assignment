import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Users } from 'lucide-react';

const StoreOwnerDashboard = () => {
  const [data, setData] = useState({ average_rating: 0, ratings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/ratings/dashboard');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 max-w-7xl mx-auto w-full text-slate-400">Loading...</div>;
  if (error) return <div className="p-8 max-w-7xl mx-auto w-full text-red-400">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">My Store Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="p-4 bg-amber-500/10 text-amber-400 rounded-xl">
            <Star size={32} fill="currentColor" />
          </div>
          <div>
            <div className="text-slate-400 text-sm font-medium">Average Rating</div>
            <div className="text-3xl font-bold">{Number(data.average_rating).toFixed(1)}</div>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Users size={32} />
          </div>
          <div>
            <div className="text-slate-400 text-sm font-medium">Total Reviews</div>
            <div className="text-3xl font-bold">{data.ratings.length}</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-bold mb-6">Recent Ratings</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">User Name</th>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">User Email</th>
                <th className="p-4 bg-slate-900/40 text-slate-400 font-semibold border-b border-slate-700">Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.ratings.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-slate-400 border-b border-slate-700">No ratings yet</td></tr>
              ) : (
                data.ratings.map((r, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 border-b border-slate-700">{r.name}</td>
                    <td className="p-4 border-b border-slate-700">{r.email}</td>
                    <td className="p-4 border-b border-slate-700">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star size={16} fill="currentColor" />
                        {r.rating}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
