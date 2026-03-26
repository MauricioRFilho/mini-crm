import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.patient.count();
  console.log(`TOTAL_PATIENTS_IN_DB: ${count}`);
  
  const patients = await prisma.patient.findMany({ take: 5 });
  console.log('FIRST_5_PATIENTS:', JSON.stringify(patients, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
