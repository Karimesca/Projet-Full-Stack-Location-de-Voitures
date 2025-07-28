// src/services/api.js
import axios from 'axios';

// For development, use localhost. For production, replace with your actual API URL
const API_BASE_URL = 'http://localhost:3000'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    // Handle token expiration
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

// === Cars Endpoints ===
export const getCars = () => api.get('/cars');
export const getCarById = (id) => api.get(`/cars/${id}`);
export const createCar = (carData) => api.post('/cars', carData);
export const updateCar = (id, carData) => api.put(`/cars/${id}`, carData);
export const patchCar = (id, partialData) => api.patch(`/cars/${id}`, partialData);
export const deleteCar = (id) => api.delete(`/cars/${id}`);

// === Users Endpoints ===
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// === Reservations Endpoints ===
export const getReservations = () => api.get('/reservations');
export const createReservation = (reservationData) => api.post('/reservations', reservationData); // Updated to remove manual token handling
export const updateReservation = (id, reservationData) => api.put(`/reservations/${id}`, reservationData);
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);

// === Authentication Endpoint ===
export const login = (email, password) => api.post('/login', { email, password });

export default api;
