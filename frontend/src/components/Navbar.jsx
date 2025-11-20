import { Link, useLocation } from 'react-router-dom';

/**
 * Navigation Bar Component
 * Provides navigation links across the application
 */
const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-cyan-400 tracking-tight">DW Showcase</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-cyan-300 bg-cyan-400/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link
              to="/upload"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/upload')
                  ? 'text-cyan-300 bg-cyan-400/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Upload
            </Link>
            <Link
              to="/gallery"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/gallery')
                  ? 'text-cyan-300 bg-cyan-400/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Gallery
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
