import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({ name: '', roll_number: '', email: '', assigned_teacher: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchStudents();
        fetchTeachers();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('students/');
            setStudents(response.data);
        } catch (error) {
            toast.error('Failed to load students');
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await api.get('teachers/');
            setTeachers(response.data);
        } catch (error) {
            console.error('Failed to load teachers');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.patch(`students/${editId}/`, formData);
                toast.success('Student updated');
            } else {
                await api.post('students/', formData);
                toast.success('Student added');
            }
            setFormData({ name: '', roll_number: '', email: '', assigned_teacher: '' });
            setIsEditing(false);
            setEditId(null);
            fetchStudents();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleEdit = (student) => {
        setFormData({
            name: student.name,
            roll_number: student.roll_number,
            email: student.email,
            assigned_teacher: student.assigned_teacher || ''
        });
        setIsEditing(true);
        setEditId(student.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            try {
                await api.delete(`students/${id}/`);
                toast.success('Student deleted');
                fetchStudents();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Students</h1>

            {/* Form */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" required />
                    <input name="roll_number" value={formData.roll_number} onChange={handleChange} placeholder="Roll Number" className="p-2 border rounded" required />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
                    <select name="assigned_teacher" value={formData.assigned_teacher} onChange={handleChange} className="p-2 border rounded">
                        <option value="">Assign Teacher</option>
                        {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.first_name} {t.last_name} ({t.username})</option>
                        ))}
                    </select>
                    <div className="md:col-span-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            {isEditing ? 'Update Student' : 'Add Student'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(false); setFormData({ name: '', roll_number: '', email: '', assigned_teacher: '' }); }} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-white p-6 rounded shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3">Roll No</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Assigned Teacher</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => {
                            const teacher = teachers.find(t => t.id === student.assigned_teacher);
                            return (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{student.roll_number}</td>
                                    <td className="p-3">{student.name}</td>
                                    <td className="p-3">{student.email}</td>
                                    <td className="p-3">{teacher ? teacher.username : '-'}</td>
                                    <td className="p-3 space-x-2">
                                        <button onClick={() => handleEdit(student)} className="text-blue-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStudents;
