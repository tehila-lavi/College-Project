import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        setIsOpen(false);
        setIsDropdownOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // Get initials for Avatar
    const getInitials = () => {
        const first = user?.firstName?.trim().charAt(0) || '';
        const last = user?.lastName?.trim().charAt(0) || '';
        const initials = (first + last).toUpperCase();
        return initials || '??';
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-content">
                <NavLink to="/" className="nav-logo">
                    TravelPlus
                </NavLink>

                <button className="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                        Home
                    </NavLink>

                    {isAuthenticated && (
                        <NavLink 
                            to="/vacations" 
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            Vacations
                        </NavLink>
                    )}

                    {!isAuthenticated ? (
                        <>
                            <NavLink 
                                to="/login" 
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                Login
                            </NavLink>
                            <NavLink 
                                to="/register" 
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                Register
                            </NavLink>
                        </>
                    ) : (
                        <div className="auth-section">
                            {isAdmin && (
                                <NavLink 
                                    to="/reports" 
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    Reports
                                </NavLink>
                            )}
                            
                            <div className="avatar-container">
                                <div className="avatar-circle" onClick={toggleDropdown}>
                                    {getInitials()}
                                </div>
                                
                                {isDropdownOpen && (
                                    <div className="user-dropdown">
                                        <div className="user-info">
                                            <p className="user-name">{user.firstName} {user.lastName}</p>
                                        </div>
                                        <hr />
                                        <button className="dropdown-logout-btn" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
