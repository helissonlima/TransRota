/**
 * Importador parcial: apenas DailyKmLog (KMs DIA)
 * Executa quando as demais seções já foram importadas com sucesso.
 */
'use strict';

const Excel = require('exceljs');
const { PrismaClient } = require('./generated/tenant');

const SCHEMA = 'tenant_e887950794f049bb';
const DB_URL = `postgresql://postgres:postgres@localhost:5432/transrota_master?schema=${SCHEMA}`;
const XLSX   = '/Users/helisson/Downloads/PCM - AGROFERT.xlsx';
const prisma = new PrismaClient({ datasources: { db: { url: DB_URL } } });

function val(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'object') {
    if (v.result  !== undefined) return v.result;
    if (v.richText) return v.richText.map(r => r.text).join('');
    if (v.text    !== undefined) return v.text;
  }
  return v;
}
function str(v) { const s = val(v); return s !== null ? String(s).trim() : ''; }
function num(v) { const n = parseFloat(str(v)); return isNaN(n) ? null : n; }

function parseDate(v) {
  const d = val(v);
  if (!d) return null;
  let result;
  if (d instanceof Date)          result = d;
  else if (typeof d === 'string') result = new Date(d);
  else return null;
  if (isNaN(result.getTime())) return null;
  const y = result.getFullYear();
  if (y < 1950 || y > 2100) return null;
  return result;
}

async function main() {
  await prisma.$connect();
  console.log('🔌 Conectado\n');

  // Mapa plate → vehicleId
  const vehicles = await prisma.vehicle.findMany({ select: { id: true, plate: true } });
  const vehicleMap = Object.fromEntries(vehicles.map(v => [v.plate, v.id]));

  // Mapa nome (uppercase) → driverId
  const drivers = await prisma.driver.findMany({ select: { id: true, name: true } });
  const driverNameMap = Object.fromEntries(drivers.map(d => [d.name.toUpperCase(), d.id]));

  function findDriver(name) {
    if (!name) return null;
    const key = String(name).toUpperCase().trim();
    if (driverNameMap[key]) return driverNameMap[key];
    const parts = key.split(' ').filter(Boolean);
    const first = parts[0], last = parts[parts.length - 1];
    for (const k of Object.keys(driverNameMap)) {
      if (k.includes(first) && (last.length > 2 ? k.includes(last) : true))
        return driverNameMap[k];
    }
    return null;
  }

  console.log('─── Importando KM Diário (KMs DIA)...');
  const wb = new Excel.Workbook();
  await wb.xlsx.readFile(XLSX);

  const wsKm = wb.getWorksheet('KMs DIA');
  const kmData = [];
  let kmSkip = 0;

  for (let r = 3; r <= wsKm.rowCount; r++) {
    const row   = wsKm.getRow(r).values;
    const plate = str(row[6]).toUpperCase().replace(/\s/g, '');
    const vehicleId = vehicleMap[plate];
    if (!plate || !vehicleId) continue;

    const date = parseDate(row[1]);
    if (!date) continue;

    const driverId = findDriver(val(row[4]));
    if (!driverId) { kmSkip++; continue; }

    const initialKm = num(row[7]) ?? 0;
    const finalKm   = num(row[8]) ?? 0;
    if (initialKm === 0 && finalKm === 0) continue;

    kmData.push({
      vehicleId, driverId, date,
      dayOfWeek:         str(row[3]) || null,
      initialKm,
      finalKm,
      personalInitialKm: num(row[9]),
      personalFinalKm:   num(row[10]),
      personalKm:        num(row[11]) ?? 0,
      workKm:            num(row[12]) ?? 0,
      totalKm:           num(row[13]) ?? 0,
      status:            str(row[14]).toUpperCase() === 'NOK' ? 'NOK' : 'OK',
      notes:             str(row[15]) || null,
    });
  }

  let ok = 0;
  for (let i = 0; i < kmData.length; i += 200) {
    const r = await prisma.dailyKmLog.createMany({ data: kmData.slice(i, i + 200) });
    ok += r.count;
    process.stdout.write(`\r   ${ok}/${kmData.length}...`);
  }

  console.log(`\n   ✅ ${ok} registros KM diário | ⏭  ${kmSkip} sem motorista\n`);

  // Atualiza KM atual dos veículos com os KM finais mais altos
  const max = {};
  for (const r of kmData) max[r.vehicleId] = Math.max(max[r.vehicleId] ?? 0, r.finalKm);
  let upd = 0;
  for (const [vehicleId, km] of Object.entries(max)) {
    await prisma.vehicle.updateMany({ where: { id: vehicleId, currentKm: { lt: km } }, data: { currentKm: km } });
    upd++;
  }
  console.log(`✅ KM atual atualizado em até ${upd} veículos\n`);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('\n❌ ERRO:', e.message);
  process.exit(1);
});
