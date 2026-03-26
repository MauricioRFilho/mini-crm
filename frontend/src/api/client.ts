import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Patients
export const getPatients = () => api.get('/patients').then(r => r.data);
export const createPatient = (data: any) => api.post('/patients', data).then(r => r.data);
export const deletePatient = (id: string) => api.delete(`/patients/${id}`);

// Appointments
export const getAppointments = (filters?: any) => api.get('/appointments', { params: filters }).then(r => r.data);
export const createAppointment = (data: any) => api.post('/appointments', data).then(r => r.data);
export const advanceAppointmentStatus = (id: string) => api.patch(`/appointments/${id}/status`).then(r => r.data);
export const deleteAppointment = (id: string) => api.delete(`/appointments/${id}`);

export default api;
