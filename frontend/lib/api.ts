import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
});

export const AuthApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }).then((res) => res.data),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }).then((res) => res.data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }).then((res) => res.data),
};

export const UsersApi = {
  me: () => api.get('/users/me').then((res) => res.data),
};

export const VehiclesApi = {
  list: () => api.get('/vehicles').then((res) => res.data),
  create: (payload: any) => api.post('/vehicles', payload).then((res) => res.data),
  get: (id: string) => api.get(`/vehicles/${id}`).then((res) => res.data),
  update: (id: string, payload: any) => api.put(`/vehicles/${id}`, payload).then((res) => res.data),
  remove: (id: string) => api.delete(`/vehicles/${id}`).then((res) => res.data),
};

export const ExpensesApi = {
  listForVehicle: (vehicleId: string, params?: Record<string, string>) =>
    api.get(`/vehicles/${vehicleId}/expenses`, { params }).then((res) => res.data),
  createForVehicle: (vehicleId: string, payload: any) =>
    api.post(`/vehicles/${vehicleId}/expenses`, payload).then((res) => res.data),
  get: (id: string) => api.get(`/expenses/${id}`).then((res) => res.data),
};

export const RemindersApi = {
  listForVehicle: (vehicleId: string) => api.get(`/vehicles/${vehicleId}/reminders`).then((res) => res.data),
  createForVehicle: (vehicleId: string, payload: any) =>
    api.post(`/vehicles/${vehicleId}/reminders`, payload).then((res) => res.data),
  complete: (id: string) => api.patch(`/reminders/${id}/complete`).then((res) => res.data),
};

export const AIAnalysisApi = {
  analyzeVehicle: (payload: { vehicleId: string; timeRange?: { start?: string; end?: string } }) =>
    api.post('/ai/analysis/vehicle', payload).then((res) => res.data),
};

export const SubscriptionApi = {
  getMine: () => api.get('/subscription/me').then((res) => res.data),
  changePlan: (plan: string) => api.post('/subscription/change-plan', { plan }).then((res) => res.data),
};

export default api;
