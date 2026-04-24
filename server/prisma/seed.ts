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

  await seedInterviewFile(prisma, path.join('data', 'python.txt'), 'python');

  // В будущем просто добавляешь строки:
  // await seedInterviewFile(prisma, path.join('data', 'java.txt'),   'java');
  // await seedInterviewFile(prisma, path.join('data', 'csharp.txt'), 'csharp');

  console.log('\n🎉 Сидинг завершён');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сидинга:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());