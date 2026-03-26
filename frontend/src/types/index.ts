export type Patient = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  _count?: {
    appointments: number;
  };
};

export type AppointmentStatus = 'AGUARDANDO' | 'EM_ATENDIMENTO' | 'FINALIZADO';

export type Appointment = {
  id: string;
  description: string;
  status: AppointmentStatus;
  notes?: string;
  patientId: string;
  patient?: Patient;
  createdAt: string;
};
