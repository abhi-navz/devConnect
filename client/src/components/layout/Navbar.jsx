import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-bg-secondary border-b border-border px-6 py-4 flex items-center justify-between">
      <Link
        to={isAuthenticated ? "/home" : "/"}
        className="text-xl font-bold text-accent font-mono"
      >
        DevSync
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link
              to="/home"
              className="text-text-secondary hover:text-text-primary text-sm"
            >
              Home
            </Link>
            <Link
              to="/projects"
              className="text-text-secondary hover:text-text-primary text-sm"
            >
              Projects
            </Link>
            <Link
              to="/my-applications"
              className="text-text-secondary hover:text-text-primary text-sm"
            >
              My Applications
            </Link>
            <Link
              to="/discover"
              className="text-text-secondary hover:text-text-primary text-sm"
            >
              Discover
            </Link>
            <Link
              to="/connections"
              className="text-text-secondary hover:text-text-primary text-sm"
            >
              Connections
            </Link>
            <Link
              to="/profile"
              className="text-text-secondary hover:text-text-primary text-sm"
            >
              {user?.username}
            </Link>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
