import axios from 'axios';
import { Concert, Reservation } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Concerts API
export const concertApi = {
  getAll: async () => {
    const response = await api.get<Concert[]>('/concerts');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<Concert>(`/concerts/${id}`);
    return response.data;
  },
  
  create: async (data: { name: string; description: string; totalSeats: number }) => {
    const response = await api.post<Concert>('/concerts', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Concert>) => {
    const response = await api.patch<Concert>(`/concerts/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/concerts/${id}`);
  },
};

// Reservations API
export const reservationApi = {
  getAll: async () => {
    const response = await api.get<Reservation[]>('/reservations');
    return response.data;
  },
  
  getMyReservations: async () => {
    const response = await api.get<Reservation[]>('/reservations/my');
    return response.data;
  },
  
  create: async (concertId: string) => {
    const response = await api.post<Reservation>('/reservations', { concertId });
    return response.data;
  },
  
  cancel: async (id: string) => {
    const response = await api.patch<Reservation>(`/reservations/${id}/cancel`);
    return response.data;
  },
};

export default api;
