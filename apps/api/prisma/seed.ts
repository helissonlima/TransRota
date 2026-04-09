import { PrismaClient } from '../generated/master';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_MASTER_URL } },
});

async function main() {
  const email = process.env.SUPERADMIN_EMAIL ?? 'helisson@outlook.com';
  const password = process.env.SUPERADMIN_PASSWORD ?? '@#Sizera7662';

  const existing = await prisma.superAdmin.findUnique({ where: { email } });
  if (existing) {
    console.log(`✔ Super Admin já existe: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.superAdmin.create({
    data: { name: 'Helisson', email, passwordHash },
  });

  console.log('✅ Super Admin criado com sucesso!');
  console.log(`   Email   : ${email}`);
  console.log(`   Senha   : ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
