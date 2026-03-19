import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'react-charts';
import { useAuth } from '../../context/AuthContext';
import vacationService from '../../services/vacationService';
import type { Vacation } from '../../types/vacation';
import './ReportsPage.css';

type ChartData = {
    destination: string;
    followers: number;
};

type SeriesObj = {
    label: string;
    data: ChartData[];
};

const ReportsPage: React.FC = () => {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/vacations', { replace: true });
        }
    }, [isAdmin, navigate]);

    useEffect(() => {
        const fetchVacations = async () => {
            try {
                setLoading(true);
                const data = await vacationService.getAllVacations();
                setVacations(data.filter(v => v.followersCount > 0));
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch tracking data.');
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) fetchVacations();
    }, [isAdmin]);

    const chartData = useMemo<SeriesObj[]>(() => {
        if (vacations.length === 0) return [];
        
        return [
            {
                label: 'Followers',
                data: vacations.map(v => ({
                    destination: v.name,
                    followers: Number(v.followersCount)
                }))
            }
        ];
    }, [vacations]);

    const primaryAxis = useMemo(
        () => ({
            getValue: (datum: ChartData) => datum.destination,
            position: 'bottom' as const,
        }),
        []
    );

    const secondaryAxes = useMemo(
        () => [
            {
                getValue: (datum: ChartData) => datum.followers,
                position: 'left' as const,
                elementType: 'bar' as const,
                min: 0,
                formatters: {
                    scale: (val: number) => Math.floor(val).toString(),
                }
            },
        ],
        []
    );

    if (!isAdmin) return null;

    return (
        <div className="reports-container">
            <header className="reports-header">
                <h1>Destination Popularity Report</h1>
                <p>Tracking the most loved vacations by our users.</p>
            </header>

            {loading ? (
                <div className="reports-loading">
                    <div className="spinner"></div>
                    <p>Aggregating follower data...</p>
                </div>
            ) : error ? (
                <div className="reports-error">{error}</div>
            ) : chartData.length === 0 ? (
                <div className="reports-empty">
                    <p>No vacations currently have followers. Check back later!</p>
                </div>
            ) : (
                <div className="chart-wrapper">
                    <Chart
                        options={{
                            data: chartData,
                            primaryAxis,
                            secondaryAxes,
                            dark: false,
                            defaultColors: ['#2196f3']
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ReportsPage;
