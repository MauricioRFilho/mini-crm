import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/lib/prisma';

describe('Patients Integration Tests', () => {
  let patientId: string;

  it('should create a new patient', async () => {
    const response = await request(app)
      .post('/api/patients')
      .send({
        name: 'John Doe',
        phone: '11999999999',
        email: 'john@example.com'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John Doe');
    patientId = response.body.id;
  });

  it('should list patients with pagination', async () => {
    const response = await request(app).get('/api/patients');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('patients');
    expect(response.body).toHaveProperty('total');
    expect(Array.isArray(response.body.patients)).toBe(true);
    expect(response.body.patients.length).toBeGreaterThan(0);
  });

  it('should get patient details', async () => {
    const response = await request(app).get(`/api/patients/${patientId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(patientId);
  });

  it('should update patient', async () => {
    const response = await request(app)
      .put(`/api/patients/${patientId}`)
      .send({ name: 'John Updated' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('John Updated');
  });

  it('should delete patient', async () => {
    const response = await request(app).delete(`/api/patients/${patientId}`);
    expect(response.status).toBe(204);

    const check = await request(app).get(`/api/patients/${patientId}`);
    expect(check.status).toBe(404);
  });
});
