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
      Comic: 'border border-purple-500/40 bg-purple-500/10 text-purple-100',
      Website: 'border border-blue-500/40 bg-blue-500/10 text-blue-100',
      Magazine: 'border border-pink-500/40 bg-pink-500/10 text-pink-100',
      Skit: 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
      Video: 'border border-red-500/40 bg-red-500/10 text-red-100',
      Other: 'border border-slate-500/40 bg-slate-500/10 text-slate-100',
    };
    return colors[category] || colors.Other;
  };

  // Render media viewer based on file type
  const renderMediaViewer = () => {
    if (!work) return null;

    switch (work.fileType) {
      case 'image':
        return (
          <div className="bg-slate-900/70 rounded-lg p-3 flex items-center justify-center border border-slate-800">
            <img
              src={work.fileUrl}
              alt={work.title}
              className="max-w-full max-h-[500px] rounded-lg shadow-lg shadow-black/40"
            />
          </div>
        );

      case 'video':
        return (
          <div className="bg-slate-900/70 rounded-lg p-3 border border-slate-800 space-y-3">
            {work.thumbnailUrl && (
              <div>
                <img
                  src={work.thumbnailUrl}
                  alt={`${work.title} thumbnail`}
                  className="w-full rounded-lg shadow-lg shadow-black/40"
                />
              </div>
            )}
            <div className="text-center">
              <a
                href={work.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm transition hover:brightness-110"
              >
                <span className="mr-2">▶️</span>
                Watch Video on Google Drive
              </a>
            </div>
          </div>
        );

      case 'website':
        return (
          <div className="bg-slate-900/70 rounded-lg p-3 border border-slate-800 space-y-3">
            {work.thumbnailUrl && (
              <div>
                <img
                  src={work.thumbnailUrl}
                  alt={`${work.title} landing page`}
                  className="w-full rounded-lg shadow-lg shadow-black/40 border border-slate-700"
                />
              </div>
            )}
            <div className="text-center">
              <a
                href={work.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm transition hover:brightness-110"
              >
                <span className="mr-2">🌐</span>
                Visit Website
              </a>
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="bg-slate-900/70 rounded-lg p-3 border border-slate-800">
            <iframe
              src={`${work.fileUrl}#toolbar=1`}
              className="w-full h-[500px] rounded-lg shadow-lg shadow-black/40"
              title="PDF Viewer"
            />
            <div className="mt-3 text-center">
              <a
                href={work.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm transition hover:brightness-110"
              >
                <span className="mr-2">📥</span>
                Download PDF
              </a>
            </div>
          </div>
        );

      case 'zip':
        return (
          <div className="bg-slate-900/70 rounded-lg p-4 text-center border border-slate-800">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-slate-300 mb-3 text-sm">ZIP File</p>
            <a
              href={work.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm transition hover:brightness-110"
            >
              <span className="mr-2">📥</span>
              Download ZIP
            </a>
          </div>
        );

      default:
        return (
          <div className="bg-slate-900/70 rounded-lg p-4 text-center border border-slate-800">
            <div className="text-5xl mb-3">📎</div>
            <p className="text-slate-300 mb-3 text-sm">File Preview Not Available</p>
            <a
              href={work.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm transition hover:brightness-110"
            >
              <span className="mr-2">📥</span>
              Download File
            </a>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-slate-100">
      {/* Back Button */}
      <Link
        to="/gallery"
        className="inline-flex items-center text-cyan-300 hover:text-white mb-4 text-sm"
      >
        <span className="mr-1">←</span>
        Back to Gallery
      </Link>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-slate-400">Loading work details...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-200 font-semibold">Error loading work</p>
          <p className="text-red-300 mt-2">{error}</p>
          <Link
            to="/gallery"
            className="mt-4 inline-block px-6 py-2 rounded-full bg-red-500/80 text-white hover:bg-red-400 transition-colors"
          >
            Back to Gallery
          </Link>
        </div>
      )}

      {/* Work Details */}
      {work && !loading && (
        <div className="bg-slate-950/60 rounded-2xl border border-slate-800 shadow-2xl shadow-black/40 overflow-hidden">
          {/* Header Section - More Compact */}
          <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-800 px-6 py-5 text-white">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(work.category)}`}>
                {work.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold flex-1 min-w-0">{work.title}</h1>
              <p className="text-blue-100 text-sm whitespace-nowrap">{formatDate(work.timestamp)}</p>
            </div>
          </div>

          {/* Content Section - Two Column Layout for Larger Screens */}
          <div className="p-4 sm:p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Media (2/3 width on large screens) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Media Viewer */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">Media</h2>
                  {renderMediaViewer()}
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                    {work.description}
                  </p>
                </div>
              </div>

              {/* Right Column - Info Sidebar (1/3 width on large screens) */}
              <div className="lg:col-span-1 space-y-4">
                {/* Student Information */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
                  <h2 className="text-lg font-semibold text-white mb-3">Student Information</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Name</p>
                      <p className="text-white font-medium text-sm">{work.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Roll Number</p>
                      <p className="text-white font-medium text-sm">{work.roll}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Email</p>
                      <p className="text-white font-medium text-sm">
                        <a href={`mailto:${work.email}`} className="text-cyan-300 hover:underline break-all">
                          {work.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">File Type</p>
                      <p className="text-white font-medium text-sm capitalize">{work.fileType}</p>
                    </div>
                  </div>
                </div>

                {/* File URL */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
                  <h2 className="text-lg font-semibold text-white mb-3">File URL</h2>
                  <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700 break-all">
                    <a
                      href={work.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:underline text-xs"
                    >
                      {work.fileUrl}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkDetailPage;
