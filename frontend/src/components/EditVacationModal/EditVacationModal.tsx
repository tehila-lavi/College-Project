import React, { useState, useEffect } from 'react';
import type { Vacation, AddVacationPayload } from '../../types/vacation';
import './EditVacationModal.css';

interface EditVacationModalProps {
    mode: 'add' | 'edit';
    vacation?: Vacation | null;
    onClose: () => void;
    onSave: (data: AddVacationPayload, id?: string) => Promise<void>;
}

const EditVacationModal: React.FC<EditVacationModalProps> = ({ mode, vacation, onClose, onSave }) => {
    

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const [formData, setFormData] = useState<AddVacationPayload>({
        name: vacation?.name || '',
        description: vacation?.description || '',
        startDate: vacation?.startDate ? new Date(vacation.startDate).toISOString().split('T')[0] : today,
        endDate: vacation?.endDate ? new Date(vacation.endDate).toISOString().split('T')[0] : tomorrow,
        price: vacation?.price || 0,
        image: vacation?.image || '',
    });

    
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: AddVacationPayload) => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);
        
        try {
            
            if (new Date(formData.startDate!) > new Date(formData.endDate!)) {
                throw new Error('End date cannot be before start date.');
            }
            if ((formData.price as number) < 0 || (formData.price as number) > 10000) {
                throw new Error('Price must be between $0 and $10,000.');
            }

            if (mode === 'edit' && vacation) {
                await onSave(formData, vacation.id);
            } else {
                await onSave(formData);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to save changes.');
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{mode === 'add' ? 'Add New Vacation' : 'Edit Vacation'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                {error && <div className="modal-error">{error}</div>}
                
                <form onSubmit={handleSubmit} className="edit-vacation-form">
                    <div className="form-group">
                        <label htmlFor="name">Destination Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Price ($)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                min="0"
                                max="10000"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">Image URL</label>
                            <input
                                type="url"
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={isSaving}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={isSaving}>
                            {isSaving ? 'Saving...' : mode === 'add' ? 'Add Vacation' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVacationModal;
