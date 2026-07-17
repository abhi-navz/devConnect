import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ensures the httpOnly JWT cookie is sent with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;