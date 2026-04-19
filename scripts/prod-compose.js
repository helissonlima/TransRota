#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const composeFile = path.join(rootDir, 'docker', 'docker-compose.yml');
const envFile = path.join(rootDir, 'docker', '.env.production');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const text = fs.readFileSync(filePath, 'utf8');
  const env = {};

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i <= 0) continue;
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    env[key] = value;
  }

  return env;
}

function runCheck(cmd, args) {
  const result = spawnSync(cmd, args, { stdio: 'ignore' });
  return result.status === 0;
}

function getComposeCommand() {
  if (runCheck('docker', ['compose', 'version'])) {
    return { cmd: 'docker', baseArgs: ['compose'] };
  }

  if (runCheck('docker-compose', ['version'])) {
    return { cmd: 'docker-compose', baseArgs: [] };
  }

  console.error('Nenhum comando de compose encontrado. Instale docker compose plugin ou docker-compose.');
  process.exit(1);
}

function main() {
  const extraArgs = process.argv.slice(2);
  if (extraArgs.length === 0) {
    console.error('Uso: node scripts/prod-compose.js <args-do-compose>');
    console.error('Exemplo: node scripts/prod-compose.js up -d --build');
    process.exit(1);
  }

  const compose = getComposeCommand();
  const envFromFile = parseEnvFile(envFile);

  const args = [...compose.baseArgs, '-f', composeFile, ...extraArgs];
  console.log(`Executando: ${compose.cmd} ${args.join(' ')}`);

  const result = spawnSync(compose.cmd, args, {
    stdio: 'inherit',
    cwd: rootDir,
    env: {
      ...process.env,
      ...envFromFile,
    },
  });

  process.exit(result.status ?? 1);
}

main();
