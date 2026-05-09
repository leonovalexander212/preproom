/**
 * Скачивает YouTube-превью всех интервью в public/thumbs/
 *
 * Запуск:  npx tsx scripts/download-thumbs.ts
 *
 * ВАЖНО: запускать с включённым VPN (нужен доступ к img.youtube.com).
 * После скачивания превью раздаются как статика — VPN не нужен.
 */

import { prisma } from '../src/lib/prisma';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const THUMBS_DIR = join(__dirname, '..', 'public', 'thumbs');

function extractVideoId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

async function main() {
  if (!existsSync(THUMBS_DIR)) mkdirSync(THUMBS_DIR, { recursive: true });

  const interviews = await prisma.interview.findMany({ select: { videoUrl: true } });
  const ids = new Set<string>();

  for (const iv of interviews) {
    const id = extractVideoId(iv.videoUrl);
    if (id) ids.add(id);
  }

  console.log(`\n📥 Найдено ${ids.size} уникальных видео\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const id of ids) {
    const filePath = join(THUMBS_DIR, `${id}.jpg`);

    if (existsSync(filePath)) {
      skipped++;
      continue;
    }

    try {
      const resp = await fetch(`https://img.youtube.com/vi/${id}/mqdefault.jpg`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const buf = Buffer.from(await resp.arrayBuffer());
      writeFileSync(filePath, buf);
      downloaded++;
      console.log(`  ✅ ${id}`);
    } catch (e: any) {
      failed++;
      console.log(`  ❌ ${id} — ${e.message}`);
    }
  }

  console.log(`\n${'═'.repeat(40)}`);
  console.log(`  Скачано: ${downloaded}, пропущено: ${skipped}, ошибок: ${failed}`);
  console.log(`${'═'.repeat(40)}\n`);
}

main();
