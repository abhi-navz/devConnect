import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../api/axios';

const statusBadge = (status) => {
  const styles = {
    pending: 'bg-warning/10 text-warning',
    accepted: 'bg-success/10 text-success',
    rejected: 'bg-danger/10 text-danger',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status]}`}>{status}</span>;
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/applications/mine');
        setApplications(data.applications);
      } catch (err) {
        setError('Failed to load your applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-text-primary mb-6 font-mono">My Applications</h1>

        {error && <p className="text-danger text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-text-secondary">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-text-secondary">
            You haven't applied to any projects yet.{' '}
            <Link to="/projects" className="text-accent hover:text-accent-hover">
              Browse projects
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <Link
                key={app._id}
                to={`/projects/${app.project?._id}`}
                className="block bg-bg-secondary border border-border rounded-xl p-4 hover:border-accent transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-text-primary text-sm font-medium">{app.project?.title}</p>
                  {statusBadge(app.status)}
                </div>
                <p className="text-text-muted text-xs">Applied for: {app.roleName}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;