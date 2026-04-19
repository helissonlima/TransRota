#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    ...options,
  });
}

function ensureApiContainerReady(maxAttempts = 30, intervalMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    // Tenta exec simples — se o container estiver up e com shell, retorna 0
    const result = run('node', ['scripts/prod-compose.js', 'exec', '-T', 'api', 'echo', 'alive']);
    const output = (result.stdout || '') + (result.stderr || '');
    if (result.status === 0 && /alive/i.test(output)) {
      return true;
    }

    process.stdout.write(`Aguardando container da API ficar em execucao (${attempt}/${maxAttempts})...\n`);
    sleep(intervalMs);
  }

  return false;
}

function runInApi(shellCommand) {
  return run('node', [
    'scripts/prod-compose.js',
    'exec',
    '-T',
    'api',
    'sh',
    '-lc',
    shellCommand,
  ], { stdio: 'inherit' });
}

function main() {
  if (!ensureApiContainerReady()) {
    console.error('Nao foi possivel detectar a API em execucao para inicializar o banco.');
    process.exit(1);
  }

  console.log('Aplicando schema master no banco...');
  const push = runInApi('pnpm prisma db push --schema=prisma/master.prisma');
  if (push.status !== 0) {
    process.exit(push.status || 1);
  }

  console.log('Executando seed do banco master...');
  const seed = runInApi('pnpm prisma:seed');
  if (seed.status !== 0) {
    process.exit(seed.status || 1);
  }

  console.log('Banco inicializado com sucesso (schema + seed).');
}

main();
