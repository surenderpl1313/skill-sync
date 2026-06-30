import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg">
            Skill<span className="text-blue-400">Sync</span>
          </span>
        </Link>

        {/* Nav Links */}
        {user && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive("/dashboard") ? "text-blue-400" : "text-slate-400 hover:text-white"}`}>
              Dashboard
            </Link>
            <Link to="/explore" className={`text-sm font-medium transition-colors ${isActive("/explore") ? "text-blue-400" : "text-slate-400 hover:text-white"}`}>
              Explore
            </Link>
            <Link to="/projects/create" className={`text-sm font-medium transition-colors ${isActive("/projects/create") ? "text-blue-400" : "text-slate-400 hover:text-white"}`}>
              Create Project
            </Link>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors hidden md:block">
                  {user.name?.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-sm bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;