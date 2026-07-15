import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [name, setName] = useState(localStorage.getItem('name') || '');
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initial load: Check for existing session in localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        const storedName = localStorage.getItem('name');

        if (storedToken) {
            setToken(storedToken);
            setRole(storedRole);
            setName(storedName);
            setIsAuth(true);
        }
        setLoading(false);
    }, []);

    // Login function: Set state and persist to localStorage
    const login = (token, role, name) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
        
        setToken(token);
        setRole(role);
        setName(name);
        setIsAuth(true);
    };

    // Logout function: Clear state and remove from localStorage
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        
        setToken(null);
        setRole(null);
        setName('');
        setIsAuth(false);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                name,
                isAuth,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
export default AuthProvider;