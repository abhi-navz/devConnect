import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import ProjectCard from '../components/common/ProjectCard';
import CreateProjectForm from '../components/common/CreateProjectForm';
import Button from '../components/common/Button';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Projects = () => {
  const [tab, setTab] = useState('browse'); // 'browse' | 'mine'
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [skillFilter, setSkillFilter] = useState('');
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'browse') {
        const params = skillFilter ? { skill: skillFilter } : {};
        const { data } = await api.get('/projects', { params });
        setProjects(data.projects);
      } else {
        const { data } = await api.get('/projects/mine');
        setProjects(data.projects);
      }
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchProjects, tab === 'browse' ? 400 : 0);
    return () => clearTimeout(timeout);
  }, [skillFilter, tab]);

  const handleCreated = (newProject) => {
    setShowForm(false);
    if (tab === 'mine') {
      setProjects([newProject, ...projects]);
    } else {
      fetchProjects();
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-mono">Projects</h1>
            <p className="text-text-secondary text-sm">Find a team, or recruit one.</p>
          </div>
          {!showForm && (
            <Button variant="primary" onClick={() => setShowForm(true)}>
              + Post a Project
            </Button>
          )}
        </div>

        {showForm && (
          <div className="mb-6">
            <CreateProjectForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setTab('browse')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === 'browse'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setTab('mine')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === 'mine'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            My Projects
          </button>
        </div>

        {tab === 'browse' && (
          <input
            type="text"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            placeholder="Filter by skill needed (e.g. React)"
            className="w-full sm:w-80 bg-bg-tertiary border border-border text-text-primary rounded-lg px-4 py-2.5 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent mb-6"
          />
        )}

        {error && <p className="text-danger text-sm mb-4">{error}</p>}

        {loading ? (
          <LoadingSpinner label="Loading projects..." />
        ) : projects.length === 0 ? (
          <p className="text-text-secondary">
            {tab === 'browse' ? 'No open projects right now. Check back soon, or post your own.'
  : "You haven't posted a project yet — post one and start recruiting."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;