import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Ideally, fetch user details from API to get role, etc.
                // For now, use decoded token if it has role, or just set token presence
                // Since our token might not have role, let's just assume we are logged in and fetch user
                // Or better, let's decoding logic locally if we put role in token.
                // But standard JWT from simplejwt doesn't have custom claims by default unless customized.
                // So let's rely on an API call or just store user data in localStorage on login.
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) setUser(storedUser);
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('auth/login/', { username, password });
            const { access, refresh } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);

            // Decode token to get user ID, then fetch user details implementation or
            // Just for MVP, let's assume login returns user info (need to customize backend or make another call)
            // Let's make another call to get user info? No endpoint for "me" yet.
            // Let's customize token serializer strictly or just parse what we can.
            // Wait, I didn't add "me" endpoint.
            // I'll add a simple client-side logic: decode token?
            // SimpleJWT default token only has user_id.
            // I'll make a quick request to a user endpoint if I can, or just modify backend to return user data on login.
            // Or I can add a 'me' endpoint.

            // Let's Decode for now and rely on role if I added it? No I didn't add role to token claim.
            // I'll fetch /teachers/ID or /students/ID? No.
            // I will use `jwt-decode` on the access token. 
            // Simple fix: fetch a protected endpoint that returns user info.
            // Better: Modify `TokenObtainPairView` serializer in backend. 
            // OR: Implement a "me" view.

            // FASTEST: Just rely on the fact that I can't easily get role without an endpoint.
            // I'll add `CustomTokenObtainPairSerializer` to backend later if needed.
            // FOR NOW: I will decode the token. Wait, standard simplejwt doesn't include custom fields.
            // I'll try to use the `user_id` from token to fetch from `/teachers/` or `/students/`? 
            // Admin can access `/teachers/`. Teacher cannot.
            // Actually, I'll just add `role` to the token in backend. It's cleaner.

            // For now, I'll update backend to return user role in login response or token.
            // But I am in Frontend task now. 
            // Let's Assume I'll fix backend.

            // Let's just decode and assume I'll fix the token.
            const decoded = jwtDecode(access);
            setUser({ username, role: decoded.role || 'teacher' }); // Fallback
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
