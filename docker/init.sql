-- Cria banco adicional para os tenants (schemas dinâmicos)
CREATE DATABASE transrota;

-- Extensões úteis
\c transrota_master
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- busca full-text

\c transrota
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
