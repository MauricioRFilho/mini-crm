import prisma from '../lib/prisma';
import { AppError } from '../errors/AppError';
import { AppointmentStatus } from '@prisma/client';

const STATUS_FLOW: Record<AppointmentStatus, AppointmentStatus | null> = {
  [AppointmentStatus.AGUARDANDO]: AppointmentStatus.EM_ATENDIMENTO,
  [AppointmentStatus.EM_ATENDIMENTO]: AppointmentStatus.FINALIZADO,
  [AppointmentStatus.FINALIZADO]: null,
};

class AppointmentService {
  async create(data: { description: string, patientId: string, notes?: string }) {
    // Verificar se paciente existe
    const patient = await prisma.patient.findUnique({ where: { id: data.patientId } });
    if (!patient) throw new AppError('Paciente não encontrado', 404);

    return prisma.appointment.create({
      data: {
        ...data,
        status: AppointmentStatus.AGUARDANDO
      }
    });
  }

  async list(filters?: { status?: AppointmentStatus; patientId?: string }, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where: filters,
        include: { patient: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.appointment.count({ where: filters })
    ]);

    return {
      appointments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { patient: true },
    });
    if (!appointment) throw new AppError('Atendimento não encontrado', 404);
    return appointment;
  }

  async update(id: string, data: { description?: string; notes?: string }) {
    await this.findById(id);
    return prisma.appointment.update({
      where: { id },
      data,
    });
  }

  async advanceStatus(id: string) {
    const appointment = await this.findById(id);
    const nextStatus = STATUS_FLOW[appointment.status];

    if (!nextStatus) {
      throw new AppError('Este atendimento já está FINALIZADO e não pode mais avançar.', 422);
    }

    return prisma.appointment.update({
      where: { id },
      data: { status: nextStatus },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return prisma.appointment.delete({ where: { id } });
  }
}

export default new AppointmentService();
