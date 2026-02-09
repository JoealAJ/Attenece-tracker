import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            toast.success('Login successful');
            // Navigation happens in AuthContext or here based on role?
            // AuthContext sets user. We can check user here or let useEffect handle it?
            // Better handle it here after await.
            // But wait, user state might not be updated immediately if it relies on async.
            // However, we decoded token in login(), so we know the role.
            // Let's rely on the return value of login if I updated it to return role?
            // My login function returns true.
            // I should get the role from the token again or let the AuthContext redirect?
            // Let's just redirect to root '/' and let a text redirector handle it, 
            // OR decode here too.
            // OR just navigate to /login and let App's effect redirect if logged in.
            // Actually, best is:
            navigate('/');
        } catch (error) {
            toast.error('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Student Attendance Tracker</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>
                    <div className="text-center text-sm text-gray-500 mt-4">
                        Demo: admin/admin123 or teacher1/teacher123
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
