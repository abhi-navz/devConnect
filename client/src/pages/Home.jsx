import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-text-primary mb-2 font-mono">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-text-secondary">
          This is your DevSync feed. Project updates, teammate recommendations, and activity from
          people you follow will show up here soon.
        </p>

        <div className="mt-8 bg-bg-secondary border border-border rounded-xl p-6">
          <p className="text-text-muted text-sm">
            🚧 Feed, project posts, and recruiting features are coming in the next milestones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;