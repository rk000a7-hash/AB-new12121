import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const requestOtp = (email) => api.post('/auth/request-otp', { email });
export const verifyOtp = (email, otp) => api.post('/auth/verify-otp', { email, otp });

export const getProducts = () => api.get('/products/');
export const getProduct = (id) => api.get(`/products/${id}`);
export const addProduct = (data) => api.post('/products/', data);

export const getCart = () => api.get('/cart/');
export const addToCart = (product_id, quantity = 1) => api.post('/cart/add', { product_id, quantity });
export const updateCartQuantity = (product_id, quantity) => api.put('/cart/update', { product_id, quantity });
export const removeFromCart = (product_id) => api.delete(`/cart/remove?product_id=${product_id}`);

export default api;
