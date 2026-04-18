"use strict";

const { PrismaClient } = require("./generated/tenant");

const DEFAULT_DB =
  "postgresql://postgres:postgres@localhost:5432/transrota_master";

function parseArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function toTenantUrl(baseUrl, schema) {
  const url = new URL(baseUrl);
  url.searchParams.set("schema", schema);
  return url.toString();
}

function toNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value.toNumber === "function") return value.toNumber();
  return Number(value || 0);
}

async function main() {
  const schema = parseArg("--schema") || process.env.TENANT_SCHEMA;
  if (!schema) {
    throw new Error(
      "Informe o schema com --schema tenant_xxx (ou TENANT_SCHEMA no ambiente)",
    );
  }

  const apply = hasFlag("--apply");
  const baseUrl =
    process.env.DATABASE_MASTER_URL || process.env.DATABASE_URL || DEFAULT_DB;
  const dbUrl = toTenantUrl(baseUrl, schema);

  const prisma = new PrismaClient({
    datasources: { db: { url: dbUrl } },
  });

  try {
    await prisma.$connect();
    console.log(`🔌 Conectado em ${schema}`);
    console.log(`🧪 Modo: ${apply ? "APPLY" : "DRY-RUN"}`);

    const duplicateGroups = await prisma.$queryRawUnsafe(`
      SELECT
        "productId",
        "locationId",
        COUNT(*)::int AS "rows"
      FROM "StockItem"
      GROUP BY "productId", "locationId"
      HAVING COUNT(*) > 1
      ORDER BY COUNT(*) DESC;
    `);

    if (!duplicateGroups.length) {
      console.log("✅ Nenhuma duplicidade encontrada em StockItem.");
      return;
    }

    console.log(`📦 Grupos duplicados encontrados: ${duplicateGroups.length}`);

    let updatedKeepers = 0;
    let deletedRows = 0;
    let touchedGroups = 0;

    for (const group of duplicateGroups) {
      const productId = group.productId;
      const locationId = group.locationId ?? null;

      const rows = await prisma.stockItem.findMany({
        where: {
          productId,
          locationId,
        },
        include: {
          product: { select: { name: true, sku: true } },
          location: { select: { name: true } },
        },
        orderBy: [{ updatedAt: "asc" }, { id: "asc" }],
      });

      if (rows.length < 2) continue;

      const keep = rows[0];
      const remove = rows.slice(1);
      const totalQty = rows.reduce((acc, r) => acc + toNumber(r.quantity), 0);

      touchedGroups += 1;
      console.log(
        `- ${keep.product.sku} | ${keep.product.name} | local: ${keep.location?.name || "Principal"} | linhas: ${rows.length} | total: ${totalQty.toFixed(3)}`,
      );

      if (!apply) continue;

      await prisma.$transaction(async (tx) => {
        await tx.stockItem.update({
          where: { id: keep.id },
          data: { quantity: totalQty },
        });

        await tx.stockItem.deleteMany({
          where: {
            id: { in: remove.map((r) => r.id) },
          },
        });
      });

      updatedKeepers += 1;
      deletedRows += remove.length;
    }

    console.log("\n📊 Resumo:");
    console.log(`- Grupos analisados: ${duplicateGroups.length}`);
    console.log(`- Grupos válidos tocados: ${touchedGroups}`);

    if (apply) {
      console.log(`- Linhas consolidadas (keeper update): ${updatedKeepers}`);
      console.log(`- Linhas removidas: ${deletedRows}`);
      console.log("✅ Limpeza concluída.");
    } else {
      console.log("ℹ️ Dry-run finalizado. Execute novamente com --apply para efetivar.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("\n❌ Erro na limpeza:", err.message);
  process.exit(1);
});
