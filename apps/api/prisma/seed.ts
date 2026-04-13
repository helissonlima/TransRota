import { PrismaClient } from '../generated/master';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_MASTER_URL } },
});

// ─── Empresas fixas que devem sempre existir no master ───────────────────────
const SEED_COMPANIES = [
  {
    id: 'e887950794f049bb',
    name: 'EFRATAGRO AGRONEGOCIOS LTDA',
    cnpj: '12.345.678/0001-00',
    email: 'admin@rota.com',
    schemaName: 'tenant_e887950794f049bb',
  },
];

async function main() {
  const email = process.env.SUPERADMIN_EMAIL ?? 'helisson@outlook.com';
  const password = process.env.SUPERADMIN_PASSWORD ?? '@#Sizera7662';

  const existing = await prisma.superAdmin.findUnique({ where: { email } });
  if (existing) {
    console.log(`✔ Super Admin já existe: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.superAdmin.create({
      data: { name: 'Helisson', email, passwordHash },
    });
    console.log('✅ Super Admin criado com sucesso!');
    console.log(`   Email   : ${email}`);
    console.log(`   Senha   : ${password}`);
  }

  // Garante plano padrão
  const plan = await prisma.plan.upsert({
    where: { id: 'plan-default' },
    update: {},
    create: {
      id: 'plan-default',
      name: 'Padrão',
      type: 'PROFESSIONAL',
      maxVehicles: 999,
      maxDrivers: 999,
      maxUsers: 999,
      maxBranches: 99,
      storageGb: 100,
      priceMonthly: 0,
    },
  });

  // Garante que empresas fixas sempre existam no master
  for (const c of SEED_COMPANIES) {
    const exists = await prisma.company.findUnique({ where: { id: c.id } });
    if (exists) {
      console.log(`✔ Empresa já existe: ${c.name}`);
    } else {
      await prisma.company.create({
        data: {
          id: c.id,
          name: c.name,
          cnpj: c.cnpj,
          email: c.email,
          schemaName: c.schemaName,
          planId: plan.id,
          isActive: true,
        },
      });
      console.log(`✅ Empresa recriada: ${c.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
