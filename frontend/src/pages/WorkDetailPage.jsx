import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWorkById } from '../services/api';

/**
 * Work Detail Page Component
 * Displays full details of a student work with embedded media viewer
 */
const WorkDetailPage = () => {
  const { id } = useParams();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch work details from API
  useEffect(() => {
    fetchWork();
  }, [id]);

  const fetchWork = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWorkById(id);
      setWork(response.work);
    } catch (err) {
      console.error('Error fetching work:', err);
      setError(err.message || 'Failed to load work');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  // Render media viewer based on file type
  const renderMediaViewer = () => {
    if (!work) return null;

    switch (work.fileType) {
      case 'image':
        return (
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <img
              src={work.fileUrl}
              alt={work.title}
              className="max-w-full max-h-96 rounded-lg shadow-lg"
            />
          </div>
        );

      case 'video':
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <video
              src={work.fileUrl}
              controls
              className="w-full rounded-lg shadow-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'pdf':
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <iframe
              src={`${work.fileUrl}#toolbar=1`}
              className="w-full h-96 rounded-lg shadow-lg"
              title="PDF Viewer"
            />
            <div className="mt-4 text-center">
              <a
                href={work.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="mr-2">📥</span>
                Download PDF
              </a>
            </div>
          </div>
        );

      case 'zip':
        return (
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-700 mb-4">ZIP File</p>
            <a
              href={work.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">📥</span>
              Download ZIP
            </a>
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <div className="text-6xl mb-4">📎</div>
            <p className="text-gray-700 mb-4">File Preview Not Available</p>
            <a
              href={work.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">📥</span>
              Download File
            </a>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to="/gallery"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <span className="mr-2">←</span>
        Back to Gallery
      </Link>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading work details...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold">Error loading work</p>
          <p className="text-red-600 mt-2">{error}</p>
          <Link
            to="/gallery"
            className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Gallery
          </Link>
        </div>
      )}

      {/* Work Details */}
      {work && !loading && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getCategoryColor(work.category)}`}>
                  {work.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{work.title}</h1>
                <p className="text-blue-100">{formatDate(work.timestamp)}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            {/* Media Viewer */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Media</h2>
              {renderMediaViewer()}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {work.description}
              </p>
            </div>

            {/* Student Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-gray-900 font-medium">{work.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Roll Number</p>
                  <p className="text-gray-900 font-medium">{work.roll}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900 font-medium">
                    <a href={`mailto:${work.email}`} className="text-blue-600 hover:underline">
                      {work.email}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">File Type</p>
                  <p className="text-gray-900 font-medium capitalize">{work.fileType}</p>
                </div>
              </div>
            </div>

            {/* Download/View Link */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">File URL</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <a
                  href={work.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {work.fileUrl}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkDetailPage;
