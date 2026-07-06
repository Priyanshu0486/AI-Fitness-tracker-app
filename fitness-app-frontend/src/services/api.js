import axios from "axios";
const API_BASE_URL = 'https://priyanshu-fitness.duckdns.org/api';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})
api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId) {
        config.headers['X-User-ID'] = userId;
    }
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})
export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityById = (id) => api.get(`/activities/${id}`);
export const getActivityRecommendations = (id) => api.get(`/recommendations/activity/${id}`);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);