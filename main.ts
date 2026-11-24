// myronera-meme-01: the entry is the X post itself. This program copies
// POST.json from the repository root to /output/POST.json, where the gate
// reads the post's address. Nothing else this program writes is scored.
//
// Run it locally: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// (out/POST.json is then byte for byte this directory's POST.json.)

import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
