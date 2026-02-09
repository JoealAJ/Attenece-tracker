import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ManageTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({ username: '', password: '', email: '', first_name: '', last_name: '', phone: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await api.get('teachers/');
            setTeachers(response.data);
        } catch (error) {
            toast.error('Failed to load teachers');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.patch(`teachers/${editId}/`, formData);
                toast.success('Teacher updated');
            } else {
                await api.post('teachers/', { ...formData, role: 'teacher' });
                toast.success('Teacher added');
            }
            setFormData({ username: '', password: '', email: '', first_name: '', last_name: '', phone: '' });
            setIsEditing(false);
            setEditId(null);
            fetchTeachers();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleEdit = (teacher) => {
        setFormData({
            username: teacher.username,
            email: teacher.email,
            first_name: teacher.first_name,
            last_name: teacher.last_name,
            phone: teacher.phone,
            password: '' // Don't fill password
        });
        setIsEditing(true);
        setEditId(teacher.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
            try {
                await api.delete(`teachers/${id}/`);
                toast.success('Teacher deleted');
                fetchTeachers();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Teachers</h1>

            {/* Form */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="p-2 border rounded" required disabled={isEditing} />
                    {!isEditing && <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="p-2 border rounded" required />}
                    <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="p-2 border rounded" />
                    <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="p-2 border rounded" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="p-2 border rounded" />
                    <div className="md:col-span-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            {isEditing ? 'Update Teacher' : 'Add Teacher'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(false); setFormData({ username: '', password: '', email: '', first_name: '', last_name: '', phone: '' }); }} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
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
                            <th className="p-3">Name</th>
                            <th className="p-3">Username</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map(teacher => (
                            <tr key={teacher.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{teacher.first_name} {teacher.last_name}</td>
                                <td className="p-3">{teacher.username}</td>
                                <td className="p-3">{teacher.email}</td>
                                <td className="p-3">{teacher.phone}</td>
                                <td className="p-3 space-x-2">
                                    <button onClick={() => handleEdit(teacher)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageTeachers;
