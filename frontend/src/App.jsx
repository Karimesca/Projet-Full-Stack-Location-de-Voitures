// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import CarsList from './pages/CarsList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReservationForm from './pages/ReservationForm';
import MyReservations from './pages/MyReservations';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './pages/HomePage';
import EditProfile from './pages/EditProfile'; 
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    const userId = localStorage.getItem('user_id');

    if (userId && userRole === 'admin') {
      navigate('/admin');
    }
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected User Routes */}
        <Route
          path="/reserve/:carId"
          element={
            <PrivateRoute>
              <ReservationForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-reservations"
          element={
            <PrivateRoute>
              <MyReservations />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />

        {/* Admin-only Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
