import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = (Component) => {
    return (props) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.access) {
            return <Navigate to="/login" />;
        }
        return <Component {...props} />;
    };
};

export default AuthGuard;
