import { useEffect, useState } from 'react';
import api from '../api/axios';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get('reports/');
                setReports(response.data);
            } catch (error) {
                console.error('Failed to load reports');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) return <div>Loading reports...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Attendance Reports</h1>

            <div className="bg-white p-6 rounded shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3">Student</th>
                            <th className="p-3 text-center">Total Days</th>
                            <th className="p-3 text-center text-green-600">Present</th>
                            <th className="p-3 text-center text-red-600">Absent</th>
                            <th className="p-3 text-center">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((record, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{record.student}</td>
                                <td className="p-3 text-center">{record.total_days}</td>
                                <td className="p-3 text-center text-green-600 font-bold">{record.present}</td>
                                <td className="p-3 text-center text-red-600 font-bold">{record.absent}</td>
                                <td className="p-3 text-center">
                                    <span className={`px-2 py-1 rounded text-sm font-bold ${record.percentage >= 75 ? 'bg-green-100 text-green-800' :
                                            record.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {record.percentage.toFixed(1)}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;
