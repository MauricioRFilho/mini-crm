import { z } from 'zod';

export const createPatientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  phone: z.string().min(8, 'Telefone inválido'),
  email: z.string().email('E-mail inválido').optional(),
});

export const updatePatientSchema = createPatientSchema.partial();
