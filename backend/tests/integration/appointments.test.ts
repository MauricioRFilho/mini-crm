import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/lib/prisma';

describe('Appointments Integration Tests', () => {
  let patientId: string;
  let appointmentId: string;

  beforeAll(async () => {
    const patient = await request(app)
      .post('/api/patients')
      .send({ name: 'Test Patient', phone: '12345678' });
    patientId = patient.body.id;
  });

  it('should create appointment with default status AGUARDANDO', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .send({
        description: 'Primeira consulta',
        patientId
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('AGUARDANDO');
    appointmentId = response.body.id;
  });

  it('should advance status to EM_ATENDIMENTO', async () => {
    const response = await request(app)
      .patch(`/api/appointments/${appointmentId}/status`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('EM_ATENDIMENTO');
  });

  it('should advance status to FINALIZADO', async () => {
    const response = await request(app)
      .patch(`/api/appointments/${appointmentId}/status`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('FINALIZADO');
  });

  it('should fail to advance status once FINALIZADO', async () => {
    const response = await request(app)
      .patch(`/api/appointments/${appointmentId}/status`);

    expect(response.status).toBe(422);
    expect(response.body.error).toMatch(/FINALIZADO/);
  });

  it('should fail to create appointment with invalid patient', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .send({
        description: 'Consulta inválida',
        patientId: '00000000-0000-0000-0000-000000000000'
      });

    expect(response.status).toBe(404);
  });
});
