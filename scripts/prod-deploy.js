#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    ...options,
  });

  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runCapture(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if ((result.status ?? 1) !== 0) {
    process.stderr.write(result.stderr || '');
    process.exit(result.status ?? 1);
  }

  return (result.stdout || '').trim();
}

function ensureGitRepo() {
  const gitDir = path.join(rootDir, '.git');
  if (!fs.existsSync(gitDir)) {
    console.error('Este comando exige um checkout git no servidor.');
    process.exit(1);
  }
}

function ensureCleanWorktree() {
  const status = runCapture('git', ['status', '--porcelain']);
  if (status) {
    console.error('O repositório possui alterações locais. Commit/stash antes de rodar prod:deploy.');
    process.exit(1);
  }
}

function main() {
  ensureGitRepo();
  ensureCleanWorktree();

  console.log('Atualizando código do servidor...');
  run('git', ['fetch', '--all', '--prune']);
  run('git', ['pull', '--ff-only']);

  console.log('Subindo stack de produção...');
  run('npm', ['run', 'prod:up']);
}

main();