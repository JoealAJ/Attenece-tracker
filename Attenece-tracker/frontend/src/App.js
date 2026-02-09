import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import ManageTeachers from './pages/ManageTeachers';
import ManageStudents from './pages/ManageStudents';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import StudentDashboard from './pages/StudentDashboard';

const NotFound = () => <div className="p-4">404 Not Found</div>;

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Redirect to home/dashboard if unauthorized
  }
  return children;
};

// Redirector to appropriate dashboard
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" />;
  if (user.role === 'student') return <Navigate to="/student/dashboard" />;

  return <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<HomeRedirect />} />

            {/* Admin Routes */}
            <Route path="admin" element={<PrivateRoute allowedRoles={['admin']}><Outlet /></PrivateRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="teachers" element={<ManageTeachers />} />
              <Route path="students" element={<ManageStudents />} />
            </Route>

            {/* Teacher Routes */}
            <Route path="teacher" element={<PrivateRoute allowedRoles={['teacher']}><Outlet /></PrivateRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="attendance" element={<Attendance />} />
            </Route>

            {/* Student Routes */}
            <Route path="student" element={<PrivateRoute allowedRoles={['student']}><Outlet /></PrivateRoute>}>
              <Route path="dashboard" element={<StudentDashboard />} />
            </Route>

            {/* Shared Routes */}
            <Route path="reports" element={<PrivateRoute allowedRoles={['admin', 'teacher']}><Reports /></PrivateRoute>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
