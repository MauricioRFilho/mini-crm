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

  const appointmentDescriptions = [
    'Consulta de rotina',
    'Exame de sangue',
    'Retorno médico',
    'Avaliação cardiológica',
    'Primeira consulta',
    'Acompanhamento pré-natal',
    'Check-up anual',
    'Sessão de fisioterapia',
    'Consulta dermatológica',
    'Atendimento de urgência',
  ];

  const appointmentNotes = [
    'Paciente apresenta melhora no quadro clínico.',
    'Necessário realizar exames complementares.',
    'Medicamento prescrito conforme receita.',
    'Retornar em 15 dias para nova avaliação.',
    'Sem alterações significativas desde a última visita.',
    'Paciente queixa-se de dores leves na região lombar.',
    'Pressão arterial estabilizada.',
    'Seguir com a dieta recomendada pelo nutricionista.',
    'Autorizado início de atividades físicas leves.',
    'Encaminhado para especialista.',
  ];

  // Criar pelo menos 100 atendimentos distribuídos aleatoriamente
  for (let i = 0; i < 120; i++) {
    const randomPatient = createdPatients[Math.floor(Math.random() * createdPatients.length)];
    appointments.push({
      description: appointmentDescriptions[Math.floor(Math.random() * appointmentDescriptions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      notes: appointmentNotes[Math.floor(Math.random() * appointmentNotes.length)],
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
