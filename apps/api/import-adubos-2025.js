"use strict";

const Excel = require("exceljs");
const { PrismaClient } = require("./generated/tenant");

const XLSX_PATH = process.argv[2] || "/home/helisson/Downloads/ADUBOS 2025_23 (1).xlsx";
const TENANT_SCHEMA = process.argv[3] || "tenant_e887950794f049bb";
const DB_URL = `postgresql://postgres:postgres@localhost:5432/transrota_master?schema=${TENANT_SCHEMA}`;

const SUPPLIER_SHEETS = ["HERINGER", "FERTIPAR", "REAL", "EQUILÍBRIO", "DIVERSOS"];

const DELIVERY_MAP = {
  "PENDENTE": "PENDING",
  "A VERIFICAR": "PENDING",
  "ENVIADO PARA O CAIXA": "IN_TRANSIT",
  "ENTREGUE": "DELIVERED",
  "RETIRADA NA LOJA": "DELIVERED",
  "DEVOLVIDA": "RETURNED",
};

const prisma = new PrismaClient({ datasources: { db: { url: DB_URL } } });

function cellVal(v) {
  if (v == null) return null;
  if (typeof v === "object") {
    if (v.result != null) return v.result;
    if (v.text != null) return v.text;
    if (Array.isArray(v.richText)) return v.richText.map((x) => x.text || "").join("");
  }
  return v;
}

function str(v) {
  const x = cellVal(v);
  if (x == null) return "";
  return String(x).trim();
}

function num(v) {
  const x = cellVal(v);
  if (x == null || x === "") return null;
  if (typeof x === "number") return Number(x);
  const cleaned = String(x).replace(/\s/g, "").replace(/\./g, "").replace(/,/g, ".").replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseDate(v) {
  const x = cellVal(v);
  if (!x) return null;
  if (x instanceof Date) return Number.isNaN(x.getTime()) ? null : x;
  if (typeof x === "number") {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const dt = new Date(epoch.getTime() + x * 86400000);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  const dt = new Date(String(x));
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function yes(v) {
  const s = str(v).toUpperCase();
  return s === "SIM" || s === "S" || s === "TRUE";
}

function normalizeKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

function skuBaseFromName(name) {
  const base = normalizeKey(name)
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 28);
  return `ADB-${base || "ITEM"}`;
}

function deliveryStatusFrom(value) {
  const key = normalizeKey(value);
  return DELIVERY_MAP[key] || "PENDING";
}

function titleCase(name) {
  return String(name || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ")
    .trim();
}

async function getOrCreateCategory() {
  const existing = await prisma.productCategory.findFirst({ where: { name: "Adubos" } });
  if (existing) return existing.id;
  const created = await prisma.productCategory.create({ data: { name: "Adubos", description: "Importado da planilha ADUBOS 2025" } });
  return created.id;
}

async function ensureUniqueSku(baseSku, takenSkus) {
  let sku = baseSku;
  let i = 2;
  while (takenSkus.has(sku) || (await prisma.product.findUnique({ where: { sku }, select: { id: true } }))) {
    sku = `${baseSku}-${i}`;
    i += 1;
  }
  takenSkus.add(sku);
  return sku;
}

async function main() {
  await prisma.$connect();
  console.log(`Conectado no schema ${TENANT_SCHEMA}`);

  const wb = new Excel.Workbook();
  await wb.xlsx.readFile(XLSX_PATH);
  console.log(`Planilha carregada: ${XLSX_PATH}`);

  const categoryId = await getOrCreateCategory();

  const supplierByKey = new Map();
  const sellerByKey = new Map();
  const productByKey = new Map();
  const takenSkus = new Set();

  let createdSuppliers = 0;
  let createdSellers = 0;
  let createdProducts = 0;
  let upsertedPurchaseOrders = 0;
  let upsertedSaleOrders = 0;
  let updatedStockItems = 0;

  async function ensureSupplier(name, fallbackTradeName = null) {
    const raw = titleCase(name || "Diversos");
    const key = normalizeKey(raw);
    if (!key) return null;
    if (supplierByKey.has(key)) return supplierByKey.get(key);

    const supplier = await prisma.supplier.upsert({
      where: { name: raw },
      update: {
        tradeName: fallbackTradeName || undefined,
        isActive: true,
      },
      create: {
        name: raw,
        tradeName: fallbackTradeName || null,
        isActive: true,
      },
      select: { id: true, name: true },
    });

    supplierByKey.set(key, supplier.id);
    createdSuppliers += 1;
    return supplier.id;
  }

  async function ensureSeller(name) {
    const raw = titleCase(name || "Sem Vendedor");
    const key = normalizeKey(raw);
    if (!key) return null;
    if (sellerByKey.has(key)) return sellerByKey.get(key);

    const seller = await prisma.seller.upsert({
      where: { name: raw },
      update: { isActive: true },
      create: { name: raw, isActive: true, commission: 0 },
      select: { id: true, name: true },
    });

    sellerByKey.set(key, seller.id);
    createdSellers += 1;
    return seller.id;
  }

  async function ensureClient(clientName, data = {}) {
    const raw = titleCase(clientName || 'Cliente não informado');
    const key = normalizeKey(raw);
    if (!key) return null;

    const doc = data.doc ? String(data.doc).trim() : null;

    const byDoc = doc
      ? await prisma.client.findFirst({ where: { doc } })
      : null;

    const byName = !byDoc
      ? await prisma.client.findFirst({ where: { name: raw } })
      : null;

    const existing = byDoc || byName;
    if (existing) {
      await prisma.client.update({
        where: { id: existing.id },
        data: {
          doc: doc || existing.doc,
          email: data.email || existing.email,
          phone: data.phone || existing.phone,
          address: data.address || existing.address,
          isActive: true,
        },
      });
      return existing.id;
    }

    const client = await prisma.client.create({
      data: {
        name: raw,
        doc,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
      },
      select: { id: true },
    });

    return client.id;
  }

  async function ensureProduct(formulaName, purchasePrice = null, salePrice = null) {
    const rawName = str(formulaName);
    if (!rawName) return null;
    const key = normalizeKey(rawName);
    if (!key) return null;

    if (productByKey.has(key)) return productByKey.get(key);

    const baseSku = skuBaseFromName(rawName);
    const sku = await ensureUniqueSku(baseSku, takenSkus);

    const product = await prisma.product.create({
      data: {
        sku,
        name: rawName,
        categoryId,
        costPrice: purchasePrice ?? 0,
        salePrice: salePrice ?? purchasePrice ?? 0,
        isActive: true,
      },
      select: { id: true },
    });

    productByKey.set(key, product.id);
    createdProducts += 1;
    return product.id;
  }

  async function upsertSupplierProduct(supplierId, productId, formulaName, lastPrice, notes) {
    await prisma.supplierProduct.upsert({
      where: { supplierId_productId: { supplierId, productId } },
      create: {
        supplierId,
        productId,
        supplierSku: str(formulaName) || null,
        lastPrice: lastPrice ?? null,
        notes: notes || null,
      },
      update: {
        supplierSku: str(formulaName) || undefined,
        lastPrice: lastPrice ?? undefined,
        notes: notes || undefined,
      },
    });
  }

  const banco = wb.getWorksheet("BANCO DE DADOS");
  if (banco) {
    for (let r = 3; r <= banco.rowCount; r += 1) {
      const row = banco.getRow(r);
      const formulas = [row.getCell(1).value, row.getCell(2).value, row.getCell(3).value, row.getCell(4).value, row.getCell(5).value];
      for (const f of formulas) {
        if (str(f)) await ensureProduct(f);
      }
      if (str(row.getCell(7).value)) await ensureSeller(row.getCell(7).value);
    }
  }

  for (const sheetName of SUPPLIER_SHEETS) {
    const ws = wb.getWorksheet(sheetName);
    if (!ws) continue;

    const supplierTitle = str(ws.getRow(2).getCell(1).value) || sheetName;
    const supplierId = await ensureSupplier(supplierTitle, sheetName);

    let currentFormula = str(ws.getRow(4).getCell(1).value);

    for (let r = 1; r <= ws.rowCount; r += 1) {
      const row = ws.getRow(r);

      const markerA = normalizeKey(row.getCell(1).value);
      const markerG = normalizeKey(row.getCell(7).value);
      if (markerA === "DATA" && markerG === "DATA2") {
        const maybeFormula = str(ws.getRow(Math.max(1, r - 2)).getCell(1).value);
        if (maybeFormula) currentFormula = maybeFormula;
        continue;
      }

      const productId = currentFormula ? await ensureProduct(currentFormula, num(row.getCell(4).value), num(row.getCell(13).value)) : null;
      if (!productId) continue;

      const purchaseDate = parseDate(row.getCell(1).value);
      const purchaseQty = num(row.getCell(3).value);
      const purchasePrice = num(row.getCell(4).value);

      if (purchaseDate && purchaseQty && purchaseQty > 0 && purchasePrice && purchasePrice > 0) {
        const orderNumber = `IMP-ADB-PO-${sheetName.replace(/[^A-Z0-9]/gi, "").toUpperCase()}-${String(r).padStart(4, "0")}`;
        const dueDate = parseDate(row.getCell(5).value);
        const isSafra = (num(row.getCell(20).value) || 0) > 0;
        const total = Number((purchaseQty * purchasePrice).toFixed(2));

        const order = await prisma.purchaseOrder.upsert({
          where: { number: orderNumber },
          create: {
            number: orderNumber,
            supplierId,
            status: "CONFIRMED",
            invoiceNumber: str(row.getCell(2).value) || null,
            isPriceLocked: yes(row.getCell(6).value),
            isSafra,
            safra: isSafra ? "SAFRA" : null,
            dueDate,
            subtotal: total,
            total,
            notes: `Importado da planilha ${sheetName} (linha ${r})`,
          },
          update: {
            supplierId,
            status: "CONFIRMED",
            invoiceNumber: str(row.getCell(2).value) || null,
            isPriceLocked: yes(row.getCell(6).value),
            isSafra,
            safra: isSafra ? "SAFRA" : null,
            dueDate,
            subtotal: total,
            total,
            notes: `Importado da planilha ${sheetName} (linha ${r})`,
          },
          select: { id: true },
        });

        await prisma.purchaseOrderItem.deleteMany({ where: { purchaseOrderId: order.id } });
        await prisma.purchaseOrderItem.create({
          data: {
            purchaseOrderId: order.id,
            productId,
            quantity: purchaseQty,
            receivedQty: 0,
            unitPrice: purchasePrice,
            discount: 0,
            total,
          },
        });

        await upsertSupplierProduct(supplierId, productId, currentFormula, purchasePrice, `Origem ${sheetName}`);
        upsertedPurchaseOrders += 1;
      }

      const saleDate = parseDate(row.getCell(7).value);
      const saleQty = num(row.getCell(12).value);
      const saleUnitPrice = num(row.getCell(13).value) || purchasePrice || 0;

      if (saleDate && saleQty && saleQty > 0 && saleUnitPrice > 0) {
        const sellerName = str(row.getCell(9).value);
        const sellerId = sellerName ? await ensureSeller(sellerName) : null;
        const clientName = str(row.getCell(11).value) || 'Cliente não informado';
        const clientAddress = str(row.getCell(10).value) || null;
        const clientId = await ensureClient(clientName, { address: clientAddress });
        const dueDate = parseDate(row.getCell(14).value);
        const deliveryStatus = deliveryStatusFrom(row.getCell(16).value);
        const isSafra = (num(row.getCell(21).value) || 0) > 0;
        const total = Number((saleQty * saleUnitPrice).toFixed(2));

        const orderNumber = `IMP-ADB-SO-${sheetName.replace(/[^A-Z0-9]/gi, "").toUpperCase()}-${String(r).padStart(4, "0")}`;

        const sale = await prisma.saleOrder.upsert({
          where: { number: orderNumber },
          create: {
            number: orderNumber,
            clientId,
            clientName,
            clientAddress,
            sellerId,
            supplierId,
            status: deliveryStatus === "DELIVERED" ? "DELIVERED" : "CONFIRMED",
            deliveryStatus,
            isPriceLocked: yes(row.getCell(15).value),
            isSafra,
            safra: isSafra ? "SAFRA" : null,
            invoiceNumber: str(row.getCell(8).value) || null,
            paymentMethod: str(row.getCell(14).value) || null,
            dueDate,
            deliveredAt: deliveryStatus === "DELIVERED" ? saleDate : null,
            subtotal: total,
            total,
            notes: str(row.getCell(17).value) || `Importado da planilha ${sheetName} (linha ${r})`,
          },
          update: {
            clientId,
            clientName,
            clientAddress,
            sellerId,
            supplierId,
            status: deliveryStatus === "DELIVERED" ? "DELIVERED" : "CONFIRMED",
            deliveryStatus,
            isPriceLocked: yes(row.getCell(15).value),
            isSafra,
            safra: isSafra ? "SAFRA" : null,
            invoiceNumber: str(row.getCell(8).value) || null,
            paymentMethod: str(row.getCell(14).value) || null,
            dueDate,
            deliveredAt: deliveryStatus === "DELIVERED" ? saleDate : null,
            subtotal: total,
            total,
            notes: str(row.getCell(17).value) || `Importado da planilha ${sheetName} (linha ${r})`,
          },
          select: { id: true },
        });

        await prisma.saleOrderItem.deleteMany({ where: { saleOrderId: sale.id } });
        await prisma.saleOrderItem.create({
          data: {
            saleOrderId: sale.id,
            productId,
            quantity: saleQty,
            unitPrice: saleUnitPrice,
            discount: 0,
            total,
          },
        });

        await prisma.product.update({ where: { id: productId }, data: { salePrice: saleUnitPrice } });
        upsertedSaleOrders += 1;
      }
    }
  }

  const warehouse = wb.getWorksheet("ARMAZÉM");
  if (warehouse) {
    const groups = [
      { col: 2, supplierName: "HERINGER" },
      { col: 7, supplierName: "FERTIPAR" },
      { col: 12, supplierName: "REAL" },
      { col: 17, supplierName: "DIVERSOS" },
      { col: 22, supplierName: "EQUILÍBRIO FERTILIZANTES" },
    ];
    const groupSuppliers = new Map();

    for (const group of groups) {
      const headerName = str(warehouse.getRow(4).getCell(group.col).value);
      const supplierId = await ensureSupplier(headerName || group.supplierName, group.supplierName);
      groupSuppliers.set(group.col, supplierId);
    }

    for (let r = 6; r <= warehouse.rowCount; r += 1) {
      const row = warehouse.getRow(r);

      for (const group of groups) {
        const c = group.col;
        const formula = str(row.getCell(c).value);
        const qty = num(row.getCell(c + 1).value);
        const safra = str(row.getCell(c + 2).value);
        const price = num(row.getCell(c + 3).value);
        const supplierId = groupSuppliers.get(c);

        if (!supplierId || !formula || qty == null) continue;

        const productId = await ensureProduct(formula, price, price);
        await upsertSupplierProduct(supplierId, productId, formula, price, safra || "ARMAZEM");

        const stock = await prisma.stockItem.findFirst({ where: { productId, locationId: null }, select: { id: true } });
        if (stock) {
          await prisma.stockItem.update({ where: { id: stock.id }, data: { quantity: qty } });
        } else {
          await prisma.stockItem.create({ data: { productId, quantity: qty, locationId: null } });
        }

        updatedStockItems += 1;
      }
    }
  }

  console.log("\nResumo da importacao");
  console.log(`Suppliers processados: ${createdSuppliers}`);
  console.log(`Sellers processados: ${createdSellers}`);
  console.log(`Products criados: ${createdProducts}`);
  console.log(`Purchase Orders importadas: ${upsertedPurchaseOrders}`);
  console.log(`Sale Orders importadas: ${upsertedSaleOrders}`);
  console.log(`Stock items atualizados: ${updatedStockItems}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Importacao finalizada com sucesso.");
  })
  .catch(async (err) => {
    console.error("Erro na importacao:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
