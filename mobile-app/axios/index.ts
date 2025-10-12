import axios from 'axios';

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

export default api;