// myronera-meme-01: the entry is the X post itself. This program copies
// POST.json from the repository root to /output/POST.json, where the gate
// reads the post's address. Nothing else this program writes is scored.
//
// Run it locally: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// (out/POST.json is then byte for byte this directory's POST.json.)

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const POST_URL = /^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/;

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Guard: the gate reads /output/POST.json, so refuse to hand it a bad address
// instead of silently submitting a placeholder or a mistyped URL.
try {
  const parsed = JSON.parse(readFileSync(join(OUTPUT_DIR, 'POST.json'), 'utf8')) as unknown;
  const url = (parsed as { url?: unknown } | null)?.url;
  if (typeof url !== 'string' || !POST_URL.test(url)) {
    console.error(`POST.json does not name a valid X post URL: ${String(url)}`);
    process.exit(1);
  }
} catch (err) {
  console.error(`POST.json failed validation: ${(err as Error).message}`);
  process.exit(1);
}
