import axios from 'axios';

// Base URL of your backend API
const API_BASE_URL = 'http://localhost:3000'; // Change if your backend uses a different port

// Create an Axios instance
const api = axios.create({
baseURL: API_BASE_URL,
headers: {
'Content-Type': 'application/json'
}
});

// Cars Endpoints
export const getCars = () => api.get('/cars');
export const getCarById = (id) => api.get(`/cars/${id}`);
export const createCar = (carData) => api.post('/cars', carData);
export const updateCar = (id, carData) => api.put(`/cars/${id}`, carData);
export const deleteCar = (id) => api.delete(`/cars/${id}`);

// Users Endpoints
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Export the axios instance if needed elsewhere
export default api;