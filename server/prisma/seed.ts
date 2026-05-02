import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import path from 'node:path';

import { seedDirections } from './seeders/directions';
import { seedInterviewFile } from './seeders/interview-file';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Начинаем сидинг...\n');

  await seedDirections(prisma);

  await seedInterviewFile(prisma, path.join('..', 'направления', 'java',     'junior.txt'), 'java',     'JUNIOR');
  await seedInterviewFile(prisma, path.join('..', 'направления', 'python',   'junior.txt'), 'python',   'JUNIOR');
  await seedInterviewFile(prisma, path.join('..', 'направления', 'php',      'junior.txt'), 'php',      'JUNIOR');
  await seedInterviewFile(prisma, path.join('..', 'направления', 'qa',       'junior.txt'), 'qa',       'JUNIOR');
  await seedInterviewFile(prisma, path.join('..', 'направления', 'frontend', 'junior.txt'), 'frontend', 'JUNIOR');

  console.log('\n🎉 Сидинг завершён');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сидинга:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
