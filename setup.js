#!/usr/bin/env node
/**
 * TransRota — Setup inicial
 * Executa: node setup.js  (ou: pnpm setup)
 *
 * O que faz:
 *  1. Verifica pré-requisitos (Node, pnpm, Docker)
 *  2. Instala dependências se necessário
 *  3. Sobe infra Docker (postgres / redis / minio)
 *  4. Aguarda postgres ficar pronto
 *  5. Roda prisma migrate + seed
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// ─── helpers ────────────────────────────────────────────────────────────────

function run(cmd, cwd = ROOT) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

function ok(label) { console.log(`  ✅  ${label}`); }
function warn(label) { console.log(`  ⚠️   ${label}`); }
function fail(label) { console.error(`  ❌  ${label}`); process.exit(1); }

function cmdExists(cmd) {
  const r = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { encoding: 'utf8' });
  return r.status === 0;
}

function required(cmd, hint) {
  if (!cmdExists(cmd)) fail(`"${cmd}" não encontrado. ${hint}`);
  ok(`${cmd} encontrado`);
}

// ─── 1. Pré-requisitos ───────────────────────────────────────────────────────

console.log('\n🔍 Verificando pré-requisitos...');
required('node',   'Instale Node.js >= 20: https://nodejs.org');
required('pnpm',   'Instale com: npm i -g pnpm');
required('docker', 'Instale Docker Desktop: https://www.docker.com/products/docker-desktop');

// ─── 2. Dependências ────────────────────────────────────────────────────────

const hasNodeModules =
  fs.existsSync(path.join(ROOT, 'node_modules')) &&
  fs.existsSync(path.join(ROOT, 'apps/api/node_modules')) &&
  fs.existsSync(path.join(ROOT, 'apps/web/node_modules'));

if (!hasNodeModules) {
  console.log('\n📦 Instalando dependências...');
  run('pnpm install');
} else {
  ok('Dependências já instaladas');
}

// ─── 3. Infra Docker ────────────────────────────────────────────────────────

console.log('\n🐳 Subindo infra (postgres / redis / minio)...');
run('docker compose -f docker/docker-compose.dev.yml up -d');

// ─── 4. Aguarda postgres ────────────────────────────────────────────────────

console.log('\n⏳ Aguardando postgres ficar pronto...');
let ready = false;
for (let i = 0; i < 30; i++) {
  const r = spawnSync('docker', ['exec', 'transrota_postgres', 'pg_isready', '-U', 'postgres'], { encoding: 'utf8' });
  if (r.status === 0) { ready = true; break; }
  process.stdout.write('.');
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
}
if (!ready) fail('Postgres não respondeu em 30 segundos. Verifique o Docker.');
console.log('\n');
ok('Postgres pronto');

// ─── 5. Prisma migrate + seed ───────────────────────────────────────────────

console.log('\n🗄️  Rodando migrations...');
const apiDir = path.join(ROOT, 'apps/api');

try {
  run('pnpm prisma generate --schema=prisma/master.prisma', apiDir);
  run('pnpm prisma migrate deploy --schema=prisma/master.prisma', apiDir);
  ok('Migrations aplicadas');
} catch {
  warn('Migrations falharam — o banco pode já estar atualizado');
}

try {
  run('pnpm prisma db seed', apiDir);
  ok('Seed executado');
} catch {
  warn('Seed ignorado — dados já podem existir');
}

// ─── Pronto ─────────────────────────────────────────────────────────────────

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚀  TransRota pronto para desenvolver!

  Para iniciar tudo:
    pnpm dev

  Serviços:
    Web   →  http://localhost:3000
    API   →  http://localhost:3001
    Minio →  http://localhost:9001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
