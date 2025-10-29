// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ruta correcta según tu NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
