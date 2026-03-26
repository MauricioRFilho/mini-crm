import prisma from '../src/lib/prisma';
import { beforeAll, afterAll } from 'vitest';

beforeAll(async () => {
  // Poderia limpar o banco aqui se necessário
});

afterAll(async () => {
  await prisma.$disconnect();
});
