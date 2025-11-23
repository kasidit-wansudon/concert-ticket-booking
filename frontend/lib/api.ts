import axios from 'axios';
import { Concert, Reservation } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

// Add interceptor to inject User ID
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

// Concerts API
export const concertApi = {
  getAll: async () => {
    const response = await api.get<Concert[]>('/api/concerts');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Concert>(`/api/concerts/${id}`);
    return response.data;
  },

  create: async (data: Partial<Concert>) => {
    const response = await api.post<Concert>('/api/concerts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Concert>) => {
    const response = await api.patch<Concert>(`/api/concerts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/api/concerts/${id}`);
  },
};

// Reservations API
export const reservationApi = {
  getAll: async () => {
    const response = await api.get<Reservation[]>('/api/reservations');
    return response.data;
  },

  getMyReservations: async () => {
    const response = await api.get<Reservation[]>('/api/reservations/my');
    return response.data;
  },

  create: async (concertId: string) => {
    console.log('Creating reservation for concert:', concertId);
    const response = await api.post<Reservation>('/api/reservations', { concertId });
    return response.data;
  },

  cancel: async (id: string) => {
    await api.patch(`/api/reservations/${id}/cancel`);
  },
};

export const userApi = {
  login: async (name: string) => {
    const response = await api.post('/api/users/login', { name });
    return response.data;
  },
};

export default api;
