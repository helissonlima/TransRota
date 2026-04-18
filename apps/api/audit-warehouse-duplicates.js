"use strict";

const { PrismaClient } = require("./generated/tenant");

const DEFAULT_DB =
  "postgresql://postgres:postgres@localhost:5432/transrota_master";

function parseArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function toTenantUrl(baseUrl, schema) {
  const url = new URL(baseUrl);
  url.searchParams.set("schema", schema);
  return url.toString();
}

async function main() {
  const schema = parseArg("--schema") || process.env.TENANT_SCHEMA;
  if (!schema) throw new Error("Informe --schema tenant_xxx");

  const baseUrl =
    process.env.DATABASE_MASTER_URL || process.env.DATABASE_URL || DEFAULT_DB;
  const dbUrl = toTenantUrl(baseUrl, schema);

  const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

  try {
    await prisma.$connect();
    console.log(`🔌 Conectado em ${schema}`);

    const dupProductSku = await prisma.$queryRawUnsafe(`
      SELECT "sku", COUNT(*)::int AS cnt
      FROM "Product"
      GROUP BY "sku"
      HAVING COUNT(*) > 1
      ORDER BY COUNT(*) DESC, "sku";
    `);

    const dupProductName = await prisma.$queryRawUnsafe(`
      SELECT LOWER(TRIM("name")) AS "nameKey", COUNT(*)::int AS cnt
      FROM "Product"
      GROUP BY LOWER(TRIM("name"))
      HAVING COUNT(*) > 1
      ORDER BY COUNT(*) DESC, "nameKey";
    `);

    const multiSupplierSameSku = await prisma.$queryRawUnsafe(`
      SELECT p."sku", COUNT(DISTINCT sp."supplierId")::int AS suppliers, COUNT(*)::int AS links
      FROM "SupplierProduct" sp
      JOIN "Product" p ON p."id" = sp."productId"
      GROUP BY p."sku"
      HAVING COUNT(DISTINCT sp."supplierId") > 1
      ORDER BY suppliers DESC, links DESC, p."sku";
    `);

    console.log("\n📊 Auditoria de duplicidades (Armazém):");
    console.log(`- Produtos com SKU duplicado: ${dupProductSku.length}`);
    console.log(`- Produtos com nome duplicado (normalizado): ${dupProductName.length}`);
    console.log(`- SKU ligado a múltiplos fornecedores: ${multiSupplierSameSku.length}`);

    if (dupProductSku.length) {
      console.log("\nTop SKU duplicados:");
      dupProductSku.slice(0, 15).forEach((r) => {
        console.log(`  - ${r.sku}: ${r.cnt}`);
      });
    }

    if (dupProductName.length) {
      console.log("\nTop nomes duplicados:");
      dupProductName.slice(0, 15).forEach((r) => {
        console.log(`  - ${r.nameKey}: ${r.cnt}`);
      });
    }

    if (multiSupplierSameSku.length) {
      console.log("\nTop SKU em múltiplos fornecedores:");
      multiSupplierSameSku.slice(0, 15).forEach((r) => {
        console.log(`  - ${r.sku}: ${r.suppliers} fornecedores, ${r.links} vínculos`);
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("\n❌ Erro:", err.message);
  process.exit(1);
});
