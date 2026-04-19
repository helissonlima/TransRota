#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { randomBytes } = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const envFilePath = path.join(rootDir, 'docker', '.env.production');

function randomSecret(length = 32) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';

  while (out.length < length) {
    const bytes = randomBytes(length);
    for (const b of bytes) {
      out += alphabet[b % alphabet.length];
      if (out.length === length) return out;
    }
  }

  return out;
}

function parseEnv(text) {
  const result = {};
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx < 1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

function ensureValue(env, key, generator) {
  const current = env[key];
  if (current && current.length >= 32) return;
  env[key] = generator();
}

function main() {
  const existing = fs.existsSync(envFilePath)
    ? parseEnv(fs.readFileSync(envFilePath, 'utf8'))
    : {};

  const env = {
    POSTGRES_USER: existing.POSTGRES_USER || 'postgres',
    POSTGRES_DB: existing.POSTGRES_DB || 'transrota_master',
    MINIO_ROOT_USER: existing.MINIO_ROOT_USER || 'minioadmin',
    ...existing,
  };

  ensureValue(env, 'POSTGRES_PASSWORD', () => randomSecret(32));
  ensureValue(env, 'REDIS_PASSWORD', () => randomSecret(32));
  ensureValue(env, 'MINIO_ROOT_PASSWORD', () => randomSecret(32));
  ensureValue(env, 'JWT_SECRET', () => randomSecret(32));
  ensureValue(env, 'JWT_REFRESH_SECRET', () => randomSecret(32));

  const lines = [
    '# Arquivo gerado automaticamente para ambiente de producao',
    '# Nao versionar este arquivo',
    `POSTGRES_USER=${env.POSTGRES_USER}`,
    `POSTGRES_PASSWORD=${env.POSTGRES_PASSWORD}`,
    `POSTGRES_DB=${env.POSTGRES_DB}`,
    `REDIS_PASSWORD=${env.REDIS_PASSWORD}`,
    `MINIO_ROOT_USER=${env.MINIO_ROOT_USER}`,
    `MINIO_ROOT_PASSWORD=${env.MINIO_ROOT_PASSWORD}`,
    `JWT_SECRET=${env.JWT_SECRET}`,
    `JWT_REFRESH_SECRET=${env.JWT_REFRESH_SECRET}`,
    '',
  ];

  fs.mkdirSync(path.dirname(envFilePath), { recursive: true });
  fs.writeFileSync(envFilePath, lines.join('\n'), 'utf8');

  console.log(`Segredos de producao prontos em: ${envFilePath}`);
  console.log('Todas as senhas/chaves obrigatorias estao com no minimo 32 caracteres.');
}

main();
