import axios from 'axios';

// Copilot create a axios instance using my api base url from env 
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