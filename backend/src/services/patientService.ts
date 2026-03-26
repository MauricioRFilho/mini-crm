import prisma from '../lib/prisma';
import { AppError } from '../errors/AppError';

interface PatientData {
  name: string;
  phone: string;
  email?: string;
}

class PatientService {
  async create(data: PatientData) {
    return prisma.patient.create({ data });
  }

  async list(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { appointments: true } } },
      }),
      prisma.patient.count(),
    ]);

    return { patients, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { appointments: true },
    });
    if (!patient) throw new AppError('Paciente não encontrado', 404);
    return patient;
  }

  async update(id: string, data: Partial<PatientData>) {
    await this.findById(id);
    return prisma.patient.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return prisma.patient.delete({ where: { id } });
  }
}

export default new PatientService();
