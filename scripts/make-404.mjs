#!/usr/bin/env node
/**
 * GitHub Pages SPA: copy index.html → 404.html so refresh on /about etc. still loads the app.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const index = path.join(dist, 'index.html');
const notFound = path.join(dist, '404.html');

if (!fs.existsSync(index)) {
  console.error('dist/index.html not found — run npm run build first');
  process.exit(1);
}

fs.copyFileSync(index, notFound);
console.log('Created dist/404.html for GitHub Pages SPA routing');
