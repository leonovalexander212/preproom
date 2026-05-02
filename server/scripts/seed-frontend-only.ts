import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import path from 'node:path';
import { seedInterviewFile } from '../prisma/seeders/interview-file';

// Точечный сид только для frontend, чтобы не перезаписать dedup-правки
// в уже обработанных python/php/qa.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Сидим только frontend\n');
  await seedInterviewFile(
    prisma,
    path.join('..', 'направления', 'frontend', 'junior.txt'),
    'frontend',
    'JUNIOR',
  );
  console.log('\n✓ frontend засеян');
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
