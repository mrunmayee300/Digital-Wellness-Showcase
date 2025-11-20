import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorks } from '../services/api';
import WorkShowcaseCard from '../components/WorkShowcaseCard.jsx';

/**
 * Gallery Page Component
 * Displays all student works in a grid layout with search, filter, and sort
 */
const GalleryPage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    sort: 'newest',
  });

  // Fetch works from API
  useEffect(() => {
    fetchWorks();
  }, [filters]);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWorks(filters);
      setWorks(response.works || []);
    } catch (err) {
      console.error('Error fetching works:', err);
      setError(err.message || 'Failed to load works');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-100">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Gallery</p>
        <h1 className="text-4xl font-semibold text-white">One project per row, clear and cinematic.</h1>
        <p className="text-slate-400">
          Refine by category, search by storyteller, and open any row to dive into the full detail page.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="backdrop-blur rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search Bar */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-slate-400 mb-2">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name or title..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-slate-100 placeholder-slate-500 transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-400 mb-2">
              Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-slate-100 transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="all">All Categories</option>
              <option value="Comic">Comic</option>
              <option value="Website">Website</option>
              <option value="Magazine">Magazine</option>
              <option value="Skit">Skit</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-slate-400 mb-2">
              Sort By
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-slate-100 transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-slate-400">Loading works...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-red-200 font-semibold">Error loading works</p>
          <p className="text-red-300 mt-2">{error}</p>
          <button
            onClick={fetchWorks}
            className="mt-4 inline-flex items-center rounded-full bg-red-500/80 px-5 py-2 text-white transition hover:bg-red-400"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Works Grid */}
      {!loading && !error && (
        <>
          {works.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40">
              <p className="text-slate-200 text-lg">No works found</p>
              <Link
                to="/upload"
                className="mt-4 inline-flex rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-blue-500/30"
              >
                Upload Your Work
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {works.map((work) => (
                <WorkShowcaseCard key={work._id} work={work} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center text-slate-500">
            Showing {works.length} work{works.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
};

export default GalleryPage;
