import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stores');
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleRating = async (storeId, rating) => {
    try {
      await axios.post('http://localhost:5000/api/ratings', { store_id: storeId, rating });
      fetchStores();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Stores</h1>
        <input 
          type="text" 
          placeholder="Search by name or address..." 
          className="w-full sm:w-80 p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 transition shadow-sm" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map(store => (
          <div key={store.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md flex flex-col transition hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-2">{store.name}</h3>
            <p className="text-slate-400 text-sm mb-6 flex-1">{store.address}</p>
            
            <div className="flex justify-between items-center mb-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <span className="text-sm text-slate-400 font-medium">Overall Rating</span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star size={16} fill="currentColor" />
                {Number(store.overall_rating).toFixed(1)}
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <p className="text-sm mb-2 text-slate-400 font-medium">
                {store.user_rating ? 'Your Rating' : 'Rate this store'}
              </p>
              <div className="flex gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={28} 
                    className={`transition hover:scale-110 ${store.user_rating >= star ? 'text-amber-500' : 'text-slate-600 hover:text-amber-400'}`}
                    fill={store.user_rating >= star ? 'currentColor' : 'none'}
                    onClick={() => handleRating(store.id, star)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
