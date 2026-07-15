import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
    const { isAuth, role, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light-cream">
                <div className="spinner-border text-primary-orange" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuth || role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
