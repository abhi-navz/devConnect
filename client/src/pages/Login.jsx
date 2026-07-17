import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-bg-secondary border border-border rounded-xl p-8">
        <h2 className="text-2xl font-bold text-text-primary mb-1 font-mono">Welcome back</h2>
        <p className="text-text-secondary text-sm mb-6">Log in to continue to DevSync</p>

        {error && (
          <div className="bg-danger/10 border border-danger text-danger text-sm rounded-lg px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Your password"
            required
          />
          <Button type="submit" variant="primary" fullWidth disabled={loading} className="mt-2">
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <p className="text-text-secondary text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:text-accent-hover">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;