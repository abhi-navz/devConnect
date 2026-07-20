import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from './Button';
import SkillTag from './SkillTag';
import api from '../../api/axios';

const ApplicantsList = ({ projectId, onRoleFilled }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/applications/project/${projectId}`);
      setApplications(data.applications);
    } catch (err) {
      setError('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [projectId]);

  const handleAccept = async (applicationId) => {
    setActionLoadingId(applicationId);
    setError('');
    try {
      await api.put(`/applications/${applicationId}/accept`);
      await fetchApplications();
      onRoleFilled?.(); // lets parent re-fetch project to reflect the now-filled role
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept application');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (applicationId) => {
    setActionLoadingId(applicationId);
    setError('');
    try {
      await api.put(`/applications/${applicationId}/reject`);
      await fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject application');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <p className="text-text-secondary text-sm">Loading applicants...</p>;
  if (applications.length === 0)
    return <p className="text-text-secondary text-sm">No applications yet.</p>;

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-warning/10 text-warning',
      accepted: 'bg-success/10 text-success',
      rejected: 'bg-danger/10 text-danger',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status]}`}>{status}</span>
    );
  };

  return (
    <div>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-bg-tertiary border border-border rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <Link to={`/developers/${app.applicant?.username}`} className="flex items-center gap-3">
                {app.applicant?.profilePicture ? (
                  <img
                    src={app.applicant.profilePicture}
                    alt={app.applicant.name}
                    className="w-9 h-9 rounded-full object-cover border border-border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-9 h-9 rounded-full bg-bg-primary border border-border items-center justify-center text-accent text-sm font-bold"
                  style={{ display: app.applicant?.profilePicture ? 'none' : 'flex' }}
                >
                  {app.applicant?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">{app.applicant?.name}</p>
                  <p className="text-text-muted text-xs">
                    @{app.applicant?.username} · applying for {app.roleName}
                  </p>
                </div>
              </Link>
              {statusBadge(app.status)}
            </div>

            {app.applicant?.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {app.applicant.skills.slice(0, 5).map((s) => (
                  <SkillTag key={s} skill={s} />
                ))}
              </div>
            )}

            {app.message && (
              <p className="text-text-secondary text-sm mb-2 italic">"{app.message}"</p>
            )}

            {app.status === 'pending' && (
              <div className="flex gap-2 mt-2">
                <Button
                  variant="primary"
                  onClick={() => handleAccept(app._id)}
                  disabled={actionLoadingId === app._id}
                >
                  Accept
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleReject(app._id)}
                  disabled={actionLoadingId === app._id}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantsList;