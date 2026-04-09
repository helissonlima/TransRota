# TransRota — Arquitetura do Sistema SaaS

## 1. Visão Geral

Sistema SaaS multi-tenant para gestão completa de frota, motoristas, rotas e entregas.
Cada empresa (tenant) possui isolamento total de dados via schema separado no PostgreSQL.

---

## 2. Stack Tecnológica

| Camada         | Tecnologia                              |
|----------------|-----------------------------------------|
| Backend        | NestJS + TypeScript                     |
| Frontend       | Next.js 14 + TypeScript + Tailwind CSS  |
| ORM            | Prisma                                  |
| Banco de dados | PostgreSQL 16                           |
| Cache          | Redis 7                                 |
| Filas          | BullMQ + Redis                          |
| Storage        | MinIO (S3-compatible)                   |
| Auth           | JWT (access + refresh) + bcrypt         |
| Container      | Docker + Docker Compose                 |
| Monorepo       | pnpm workspaces                         |

---

## 3. Arquitetura Multi-Tenant

### Estratégia: Schema-per-Tenant no PostgreSQL

```
PostgreSQL
├── schema: public          → banco master (global)
│   ├── companies           → cadastro de empresas/tenants
│   ├── plans               → planos de assinatura
│   ├── subscriptions       → assinaturas ativas
│   └── audit_log           → auditoria global
│
├── schema: tenant_<uuid>   → dados isolados por empresa
│   ├── branches            → filiais
│   ├── users               → usuários da empresa
│   ├── roles               → perfis de acesso
│   ├── vehicles            → veículos
│   ├── vehicle_maintenance → manutenções
│   ├── fuel_records        → abastecimentos
│   ├── drivers             → motoristas
│   ├── driver_documents    → documentos dos motoristas
│   ├── routes              → rotas
│   ├── route_stops         → paradas da rota
│   ├── deliveries          → entregas
│   ├── delivery_items      → itens da entrega
│   ├── delivery_proofs     → comprovantes (foto, assinatura, GPS)
│   ├── checklists          → modelos de checklist
│   ├── checklist_items     → itens do checklist
│   ├── checklist_executions→ execuções preenchidas
│   └── audit_log           → auditoria do tenant
```

### Fluxo de resolução de tenant

```
Request → Header (X-Tenant-ID) ou Subdomain
       → TenantMiddleware → busca company no master
       → Injeta PrismaService com schema do tenant
       → Todos os módulos operam no schema correto
```

---

## 4. Módulos do Sistema

### M1 — Auth
- Login com email/senha
- JWT access token (15min) + refresh token (7d)
- Revogação de tokens
- Permissões por role (RBAC)

### M2 — Tenants (Empresas)
- Onboarding de novas empresas
- Criação automática de schema no PostgreSQL
- Filiais por empresa
- Planos e limites

### M3 — Users & Roles
- Usuários por tenant
- Roles: ADMIN, MANAGER, OPERATOR, DRIVER, VIEWER
- Permissões granulares por módulo/ação

### M4 — Fleet (Frota)
- Cadastro de veículos (placa, modelo, ano, tipo)
- Histórico de manutenções
- Controle de abastecimento (km, litros, custo)
- Alertas de revisão por km ou data
- Status do veículo (ativo, manutenção, inativo)

### M5 — Drivers (Motoristas)
- Cadastro com documentos (CNH, validade)
- Histórico de viagens
- Vínculo com veículo
- Alertas de vencimento de documentos

### M6 — Routes & Deliveries (Rotas)
- Criação de rota com múltiplas paradas
- Sequência de entrega
- Status por parada: pendente / entregue parcial / entregue total / não entregue / reagendado
- Comprovante: foto, assinatura digital, coordenadas GPS
- Janela de tempo por entrega

### M7 — Checklist Operacional
- Modelos de checklist customizáveis
- Checklist de saída e retorno do veículo
- Execução pelo motorista (mobile-first)
- Alertas de itens reprovados

### M8 — Reports & Dashboard
- KPIs em tempo real: entregas, km rodados, custos
- Relatório de ocorrências
- Exportação em PDF/Excel
- Dashboard por filial, motorista, veículo, período

### M9 — Audit & Segurança
- Log de todas as operações críticas
- Registro de quem fez o quê e quando
- Retenção configurável por plano

---

## 5. Estrutura de Diretórios

```
TransRota/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── core/           # bootstrap, config, interceptors
│   │   │   ├── tenant/         # resolução e isolamento de tenant
│   │   │   ├── auth/           # autenticação e autorização
│   │   │   ├── users/          # usuários e roles
│   │   │   ├── fleet/          # veículos e manutenção
│   │   │   ├── drivers/        # motoristas e documentos
│   │   │   ├── routes/         # rotas e entregas
│   │   │   ├── checklist/      # checklists operacionais
│   │   │   └── reports/        # relatórios e dashboard
│   │   └── prisma/
│   │       ├── master.prisma   # schema master (public)
│   │       └── tenant.prisma   # schema por tenant
│   └── web/                    # Next.js frontend
│       ├── app/                # app router
│       ├── components/         # componentes reutilizáveis
│       ├── lib/                # helpers, api client
│       └── modules/            # páginas por módulo
├── packages/
│   └── shared/                 # tipos e DTOs compartilhados
├── docker/
│   └── docker-compose.yml
└── package.json                # root pnpm workspace
```

---

## 6. APIs — Estrutura REST

```
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout

GET    /companies                    (master admin)
POST   /companies                    (cadastro + provisioning)

GET    /branches
POST   /branches

GET    /users
POST   /users
PATCH  /users/:id/role

GET    /vehicles
POST   /vehicles
GET    /vehicles/:id/maintenance
POST   /vehicles/:id/maintenance
GET    /vehicles/:id/fuel
POST   /vehicles/:id/fuel

GET    /drivers
POST   /drivers
GET    /drivers/:id/documents
POST   /drivers/:id/documents

GET    /routes
POST   /routes
GET    /routes/:id
PATCH  /routes/:id/stops/:stopId/status
POST   /routes/:id/stops/:stopId/proof

GET    /checklists
POST   /checklists
POST   /checklists/:id/execute

GET    /reports/dashboard
GET    /reports/deliveries
GET    /reports/fleet
GET    /reports/drivers
GET    /reports/costs
```

---

## 7. Segurança

- HTTPS obrigatório em produção
- Helmet + CORS configurado por tenant
- Rate limiting por IP e por tenant
- JWT com rotação de refresh token
- Senhas com bcrypt (salt rounds: 12)
- Validação de entrada com class-validator
- SQL Injection: impossível via Prisma ORM
- Auditoria de todas as operações destrutivas
- Secrets via variáveis de ambiente (nunca no código)

---

## 8. Escalabilidade

- API stateless → escala horizontal com load balancer
- Redis como cache compartilhado entre instâncias
- BullMQ para processamento assíncrono (relatórios, notificações)
- PostgreSQL com connection pooling (PgBouncer)
- Migrations por tenant automatizadas no onboarding
- Feature flags por plano de assinatura
