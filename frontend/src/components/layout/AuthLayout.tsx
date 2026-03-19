import React from 'react';
import type { ReactNode } from "react";

import './AuthLayout.css';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
