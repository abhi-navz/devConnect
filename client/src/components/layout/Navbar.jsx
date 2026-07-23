import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out successfully!");

      setMenuOpen(false);

      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/discover", label: "Discover" },
    { to: "/connections", label: "Connections" },
    { to: "/projects", label: "Projects" },
    { to: "/my-applications", label: "My Applications" },
    { to: "/profile", label: user?.username ? `@${user.username}` : "Profile" },
  ];

  return (
    <nav className="bg-bg-secondary border-b border-border px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <Link
          to={isAuthenticated ? "/home" : "/"}
          className="text-xl font-bold text-accent font-mono"
          onClick={() => setMenuOpen(false)}
        >
          DevSync
        </Link>

        {/* Desktop nav — hidden below sm breakpoint */}
        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-text-secondary hover:text-text-primary text-sm whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
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

        {/* Hamburger toggle — only visible below sm breakpoint */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-text-primary p-1"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6H21M3 12H21M3 18H21" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-bg-secondary border-b border-border px-6 py-4 flex flex-col gap-3 z-50">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-text-secondary hover:text-text-primary text-sm py-1"
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="secondary" onClick={handleLogout} fullWidth>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" fullWidth>
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <Button variant="primary" fullWidth>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
