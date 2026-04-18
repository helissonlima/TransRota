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

function normalizeName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function num(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value.toNumber === "function") return value.toNumber();
  return Number(value || 0);
}

function hasNumericSuffixSku(sku) {
  return /-\d+$/.test(String(sku || ""));
}

function pickKeeper(products) {
  const sorted = [...products].sort((a, b) => {
    const aSuffix = hasNumericSuffixSku(a.sku) ? 1 : 0;
    const bSuffix = hasNumericSuffixSku(b.sku) ? 1 : 0;
    if (aSuffix !== bSuffix) return aSuffix - bSuffix;

    const aRefs =
      a._count.stockItems +
      a._count.stockMovements +
      a._count.supplierProducts +
      a._count.purchaseOrderItems +
      a._count.saleOrderItems +
      a._count.productionOrders +
      a._count.bomComponents +
      (a.bom ? 1 : 0);
    const bRefs =
      b._count.stockItems +
      b._count.stockMovements +
      b._count.supplierProducts +
      b._count.purchaseOrderItems +
      b._count.saleOrderItems +
      b._count.productionOrders +
      b._count.bomComponents +
      (b.bom ? 1 : 0);

    if (aRefs !== bRefs) return bRefs - aRefs;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return sorted[0];
}

async function mergeStockItems(tx, fromProductId, toProductId) {
  const fromRows = await tx.stockItem.findMany({
    where: { productId: fromProductId },
  });

  let mergedRows = 0;

  for (const row of fromRows) {
    const existing = await tx.stockItem.findFirst({
      where: {
        productId: toProductId,
        locationId: row.locationId ?? null,
      },
    });

    if (existing) {
      await tx.stockItem.update({
        where: { id: existing.id },
        data: { quantity: num(existing.quantity) + num(row.quantity) },
      });
      await tx.stockItem.delete({ where: { id: row.id } });
    } else {
      await tx.stockItem.update({
        where: { id: row.id },
        data: { productId: toProductId },
      });
    }

    mergedRows += 1;
  }

  return mergedRows;
}

async function mergeSupplierLinks(tx, fromProductId, toProductId) {
  const links = await tx.supplierProduct.findMany({
    where: { productId: fromProductId },
  });

  let moved = 0;

  for (const link of links) {
    await tx.supplierProduct.upsert({
      where: {
        supplierId_productId: {
          supplierId: link.supplierId,
          productId: toProductId,
        },
      },
      create: {
        supplierId: link.supplierId,
        productId: toProductId,
        supplierSku: link.supplierSku,
        lastPrice: link.lastPrice,
        leadTimeDays: link.leadTimeDays,
        notes: link.notes,
      },
      update: {
        supplierSku: link.supplierSku ?? undefined,
        lastPrice: link.lastPrice ?? undefined,
        leadTimeDays: link.leadTimeDays ?? undefined,
        notes: link.notes ?? undefined,
      },
    });

    await tx.supplierProduct.delete({ where: { id: link.id } });
    moved += 1;
  }

  return moved;
}

async function main() {
  const schema = parseArg("--schema") || process.env.TENANT_SCHEMA;
  if (!schema) {
    throw new Error("Informe --schema tenant_xxx ou TENANT_SCHEMA");
  }

  const apply = hasFlag("--apply");
  const hardDelete = hasFlag("--hard-delete");

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

    const activeProducts = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        sku: true,
        name: true,
        unit: true,
        type: true,
        createdAt: true,
        bom: { select: { id: true } },
        _count: {
          select: {
            stockItems: true,
            stockMovements: true,
            supplierProducts: true,
            purchaseOrderItems: true,
            saleOrderItems: true,
            productionOrders: true,
            bomComponents: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const grouped = new Map();
    for (const p of activeProducts) {
      const key = `${normalizeName(p.name)}|${p.type}|${p.unit}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(p);
    }

    const duplicateGroups = Array.from(grouped.values()).filter(
      (group) => group.length > 1,
    );

    if (!duplicateGroups.length) {
      console.log("✅ Nenhum grupo de produtos duplicados encontrado.");
      return;
    }

    console.log(`📦 Grupos duplicados detectados: ${duplicateGroups.length}`);

    let groupsProcessed = 0;
    let mergedProducts = 0;
    let deactivatedProducts = 0;
    let deletedProducts = 0;
    let skippedProducts = 0;

    for (const group of duplicateGroups) {
      const keeper = pickKeeper(group);
      const duplicates = group.filter((p) => p.id !== keeper.id);

      groupsProcessed += 1;
      console.log(
        `\n- Grupo: ${keeper.name} (${keeper.type}/${keeper.unit}) | keeper: ${keeper.sku} | duplicados: ${duplicates.length}`,
      );

      for (const dup of duplicates) {
        const unsafe = dup.bom || dup._count.productionOrders > 0 || dup._count.bomComponents > 0;

        if (unsafe) {
          skippedProducts += 1;
          console.log(
            `  ⚠️  SKIP ${dup.sku} (BOM/produção/componente em BOM)`
          );
          continue;
        }

        console.log(`  • Merge ${dup.sku} -> ${keeper.sku}`);

        if (!apply) continue;

        await prisma.$transaction(async (tx) => {
          await mergeStockItems(tx, dup.id, keeper.id);
          await mergeSupplierLinks(tx, dup.id, keeper.id);

          await tx.stockMovement.updateMany({
            where: { productId: dup.id },
            data: { productId: keeper.id },
          });

          await tx.purchaseOrderItem.updateMany({
            where: { productId: dup.id },
            data: { productId: keeper.id },
          });

          await tx.saleOrderItem.updateMany({
            where: { productId: dup.id },
            data: { productId: keeper.id },
          });

          if (hardDelete) {
            await tx.product.delete({ where: { id: dup.id } });
            deletedProducts += 1;
          } else {
            await tx.product.update({
              where: { id: dup.id },
              data: {
                isActive: false,
                notes: `${dup.notes ? dup.notes + " | " : ""}MERGED_INTO:${keeper.sku}`,
              },
            });
            deactivatedProducts += 1;
          }
        });

        mergedProducts += 1;
      }
    }

    console.log("\n📊 Resumo:");
    console.log(`- Grupos analisados: ${groupsProcessed}`);
    console.log(`- Produtos duplicados processados: ${mergedProducts}`);
    console.log(`- Produtos ignorados por segurança: ${skippedProducts}`);

    if (apply) {
      console.log(`- Produtos desativados: ${deactivatedProducts}`);
      console.log(`- Produtos removidos (hard-delete): ${deletedProducts}`);
      console.log("✅ Limpeza concluída.");
    } else {
      console.log("ℹ️ Dry-run finalizado. Use --apply para efetivar.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("\n❌ Erro:", err.message);
  process.exit(1);
});
