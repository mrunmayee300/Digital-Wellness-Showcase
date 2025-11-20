import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { uploadWork } from '../services/api';

/**
 * Upload Page Component
 * Form for students to upload their work with drag-and-drop support
 */
const UploadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    email: '',
    title: '',
    description: '',
    category: 'Comic',
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  // Configure dropzone for drag-and-drop file upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
    },
    maxSize: 300 * 1024 * 1024, // 300MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setErrors({ ...errors, file: null });
      }
    },
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors.some(e => e.code === 'file-too-large')) {
          setErrors({ ...errors, file: 'File size exceeds 300MB limit' });
        } else {
          setErrors({ ...errors, file: 'Invalid file type. Allowed: images, videos, PDFs, ZIP files' });
        }
      }
    },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  // Validate form fields
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Student name is required';
    if (!formData.roll.trim()) newErrors.roll = 'Roll number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!file) newErrors.file = 'File is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setSuccess(null);

    try {
      // Create FormData for multipart/form-data upload
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('roll', formData.roll.trim());
      data.append('email', formData.email.trim());
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('file', file);

      // Upload to backend (which uploads to Cloudinary)
      const response = await uploadWork(data, (progress) => {
        setUploadProgress(progress);
      });

      setSuccess({
        message: 'Work uploaded successfully!',
        cloudUrl: response.cloudUrl,
      });

      // Reset form
      setFormData({
        name: '',
        roll: '',
        email: '',
        title: '',
        description: '',
        category: 'Comic',
      });
      setFile(null);
      setUploadProgress(0);

      // Redirect to gallery after 3 seconds
      setTimeout(() => {
        navigate('/gallery');
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ 
        submit: error.message || error.error || 'Upload failed. Please try again.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Get file preview URL
  const filePreview = file ? URL.createObjectURL(file) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-100">
      <h1 className="text-3xl font-bold text-white mb-8">Upload Your Work</h1>

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-400/40 rounded-lg">
          <p className="text-emerald-200 font-semibold">{success.message}</p>
          {success.cloudUrl && (
            <p className="text-emerald-200/80 text-sm mt-1">
              Cloud URL: <a href={success.cloudUrl} target="_blank" rel="noopener noreferrer" className="underline">{success.cloudUrl}</a>
            </p>
          )}
          <p className="text-emerald-200/80 text-sm mt-2">Redirecting to gallery...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/40">
        {/* Student Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Student Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                errors.name ? 'border border-red-500/60' : 'border border-slate-700'
              }`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="roll" className="block text-sm font-medium text-slate-300 mb-2">
              Roll Number *
            </label>
            <input
              type="text"
              id="roll"
              name="roll"
              value={formData.roll}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                errors.roll ? 'border border-red-500/60' : 'border border-slate-700'
              }`}
              placeholder="Enter roll number"
            />
            {errors.roll && <p className="mt-1 text-sm text-red-400">{errors.roll}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              errors.email ? 'border border-red-500/60' : 'border border-slate-700'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>

        {/* Work Information */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Title of Work *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              errors.title ? 'border border-red-500/60' : 'border border-slate-700'
            }`}
            placeholder="Enter title of your work"
          />
          {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 rounded-lg bg-slate-900/60 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              errors.description ? 'border border-red-500/60' : 'border border-slate-700'
            }`}
            placeholder="Describe your work..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value="Comic">Comic</option>
            <option value="Website">Website</option>
            <option value="Magazine">Magazine</option>
            <option value="Skit">Skit</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* File Upload with Drag and Drop */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            File Upload * (Max 300MB)
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-cyan-400 bg-cyan-500/10'
                : errors.file
                ? 'border-red-500 bg-red-500/10'
                : 'border-slate-700 bg-slate-900/40 hover:border-cyan-400 hover:bg-slate-900/70'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div>
                <p className="text-cyan-200 font-semibold">✓ {file.name}</p>
                <p className="text-sm text-slate-400 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-slate-400">
                  {isDragActive
                    ? 'Drop the file here...'
                    : 'Drag & drop a file here, or click to select'}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Supports: Images, Videos, PDFs, ZIP files
                </p>
              </div>
            )}
          </div>
          {errors.file && <p className="mt-1 text-sm text-red-400">{errors.file}</p>}
        </div>

        {/* File Preview */}
        {filePreview && file && (
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-300 mb-2">Preview:</p>
            {file.type.startsWith('image/') && (
              <img
                src={filePreview}
                alt="Preview"
                className="max-w-full max-h-64 rounded-lg border border-slate-700"
              />
            )}
            {file.type.startsWith('video/') && (
              <video
                src={filePreview}
                controls
                className="max-w-full max-h-64 rounded-lg border border-slate-700"
              />
            )}
            {file.type === 'application/pdf' && (
              <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-700">
                <p className="text-slate-300">📄 PDF File: {file.name}</p>
              </div>
            )}
            {file.type.includes('zip') && (
              <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-700">
                <p className="text-slate-300">📦 ZIP File: {file.name}</p>
              </div>
            )}
          </div>
        )}

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-200">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            isUploading
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Work'}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
