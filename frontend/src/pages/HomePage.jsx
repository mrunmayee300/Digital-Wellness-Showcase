import { Link } from 'react-router-dom';

/**
 * Home Page Component
 * Landing page with overview and quick access to upload/gallery
 */
const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Digital Wellness Course Showcase
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Share and explore student work including comics, magazines, videos, websites, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/upload"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Upload Your Work
          </Link>
          <Link
            to="/gallery"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Browse Gallery
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
          <p className="text-gray-600">
            Support for images, videos, PDFs, ZIP files, and more. Upload any type of creative work.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">☁️</div>
          <h3 className="text-xl font-semibold mb-2">Cloud Storage</h3>
          <p className="text-gray-600">
            All files are securely stored in the cloud with fast access from anywhere.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Easy Discovery</h3>
          <p className="text-gray-600">
            Search and filter by category, name, or title to find exactly what you're looking for.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
