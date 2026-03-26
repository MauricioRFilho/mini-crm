import { Request, Response } from 'express';
import patientService from '../services/patientService';
import { createPatientSchema, updatePatientSchema } from '../validators/patientValidator';

class PatientController {
  async create(req: Request, res: Response) {
    const data = createPatientSchema.parse(req.body);
    const patient = await patientService.create(data);
    return res.status(201).json(patient);
  }

  async list(req: Request, res: Response) {
    const patients = await patientService.list();
    return res.json(patients);
  }

  async getOne(req: Request, res: Response) {
    const patient = await patientService.findById(req.params.id);
    return res.json(patient);
  }

  async update(req: Request, res: Response) {
    const data = updatePatientSchema.parse(req.body);
    const patient = await patientService.update(req.params.id, data);
    return res.json(patient);
  }

  async delete(req: Request, res: Response) {
    await patientService.delete(req.params.id);
    return res.status(204).send();
  }
}

export default new PatientController();
