import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userId = localStorage.getItem('user_id');
  const role = localStorage.getItem('user_role');

  return userId && role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;
