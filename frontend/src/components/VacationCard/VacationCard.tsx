import React from 'react';
import type {  VacationCardProps } from '../../types/vacation';
import './VacationCard.css';



const VacationCard: React.FC<VacationCardProps> = ({
    vacation,
    isFollowing,
    isAdmin,
    onFollow,
    onEdit,
    onDelete
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };
    return (
        <div className="vacation-card">
            <div className="card-image-container">
                <img 
                    src={vacation.image} 
                    alt={vacation.name} 
                    className="card-image" 
                />
            </div>
            
            <div className="card-content">
                <div className="card-header">
                    <h3>{vacation.name}</h3>
                    {isAdmin ? (
                        <div className="admin-actions">
                            <button 
                                className="admin-btn edit-btn" 
                                onClick={() => onEdit?.(vacation.id)}
                                title="Edit"
                            >
                                ✎
                            </button>
                            <button 
                                className="admin-btn delete-btn" 
                                onClick={() => onDelete?.(vacation.id)}
                                title="Delete"
                            >
                                🗑
                            </button>
                        </div>
                    ) : (
                        <button 
                            className={`follow-icon ${isFollowing ? 'following' : 'not-following'}`}
                            onClick={() => onFollow(vacation.id)}
                            title={isFollowing ? 'Unfollow' : 'Follow'}
                        >
                            {isFollowing ? '❤' : '♡'}
                        </button>
                    )}
                </div>

                <div className="card-dates">
                    <span>📅 {formatDate(vacation.startDate)}</span>
                    <span>-</span>
                    <span>{formatDate(vacation.endDate)}</span>
                </div>

                <p className="card-description">{vacation.description}</p>

                <div className="card-footer">
                    <div className="card-price">${vacation.price}</div>
                    <div className="followers-count">
                        👥 {vacation.followersCount} followers
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VacationCard;
