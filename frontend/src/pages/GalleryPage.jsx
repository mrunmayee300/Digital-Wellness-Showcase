import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorks } from '../services/api';

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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get file type icon
  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      case 'pdf':
        return '📄';
      case 'zip':
        return '📦';
      default:
        return '📎';
    }
  };

  // Get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      Comic: 'bg-purple-100 text-purple-800',
      Website: 'bg-blue-100 text-blue-800',
      Magazine: 'bg-pink-100 text-pink-800',
      Skit: 'bg-green-100 text-green-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery</h1>
        <p className="text-gray-600">Browse all student works</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name or title..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading works...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold">Error loading works</p>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={fetchWorks}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Works Grid */}
      {!loading && !error && (
        <>
          {works.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg">No works found</p>
              <Link
                to="/upload"
                className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Your Work
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((work) => (
                <Link
                  key={work._id}
                  to={`/work/${work._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                  {/* Work Preview */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                    {work.fileType === 'image' ? (
                      <img
                        src={work.fileUrl}
                        alt={work.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : work.fileType === 'video' ? (
                      <video
                        src={work.fileUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="text-6xl">{getFileTypeIcon(work.fileType)}</div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(work.category)}`}>
                        {work.category}
                      </span>
                    </div>
                  </div>

                  {/* Work Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {work.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {work.description}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{work.name}</p>
                        <p className="text-xs text-gray-500">{work.roll}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(work.timestamp)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 text-center text-gray-600">
            Showing {works.length} work{works.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
};

export default GalleryPage;
