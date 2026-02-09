import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Attendance = () => {
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({});

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('students/');
            setStudents(response.data);
            // Initialize attendance data with present by default? or empty
            // Doing nothing is safer, teacher must mark explicitly.
        } catch (error) {
            toast.error('Failed to load students');
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async () => {
        const payload = Object.keys(attendanceData).map(studentId => ({
            student: parseInt(studentId),
            date: date,
            status: attendanceData[studentId]
        }));

        if (payload.length === 0) {
            toast.error("No attendance marked");
            return;
        }

        try {
            await api.post('attendance/mark_bulk/', payload);
            toast.success('Attendance submitted successfully');
            setAttendanceData({}); // Reset or keep? Reset implies next day, but user might want to see. 
            // Better to keep or fetch existing attendance for that day to show "Marked".
            // For MVP, just success message.
        } catch (error) {
            toast.error('Failed to submit attendance');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Mark Attendance</h1>

            <div className="bg-white p-6 rounded shadow mb-6 flex items-center space-x-4">
                <label className="font-bold">Select Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>

            <div className="bg-white p-6 rounded shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3">Roll No</th>
                            <th className="p-3">Name</th>
                            <th className="p-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{student.roll_number}</td>
                                <td className="p-3">{student.name}</td>
                                <td className="p-3 text-center space-x-4">
                                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`status-${student.id}`}
                                            value="present"
                                            checked={attendanceData[student.id] === 'present'}
                                            onChange={() => handleStatusChange(student.id, 'present')}
                                            className="form-radio text-green-600"
                                        />
                                        <span className="text-green-600 font-medium">Present</span>
                                    </label>
                                    <label className="inline-flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`status-${student.id}`}
                                            value="absent"
                                            checked={attendanceData[student.id] === 'absent'}
                                            onChange={() => handleStatusChange(student.id, 'absent')}
                                            className="form-radio text-red-600"
                                        />
                                        <span className="text-red-600 font-medium">Absent</span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold"
                    >
                        Submit Attendance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
