// lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para detectar respuestas no JSON
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Si el servidor responde con HTML (404, 500, etc.)
      if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
        console.error('Respuesta HTML recibida (probablemente 404 o error):', error.response.data);
        return Promise.reject(new Error('La ruta de API no existe o devolvió HTML'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;