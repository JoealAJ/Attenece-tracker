import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('dashboard/stats/');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading stats...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.role === 'admin' && (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <h3 className="text-gray-500 text-sm uppercase">Total Students</h3>
                            <p className="text-3xl font-bold text-gray-800">{stats?.total_students || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                            <h3 className="text-gray-500 text-sm uppercase">Total Teachers</h3>
                            <p className="text-3xl font-bold text-gray-800">{stats?.total_teachers || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                            <h3 className="text-gray-500 text-sm uppercase">Total Attendance Records</h3>
                            <p className="text-3xl font-bold text-gray-800">{stats?.total_attendance_records || 0}</p>
                        </div>
                    </>
                )}
                {user.role === 'teacher' && (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <h3 className="text-gray-500 text-sm uppercase">My Students</h3>
                            <p className="text-3xl font-bold text-gray-800">{stats?.my_students || 0}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                            <h3 className="text-gray-500 text-sm uppercase">Marked Attendance</h3>
                            <p className="text-3xl font-bold text-gray-800">{stats?.total_marked || 0}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
