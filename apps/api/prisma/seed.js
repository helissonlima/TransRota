"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_1 = require("../generated/master");
const bcrypt = require("bcryptjs");
const prisma = new master_1.PrismaClient({
    datasources: { db: { url: process.env.DATABASE_MASTER_URL } },
});
async function main() {
    const email = process.env.SUPERADMIN_EMAIL ?? 'superadmin@transrota.com';
    const password = process.env.SUPERADMIN_PASSWORD ?? 'Admin@1234';
    const existing = await prisma.superAdmin.findUnique({ where: { email } });
    if (existing) {
        console.log(`✔ Super Admin já existe: ${email}`);
        return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.superAdmin.create({
        data: { name: 'Super Admin', email, passwordHash },
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
//# sourceMappingURL=seed.js.map