# Todo Application - Full Stack Project

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/Mridul-Tilwaliya/todo-app)

A modern, full-featured Todo application built with React, TypeScript, Node.js, and MongoDB. This application provides a complete user authentication system and comprehensive todo management features.

## 🚀 Features

### User Management
- **User Signup**: Create a new account with email and password
- **User Sign-in**: Secure login with JWT authentication
- **Forgot Password**: Request password reset via email
- **Reset Password**: Reset password using secure token link

### Todo Management
- **Create Todo**: Add new todos with title and optional description
- **Update Todo**: Edit existing todos
- **List Todos**: View all todos with filtering and search
- **Delete Todo**: Remove todos with confirmation
- **Toggle Completion**: Mark todos as completed or incomplete
- **Filter Todos**: Filter by All, Active, or Completed
- **Search Todos**: Search todos by title or description

### Additional Features
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Error Logging**: All backend errors are logged to MongoDB
- **Toast Notifications**: User-friendly notifications for all actions
- **Statistics Dashboard**: View total, active, and completed todo counts

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Zustand** for global state management
- **React Query** with Zod schemas for API data fetching
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express and TypeScript
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email functionality
- **Zod** for validation
- **CORS** for cross-origin requests

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (free tier works perfectly)

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Mridul-Tilwaliya/todo-app.git
cd todo-app
```

### 2. Install Dependencies

Install all dependencies for both server and client:

```bash
npm run install:all
```

Or install them separately:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account (if you don't have one)
3. Create a new cluster (free tier M0)
4. Create a database user with username and password
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)

### 4. Gmail App Password Setup (for Password Reset)

1. Go to your Google Account settings
2. Enable 2-Step Verification (if not already enabled)
3. Go to App Passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### 5. Environment Variables

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=your_mongodb_atlas_connection_string_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# Client URL (for CORS and email links)
CLIENT_URL=http://localhost:5173
```

**Important Notes:**
- Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas connection string
- Replace `your_super_secret_jwt_key_change_in_production` with a strong random string
- Replace `your_email@gmail.com` with your Gmail address
- Replace `your_gmail_app_password` with the 16-character app password from step 4

### 6. Run the Application

#### Development Mode (Both Server and Client)

From the root directory:

```bash
npm run dev
```

This will start both the server (port 5000) and client (port 5173) concurrently.

#### Run Separately

**Server only:**
```bash
cd server
npm run dev
```

**Client only:**
```bash
cd client
npm run dev
```

### 7. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
todo-app/
├── server/                 # Backend application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   ├── .env                # Environment variables (create this)
│   ├── package.json
│   └── tsconfig.json
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/            # API and utilities
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand store
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
├── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Todos (Protected - Requires Authentication)
- `GET /api/todos` - Get all todos (supports `?completed=true/false` and `?search=query`)
- `GET /api/todos/:id` - Get a single todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion status

## 🎨 Assumptions and Design Decisions

1. **Email Service**: Using Gmail with App Passwords for password reset functionality. This is free and doesn't require additional services.

2. **Password Reset**: Reset tokens expire after 1 hour for security purposes.

3. **JWT Tokens**: Tokens expire after 7 days. Users will need to sign in again after expiration.

4. **Error Logging**: All backend errors are automatically logged to MongoDB in a separate `errorlogs` collection for debugging and monitoring.

5. **Dark Mode**: Preference is stored in localStorage and persists across sessions.

6. **Todo Filtering**: The filter state is managed locally in the component. Search is performed on the backend for better performance.

7. **Form Validation**: Both frontend and backend use Zod schemas for consistent validation.

8. **State Management**: Zustand is used for authentication state only. React Query handles all server state.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB Atlas connection string is correct
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check that your database user has proper permissions

### Email Not Sending
- Verify your Gmail app password is correct
- Ensure 2-Step Verification is enabled on your Google account
- Check that `EMAIL_USER` matches the Gmail account

### CORS Errors
- Ensure `CLIENT_URL` in server `.env` matches your frontend URL
- Check that the server is running on the correct port

### Port Already in Use
- Change the `PORT` in server `.env` file
- Or kill the process using the port: `npx kill-port 5000`

## 📝 Notes

- All code is written in TypeScript (no JavaScript files)
- The application follows RESTful API principles
- Error handling is implemented throughout the application
- The UI is responsive and works on all device sizes
- Dark mode is fully functional and persists across sessions

## 🎥 Demo Video

A demo video showing the application features is available at: [Google Drive Link]

The video demonstrates:
- Adding a Todo
- Updating a Todo
- Listing Todos
- Deleting a Todo

## 📄 License

This project is created for educational purposes.

## 👤 Author

Mridul Tilwaliya

## 🔗 Repository

GitHub: [https://github.com/Mridul-Tilwaliya/todo-app](https://github.com/Mridul-Tilwaliya/todo-app)

---

**Note**: Make sure to keep your `.env` file secure and never commit it to version control. The `.gitignore` file is already configured to exclude it.

