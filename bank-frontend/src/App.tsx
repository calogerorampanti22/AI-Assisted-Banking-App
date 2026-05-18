import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomBar from './components/BottomBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import LoginHistory from './pages/LoginHistory';
import SavingsGoals from './pages/SavingsGoals';
import PhoneTopUp from './pages/PhoneTopUp';
import PagoPA from './pages/PagoPA';
import Bollettino from './pages/Bollettino';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <Router>
            {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
            <div style={{ paddingBottom: '6rem' }}>
                <Routes>
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
                    />
                    <Route
                        path="/register"
                        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
                    />
                    <Route
                        path="/dashboard"
                        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/transfer"
                        element={isAuthenticated ? <Transfer /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/profile"
                        element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/payments"
                        element={isAuthenticated ? <Payments /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/login-history"
                        element={isAuthenticated ? <LoginHistory /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/savings-goals"
                        element={isAuthenticated ? <SavingsGoals /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/phone-topup"
                        element={isAuthenticated ? <PhoneTopUp /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/pagopa"
                        element={isAuthenticated ? <PagoPA /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/bollettino"
                        element={isAuthenticated ? <Bollettino /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/"
                        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
                    />
                </Routes>
            </div>
            {isAuthenticated && <BottomBar />}
        </Router>
    );
};

export default App;
