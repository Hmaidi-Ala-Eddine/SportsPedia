# Authentication System Setup Guide

This guide will help you set up the user authentication system with MySQL for SportsPedia.

## Prerequisites

- MySQL Server installed and running
- Python 3.8+ (backend)
- Node.js 16+ (frontend)

## Backend Setup

### 1. Install MySQL Dependencies

Navigate to the backend directory and activate your virtual environment:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
```

Install the new dependencies:

```powershell
pip install -r requirements.txt
```

### 2. Configure MySQL Database

Create a MySQL database:

```sql
CREATE DATABASE sportspedia;
```

Update your `.env` file in the backend directory with your MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sportspedia

# JWT Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Initialize Database Tables

Run the database initialization script:

```powershell
python init_db.py
```

This will create the `users` table in your MySQL database.

### 4. Start the Backend Server

```powershell
python -m app.main
```

Or using uvicorn:

```powershell
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## Frontend Setup

The frontend is already configured and ready to use!

### Start the Development Server

Navigate to the frontend directory:

```powershell
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Available Routes

### Frontend Routes

- `/login` - User login page
- `/signup` - User registration page
- `/profile` - User profile page (requires authentication)

### API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile

## Testing the System

1. **Sign Up**: Navigate to `http://localhost:5173/signup` and create a new account
2. **Login**: Go to `http://localhost:5173/login` and login with your credentials
3. **Profile**: Access `http://localhost:5173/profile` to view and edit your profile

## Features

✅ User registration with email validation
✅ Secure password hashing (bcrypt)
✅ JWT-based authentication
✅ Profile management (update email, name, password)
✅ Session persistence (localStorage)
✅ Responsive design matching existing theme
✅ Form validation and error handling

## Security Notes

- Passwords are hashed using bcrypt before storing
- JWT tokens expire after 30 minutes (configurable)
- Tokens are stored in localStorage
- All API endpoints use Bearer token authentication
- **Important**: Change the `SECRET_KEY` in production to a strong random value

## Troubleshooting

### Database Connection Error

If you get a connection error, verify:
- MySQL server is running
- Database credentials in `.env` are correct
- Database `sportspedia` exists

### Token Expired Error

If you get authentication errors:
- Clear browser localStorage
- Login again to get a fresh token

### CORS Error

Ensure the backend CORS settings include your frontend URL:
```python
CORS_ORIGINS = ["http://localhost:5173"]
```

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).
