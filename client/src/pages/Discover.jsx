import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/layout/Navbar';
import UserCard from '../components/common/UserCard';
import api from '../api/axios';

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (skillFilter) params.skill = skillFilter;

      const { data } = await api.get('/users', { params });
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load developers');
    } finally {
      setLoading(false);
    }
  }, [search, skillFilter]);

  // Debounce: wait 400ms after typing stops before hitting the API
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 400);
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-text-primary mb-2 font-mono">
          Discover Developers
        </h1>
        <p className="text-text-secondary mb-6">
          Find teammates by name, username, or skill.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or username..."
            className="flex-1 bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="text"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            placeholder="Filter by skill (e.g. React)"
            className="flex-1 bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger text-danger text-sm rounded-lg px-4 py-2.5 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-text-secondary">Loading developers...</p>
        ) : users.length === 0 ? (
          <p className="text-text-secondary">No developers found. Try a different search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => (
              <UserCard key={u._id} user={u} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;