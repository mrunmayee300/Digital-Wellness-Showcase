# Digital Wellness Course Showcase Platform

A full-stack cloud-based platform for students to upload and showcase their digital work including comics, magazines, videos, websites, PDFs, and ZIP files.

## 🚀 Features

- **Student Upload Form** - Upload work with drag-and-drop support
- **Cloud Storage** - Direct uploads to Cloudinary (no local storage)
- **MongoDB Atlas** - Cloud database for metadata storage
- **Gallery View** - Grid layout with search, filter, and sort functionality
- **Work Detail Page** - Full details with embedded media viewer
- **Responsive Design** - Mobile and desktop optimized with Tailwind CSS
- **Progress Tracking** - Upload progress bar
- **File Preview** - Preview before upload

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React Dropzone

### Backend
- Node.js
- Express
- MongoDB Atlas (Cloud Database)
- Cloudinary (Cloud Storage)
- Multer (File handling)
- Express Validator

### Deployment
- Frontend: Vercel
- Backend: Render / Railway

## 📁 Project Structure

```
dwww/
├── backend/
│   ├── config/
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── models/
│   │   └── Work.js            # MongoDB schema/model
│   ├── routes/
│   │   ├── upload.js          # Upload route
│   │   └── works.js           # Works routes (GET, DELETE)
│   ├── server.js              # Express server entry point
│   ├── package.json
│   ├── .env                   # Environment variables (not in git)
│   ├── .gitignore
│   ├── render.yaml            # Render deployment config
│   └── railway.json           # Railway deployment config
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx     # Navigation component
│   │   ├── pages/
│   │   │   ├── HomePage.jsx   # Landing page
│   │   │   ├── UploadPage.jsx # Upload form page
│   │   │   ├── GalleryPage.jsx # Gallery page
│   │   │   └── WorkDetailPage.jsx # Work detail page
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles + Tailwind
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── postcss.config.js      # PostCSS configuration
│   ├── vercel.json            # Vercel deployment config
│   └── .env                   # Environment variables (not in git)
│
└── README.md
```

## 🔌 API Endpoints

### POST `/api/upload`
Upload student work to cloud storage.

**Request:** `multipart/form-data`
- `name`: Student name (required)
- `roll`: Roll number (required)
- `email`: Email address (required)
- `title`: Title of work (required)
- `description`: Description (required)
- `category`: Category - Comic, Website, Magazine, Skit, Other (required)
- `file`: File to upload (required, max 300MB)

**Response:**
```json
{
  "success": true,
  "message": "Work uploaded successfully",
  "work": { ... },
  "cloudUrl": "https://..."
}
```

### GET `/api/works`
Get all works with optional filters.

**Query Parameters:**
- `category`: Filter by category (optional)
- `search`: Search by name or title (optional)
- `sort`: Sort by 'newest' or 'oldest' (default: 'newest')

**Response:**
```json
{
  "success": true,
  "count": 10,
  "works": [ ... ]
}
```

### GET `/api/works/:id`
Get single work by ID.

**Response:**
```json
{
  "success": true,
  "work": { ... }
}
```

### DELETE `/api/works/:id`
Delete a work (admin only - add authentication).

**Response:**
```json
{
  "success": true,
  "message": "Work deleted successfully"
}
```

## 🎨 Features Overview

### Upload Page (`/upload`)
- Drag-and-drop file upload
- File type validation
- File size limit (300MB)
- Upload progress bar
- File preview before upload
- Form validation
- Success message with cloud URL

### Gallery Page (`/gallery`)
- Grid layout of all works
- Search by name or title
- Filter by category
- Sort by newest/oldest
- Responsive card design
- Loading states
- Empty states

### Work Detail Page (`/work/:id`)
- Full work details
- Embedded media viewer:
  - Image viewer
  - Video player
  - PDF preview (iframe)
  - ZIP download link
- Student information
- Download link
- Back to gallery navigation
