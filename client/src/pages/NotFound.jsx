import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent font-mono mb-2">404</h1>
        <p className="text-text-primary text-lg mb-2">Page not found</p>
        <p className="text-text-secondary text-sm mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;