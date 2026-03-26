import { z } from 'zod';
import { AppointmentStatus } from '@prisma/client';

export const createAppointmentSchema = z.object({
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  patientId: z.string().uuid('ID de paciente inválido'),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  description: z.string().optional(),
  notes: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(AppointmentStatus),
});
