import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';
import WorkDetailPage from './pages/WorkDetailPage';
import HomePage from './pages/HomePage';

/**
 * Main App Component
 * Sets up routing for the Digital Wellness Course Showcase Platform
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/work/:id" element={<WorkDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
