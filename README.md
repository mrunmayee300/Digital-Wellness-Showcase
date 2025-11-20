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

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v16 or higher) and npm installed
2. **MongoDB Atlas** account (free tier available)
3. **Cloudinary** account (free tier available)
4. **Git** installed

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd dwww
```

### 2. Backend Setup

#### Step 1: Navigate to backend directory

```bash
cd backend
```

#### Step 2: Install dependencies

```bash
npm install
```

#### Step 3: Create `.env` file

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Port
PORT=5000

# CORS Origin (your frontend URL)
CORS_ORIGIN=http://localhost:3000
```

#### Step 4: Get MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier: M0)
4. Go to "Database Access" and create a database user
5. Go to "Network Access" and whitelist your IP (or use 0.0.0.0/0 for development)
6. Click "Connect" on your cluster and copy the connection string
7. Replace `<password>` and `<dbname>` in the connection string

#### Step 5: Get Cloudinary Credentials

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Copy your `Cloud Name`, `API Key`, and `API Secret`

#### Step 6: Run the backend server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Step 1: Navigate to frontend directory

```bash
cd frontend
```

#### Step 2: Install dependencies

```bash
npm install
```

#### Step 3: Create `.env` file

Create a `.env` file in the `frontend` directory:

```env
# API Base URL (Backend URL)
# For local development:
VITE_API_BASE_URL=http://localhost:5000/api

# For production (after deploying backend):
# VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

#### Step 4: Run the frontend development server

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Build for Production

#### Frontend Build

```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

#### Backend Build

The backend doesn't require a build step. Just ensure all dependencies are installed with `npm install`.

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional, or use Vercel Dashboard)

```bash
npm install -g vercel
```

2. **Deploy from frontend directory**

```bash
cd frontend
vercel
```

Or use Vercel Dashboard:
1. Go to [Vercel](https://vercel.com/)
2. Import your Git repository
3. Set root directory to `frontend`
4. Add environment variable:
   - `VITE_API_BASE_URL`: Your backend URL (e.g., `https://your-backend.onrender.com/api`)
5. Deploy

**Vercel Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Backend Deployment (Render)

1. **Go to Render Dashboard**
   - Visit [Render](https://render.com/)
   - Sign up or sign in

2. **Create a New Web Service**
   - Click "New" → "Web Service"
   - Connect your Git repository
   - Set the following:
     - **Name**: digital-wellness-backend
     - **Root Directory**: `backend`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Add Environment Variables**
   - Click on "Environment" tab
   - Add the following variables:
     ```
     MONGODB_URI=your-mongodb-connection-string
     CLOUDINARY_CLOUD_NAME=your-cloud-name
     CLOUDINARY_API_KEY=your-api-key
     CLOUDINARY_API_SECRET=your-api-secret
     PORT=5000
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your backend

### Backend Deployment (Railway - Alternative)

1. **Go to Railway Dashboard**
   - Visit [Railway](https://railway.app/)
   - Sign up or sign in

2. **Create a New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Select the `backend` directory as root
   - Railway will auto-detect Node.js

4. **Add Environment Variables**
   - Go to "Variables" tab
   - Add the same environment variables as Render

5. **Deploy**
   - Railway will automatically build and deploy

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

## 🔒 Security Notes

- All files are stored in Cloudinary (cloud storage)
- No files are stored locally on the server
- File uploads are validated for type and size
- CORS is configured for frontend domain
- Environment variables are used for sensitive data
- For production, add authentication for admin routes

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Check your connection string
- Ensure IP is whitelisted in MongoDB Atlas
- Verify database user credentials

**Cloudinary Upload Error:**
- Verify Cloudinary credentials in `.env`
- Check file size (must be under 300MB)
- Ensure valid file types

### Frontend Issues

**API Connection Error:**
- Check `VITE_API_BASE_URL` in `.env`
- Ensure backend is running
- Check CORS configuration in backend

**Build Errors:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (v16+)

## 📝 Environment Variables Reference

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🎯 Future Enhancements

- [ ] Admin authentication with JWT
- [ ] User authentication for students
- [ ] Thumbnail generation for videos
- [ ] Image optimization
- [ ] Comments on works
- [ ] Like/favorite functionality
- [ ] Analytics dashboard
- [ ] Bulk upload feature
- [ ] Email notifications

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributors

Created as a Digital Wellness Course Showcase Platform.

## 📞 Support

For issues or questions, please open an issue on the repository.

---

**Happy Coding! 🚀**
