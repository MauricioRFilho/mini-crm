import { Request, Response } from 'express';
import appointmentService from '../services/appointmentService';
import { createAppointmentSchema, updateAppointmentSchema } from '../validators/appointmentValidator';
import { AppointmentStatus } from '@prisma/client';

class AppointmentController {
  async create(req: Request, res: Response) {
    const data = createAppointmentSchema.parse(req.body);
    const appointment = await appointmentService.create(data);
    return res.status(201).json(appointment);
  }

  async list(req: Request, res: Response) {
    const { status, patientId, page, limit } = req.query;
    const result = await appointmentService.list(
      {
        status: status as AppointmentStatus,
        patientId: patientId as string,
      },
      Number(page || 1),
      Number(limit || 10)
    );
    return res.json(result);
  }

  async getOne(req: Request, res: Response) {
    const appointment = await appointmentService.findById(req.params.id);
    return res.json(appointment);
  }

  async update(req: Request, res: Response) {
    const data = updateAppointmentSchema.parse(req.body);
    const appointment = await appointmentService.update(req.params.id, data);
    return res.json(appointment);
  }

  async advanceStatus(req: Request, res: Response) {
    const appointment = await appointmentService.advanceStatus(req.params.id);
    return res.json(appointment);
  }

  async delete(req: Request, res: Response) {
    await appointmentService.delete(req.params.id);
    return res.status(204).send();
  }
}

export default new AppointmentController();
