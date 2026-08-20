import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const token =
        localStorage.getItem('authToken');
    const user =
        JSON.parse(
            localStorage.getItem('user') || 'null'
        );
    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }
    if (
        !user ||
        (
            user.role !== 'admin' &&
            user.isAdmin !== true
        )
    ) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }
    return <Outlet />;
};

export default AdminRoute;
