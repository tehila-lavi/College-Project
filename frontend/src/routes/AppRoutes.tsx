import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import VacationsList from '../pages/VacationsList/VacationsList';
import ReportsPage from '../pages/ReportsPage/ReportsPage';
import HomePage from '../pages/HomePage/HomePage';
import Navbar from '../components/layout/Navbar/Navbar';
import { AuthProvider } from '../context/AuthContext';

export const AppRoutes = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <main style={{ marginTop: '70px' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/vacations" element={<VacationsList />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        {/* Catch all - Redirect to home or 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </AuthProvider>
    );
};
