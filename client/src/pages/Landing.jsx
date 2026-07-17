import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 font-mono">
          Build. Connect. <span className="text-accent">Ship.</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-xl mb-10">
          DevSync is where developers find teammates, share progress, and collaborate on real
          projects — from idea to deployment.
        </p>
        <div className="flex gap-4">
          <Link to="/register">
            <Button variant="primary" className="text-base px-6 py-3">
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" className="text-base px-6 py-3">
              I already have an account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;