import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../utils/storage';
import vacationService from '../../services/vacationService';
import socketService from '../../services/socketService';
import type { Vacation, UpdateVacationPayload, AddVacationPayload } from '../../types/vacation';
import VacationCard from '../../components/VacationCard/VacationCard';
import EditVacationModal from '../../components/EditVacationModal/EditVacationModal';
import './VacationsList.css';

const VacationsList: React.FC = () => {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingVacation, setEditingVacation] = useState<Vacation | null>(null);
    const [isAddingVacation, setIsAddingVacation] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const { isAdmin, logout } = useAuth();

    useEffect(() => {
        fetchVacations();

        socketService.connect();

        const handleVacationAdded = (newVac: any) => {
            const mapped = {
                ...newVac,
                id: newVac._id || newVac.id,
                isFollowed: false
            };
            setVacations(prev => {
                if (prev.some(v => v.id === mapped.id)) return prev;
                return [...prev, mapped];
            });
        };

        const handleVacationUpdated = (updatedVac: any) => {
            const upId = updatedVac._id || updatedVac.id;
            setVacations(prev => prev.map(v => {
                if (v.id === upId) {
                    return { ...v, ...updatedVac, id: upId };
                }
                return v;
            }));
        };

        const handleVacationDeleted = (deletedId: string) => {
            setVacations(prev => prev.filter(v => v.id !== deletedId));
        };

        socketService.on('vacation_added', handleVacationAdded);
        socketService.on('vacation_updated', handleVacationUpdated);
        socketService.on('vacation_deleted', handleVacationDeleted);

        return () => {
            socketService.off('vacation_added', handleVacationAdded);
            socketService.off('vacation_updated', handleVacationUpdated);
            socketService.off('vacation_deleted', handleVacationDeleted);
            socketService.disconnect();
        };
    }, []);

    const fetchVacations = async () => {
        try {
            setLoading(true);
            const data = await vacationService.getAllVacations();
            
            const followedIds = storage.getFollowedVacations();
            const mappedData = data.map(v => ({
                ...v,
                isFollowed: followedIds.includes(v.id || (v as any)._id)
            }));
            
            setVacations(mappedData);
            setError(null);
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
                logout();
                setError(null);
            } else {
                setError(err.message || 'Failed to fetch vacations');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your next adventure...</p>
            </div>
        );
    }

    const handleFollow = async (id: string) => {
        let isNowFollowing = false;
        
        setVacations(prevVacations => 
            prevVacations.map(v => {
                if (v.id === id) {
                    isNowFollowing = !v.isFollowed;
                    
                    if (isNowFollowing) {
                        storage.addFollowedVacation(id);
                    } else {
                        storage.removeFollowedVacation(id);
                    }
                    
                    return {
                        ...v,
                        isFollowed: isNowFollowing,
                        followersCount: Number(v.followersCount) + (isNowFollowing ? 1 : -1)
                    };
                }
                
                return v;
            })
        );
        
        try {
            await vacationService.followVacation(id);
        } catch (err: any) {
            const isUnauthorized = err.response?.status === 401 || (err.message && err.message.includes('401'));
            
            if (isUnauthorized) {
                logout(); 
                navigate('/login');
            } else {
                alert(err.message || 'Failed to update follow status');
                fetchVacations();
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this vacation?')) return;
        
        try {
            await vacationService.deleteVacation(id);
            setVacations(prev => prev.filter(v => v.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleEdit = (id: string) => {
        const vacationToEdit = vacations.find(v => v.id === id);
        if (vacationToEdit) {
            setEditingVacation(vacationToEdit);
        }
    };

    const handleSaveEdit = async (updatedData: AddVacationPayload, id?: string) => {
        try {
            if (!id) return;
            const updatedVacation = await vacationService.updateVacation(id, updatedData as UpdateVacationPayload);
            
            setVacations(prev => prev.map(v => v.id === id ? { ...v, ...updatedVacation } : v));
            
            setEditingVacation(null);
        } catch (err: any) {
            throw err;
        }
    };

    const handleSaveNew = async (newData: AddVacationPayload) => {
        try {
            const newlyCreatedVacation = await vacationService.addVacation(newData);
            
            const mappedNewItem = {
                ...newlyCreatedVacation,
                id: newlyCreatedVacation.id || (newlyCreatedVacation as any)._id,
                isFollowed: false
            };

            setVacations(prev => {
                if (prev.some(v => v.id === mappedNewItem.id)) return prev;
                return [...prev, mappedNewItem];
            });
            setIsAddingVacation(false);
        } catch (err: any) {
            throw err;
        }
    };

    return (
        <div className="vacations-list-container">
            <header className="list-header">
                <h1>Vacation Destinations</h1>
                {isAdmin && (
                    <button className="add-vacation-btn" onClick={() => setIsAddingVacation(true)}>
                        <span>+</span> Add New Vacation
                    </button>
                )}
            </header>

            {error && <div className="error-message" style={{textAlign: 'center', marginBottom: '2rem'}}>{error}</div>}

            <div className="vacations-grid">
                {vacations.map((vacation) => (
                    <VacationCard
                        key={vacation.id}
                        vacation={vacation}
                        isFollowing={vacation.isFollowed || false}
                        isAdmin={isAdmin}
                        onFollow={handleFollow}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))}
            </div>

            {vacations.length === 0 && !error && (
                <div style={{textAlign: 'center', marginTop: '3rem', color: '#666'}}>
                    <p>No vacations found. Check back later!</p>
                </div>
            )}

            {editingVacation && (
                <EditVacationModal
                    mode="edit"
                    vacation={editingVacation}
                    onClose={() => setEditingVacation(null)}
                    onSave={handleSaveEdit}
                />
            )}

            {isAddingVacation && (
                <EditVacationModal
                    mode="add"
                    onClose={() => setIsAddingVacation(false)}
                    onSave={handleSaveNew}
                />
            )}
        </div>
    );
};

export default VacationsList;
