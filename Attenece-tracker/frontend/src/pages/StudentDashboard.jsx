import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ attendance_percentage: 0, total_days: 0 });
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const [statsRes, attendanceRes] = await Promise.all([
                    api.get('dashboard-stats/'),
                    api.get('attendance/')
                ]);
                setStats(statsRes.data);
                setAttendance(attendanceRes.data);
            } catch (error) {
                console.error('Error fetching student data:', error);
                toast.error('Failed to load attendance data');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    if (loading) return <div className="p-6">Loading dashboard...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Attendance Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Attendance Percentage</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.attendance_percentage}%</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Days Logged</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_days}</p>
                </div>
            </div>

            {/* Attendance Log Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Attendance Logs</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Marked By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {attendance.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{record.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${record.status === 'present'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-rose-100 text-rose-700'
                                            }`}>
                                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{record.marked_by_name || 'N/A'}</td>
                                </tr>
                            ))}
                            {attendance.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500 italic">
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
