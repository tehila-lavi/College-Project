import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './HomePage.css';

const HomePage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleExploreClick = () => {
        if (isAuthenticated) {
            navigate('/vacations');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="home-page">
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <div className="logo-container">
                    <h1 className="site-logo">TravelPlus</h1>
                </div>
                <div className="welcome-text">
                    <h2>Your Dream Vacation Awaits</h2>
                    <p>Discover breathtaking destinations and create unforgettable memories with our curated selection of worldly adventures.</p>
                </div>
                <button className="explore-btn" onClick={handleExploreClick}>
                    Explore Vacations
                    <span className="arrow-icon">↓</span>
                </button>
            </div>
        </div>
    );
};

export default HomePage;
