import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'bg-blue-700' : '';

    return (
        <div className="flex h-screen bg-gray-100">
            <Toaster position="top-right" />
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-gray-700">
                    Attendance App
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {user?.role === 'admin' && (
                        <>
                            <Link to="/admin/dashboard" className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/dashboard')}`}>Dashboard</Link>
                            <Link to="/admin/teachers" className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/teachers')}`}>Manage Teachers</Link>
                            <Link to="/admin/students" className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/students')}`}>Manage Students</Link>
                            <Link to="/reports" className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/reports')}`}>Reports</Link>
                        </>
                    )}
                    {user?.role === 'teacher' && (
                        <>
                            <Link to="/teacher/dashboard" className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/teacher/dashboard')}`}>Dashboard</Link>
                            <Link to="/teacher/attendance" className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/teacher/attendance')}`}>Mark Attendance</Link>
                            <Link to="/reports" className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/reports')}`}>My Reports</Link>
                        </>
                    )}
                    {user?.role === 'student' && (
                        <>
                            <Link to="/student/dashboard" className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/student/dashboard')}`}>My Attendance</Link>
                        </>
                    )}
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user?.username}</p>
                            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
