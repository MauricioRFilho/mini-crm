import { PrismaClient } from '@prisma/client';
import { fakerPT_BR as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Checking for initial data...');

  const existingCount = await prisma.patient.count();
  if (existingCount > 0) {
    console.log('⏩ Database already has data. Skipping seed.');
    return;
  }

  console.log('🌱 Seeding database...');

  const patients = [];

  // Criar 100 pacientes
  for (let i = 0; i < 100; i++) {
    patients.push({
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email().toLowerCase(),
    });
  }

  const createdPatients = await Promise.all(
    patients.map(p => prisma.patient.create({ data: p }))
  );

  console.log(`✅ Created ${createdPatients.length} patients.`);

  const appointments = [];
  const statuses = ['AGUARDANDO', 'EM_ATENDIMENTO', 'FINALIZADO'];

  // Criar pelo menos 100 atendimentos distribuídos aleatoriamente
  for (let i = 0; i < 120; i++) {
    const randomPatient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
    appointments.push({
      description: faker.lorem.sentence(),
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      notes: faker.lorem.paragraph(),
      patientId: randomPatient.id,
    });
  }

  const createdAppointments = await Promise.all(
    appointments.map(a => prisma.appointment.create({ data: a }))
  );

  console.log(`✅ Created ${createdAppointments.length} appointments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
