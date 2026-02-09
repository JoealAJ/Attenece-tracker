# Student Attendance Tracker

A web application for tracking student attendance with role-based access for Admins and Teachers.

## Tech Stack
- **Frontend**: React (Vite, Tailwind CSS)
- **Backend**: Django (Django Rest Framework)
- **Database**: SQLite (Default) / MySQL (Supported)

## Features
- **Admin**:
  - Manage Teachers & Students (CRUD)
  - View Dashboard Stats
  - View All Reports
- **Teacher**:
  - Mark Attendance for assigned students
  - View their own Dashboard Stats
  - View Attendance Reports

## Setup Instructions

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows
   ..\venv\Scripts\activate
   # Mac/Linux
   source ../venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   # (Note: requirements.txt generation is recommended, currently installed manually)
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers mysqlclient
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Seed initial data (Admin & Demo Teacher):
   ```bash
   python seed.py
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Default Credentials
- **Admin**: `admin` / `admin123`
- **Teacher**: `teacher1` / `teacher123`

## API Endpoints
- `POST /api/auth/login/`: Obtain JWT token
- `GET /api/teachers/`: List teachers (Admin)
- `GET /api/students/`: List students
- `POST /api/attendance/mark_bulk/`: Mark attendance
- `GET /api/reports/`: Get attendance reports
