/**
 * Seed EFRATAGRO AGRONEGOCIOS LTDA
 * Schema: tenant_e887950794f049bb
 *
 * Reads /Users/helisson/Downloads/PCM - AGROFERT.xlsx
 */

import * as ExcelJS from 'exceljs';
import { PrismaClient } from '../generated/tenant';

const SCHEMA   = 'tenant_e887950794f049bb';
const BRANCH_ID = '2a486933-9745-428c-bb6d-f6a37eba255b';
const ADMIN_ID  = 'c951b4b3-77ce-415d-9ce1-8074a6140ddf';
const XLSX_PATH = '/Users/helisson/Downloads/PCM - AGROFERT.xlsx';

const prisma = new PrismaClient({
  datasources: { db: { url: `postgresql://postgres:postgres@localhost:5432/transrota_master?schema=${SCHEMA}` } },
});

// ─── Cell helpers ─────────────────────────────────────────────────────────────

function str(row: ExcelJS.Row, col: number): string {
  const v = row.getCell(col).value;
  if (v === null || v === undefined) return '';
  if (typeof v === 'object' && 'richText' in (v as any))
    return (v as any).richText.map((r: any) => r.text).join('').trim();
  if (typeof v === 'object' && 'result' in (v as any))
    return String((v as any).result ?? '').trim();
  return String(v).trim();
}

function num(row: ExcelJS.Row, col: number): number | undefined {
  const v = row.getCell(col).value;
  if (v === null || v === undefined || v === '') return undefined;
  if (typeof v === 'object' && 'result' in (v as any)) {
    const n = parseFloat(String((v as any).result));
    return isNaN(n) ? undefined : n;
  }
  const n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? undefined : n;
}

const MIN_DATE = new Date('2020-01-01').getTime();
const MAX_DATE = new Date('2030-12-31').getTime();

function dat(row: ExcelJS.Row, col: number): Date | undefined {
  const v = row.getCell(col).value;
  if (!v) return undefined;
  if (v instanceof Date) {
    const t = v.getTime();
    return isNaN(t) || t < MIN_DATE || t > MAX_DATE ? undefined : v;
  }
  if (typeof v === 'string') {
    const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
      const d = new Date(`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`);
      const t = d.getTime();
      return t < MIN_DATE || t > MAX_DATE ? undefined : d;
    }
    const d = new Date(v);
    const t = d.getTime();
    return isNaN(t) || t < MIN_DATE || t > MAX_DATE ? undefined : d;
  }
  if (typeof v === 'number') {
    const d = new Date((v - 25569) * 86400000);
    const t = d.getTime();
    return isNaN(t) || t < MIN_DATE || t > MAX_DATE ? undefined : d;
  }
  return undefined;
}

function brDate(s: string): Date | undefined {
  if (!s || s === '-' || s === '—') return undefined;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`);
  return undefined;
}

function normPlate(s: string): string { return s.replace(/[\s\-]/g,'').toUpperCase(); }

function fuelEnum(s: string): string {
  const u = s.toUpperCase();
  if (u.includes('DIESEL')) return 'DIESEL';
  if (u.includes('GNV'))    return 'GNV';
  if (u.includes('ELÉTRICO') || u.includes('ELETRICO')) return 'ELECTRIC';
  if (u.includes('ÁLCOOL') || u.includes('ALCOOL') || u.includes('GASOLINA')) return 'FLEX';
  return 'FLEX';
}

function vehicleTypeEnum(s: string): string {
  const u = s.toUpperCase();
  if (u.includes('MOTOCICLETA') || u.includes('MOTONETA')) return 'MOTORCYCLE';
  if (u.includes('CAMINHÃO') || u.includes('CAMINHAO'))    return 'TRUCK';
  if (u.includes('CAMINHONETE'))                           return 'UTILITY';
  return 'CAR';
}

function parseTank(s: string): number | undefined {
  const m = s.match(/^(\d+(?:[.,]\d+)?)\s*[Ll]/);
  return m ? parseFloat(m[1].replace(',','.')) : undefined;
}
function parseHP(s: string): number | undefined {
  const m = s.match(/^(\d+)\s*CV/i); return m ? parseInt(m[1]) : undefined;
}
function parseWeight(s: string): number | undefined {
  const m = s.match(/^(\d+(?:[.,]\d+)?)\s*t/i); return m ? parseFloat(m[1].replace(',','.')) : undefined;
}
function parseYear(s: string): { mfgYear?: number; year?: number } {
  const m = s.match(/^(\d{4})\/(\d{4})$/);
  if (m) return { mfgYear: parseInt(m[1]), year: parseInt(m[2]) };
  const y = parseInt(s); return isNaN(y) ? {} : { year: y };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📂 Loading Excel workbook...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX_PATH);

  // ── 1. DRIVERS ───────────────────────────────────────────────────────────────
  console.log('\n👤 Seeding drivers (CONDUTORES)...');
  const driverMap: Record<string, string> = {}; // UPPERCASE_NAME → id

  const condSheet = wb.getWorksheet('CONDUTORES');
  if (condSheet) {
    const rows: ExcelJS.Row[] = [];
    condSheet.eachRow((r, i) => { if (i >= 3) rows.push(r); });

    for (const row of rows) {
      const name = str(row, 2);
      if (!name || name === 'NOME' || name.startsWith('GESTÃO') || name.length < 3) continue;

      const cpf   = str(row, 10).replace(/\s/g,'') || `000.000.000-${Math.random().toFixed(2).slice(2)}`;
      const licNum = str(row, 11).replace(/\s/g,'') || `00000${Date.now()}`;
      const catRaw = str(row, 12).toUpperCase();
      const validCats = ['A','B','C','D','E','AB','AC','AD','AE'];
      const category  = validCats.includes(catRaw) ? catRaw : 'B';

      const existing = await (prisma as any).driver.findFirst({
        where: { OR: [{ cpf },{ licenseNumber: licNum }] },
      });
      if (existing) { driverMap[name.toUpperCase()] = existing.id; continue; }

      const d = await (prisma as any).driver.create({ data: {
        branchId: BRANCH_ID, name, cpf, phone: '',
        licenseNumber: licNum, licenseCategory: category,
        licenseExpiry: brDate(str(row,6)) ?? new Date('2030-01-01'),
        birthDate: brDate(str(row,3)) ?? dat(row,3) ?? undefined,
        rg: str(row,7) || undefined, rgIssuingOrg: str(row,8) || undefined,
        rgIssuingState: str(row,9) || undefined,
        nationality: str(row,13) || undefined, filiation: str(row,14) || undefined,
        licenseFirstDate: brDate(str(row,4)) ?? dat(row,4) ?? undefined,
        licenseIssueDate: brDate(str(row,5)) ?? dat(row,5) ?? undefined,
        status: 'ACTIVE',
      }});
      driverMap[name.toUpperCase()] = d.id;
      console.log(`  ✅ ${name}`);
    }
  }

  function resolveDriver(name: string): string | undefined {
    if (!name) return undefined;
    const u = name.trim().toUpperCase();
    if (driverMap[u]) return driverMap[u];
    for (const [k,v] of Object.entries(driverMap)) {
      const words = u.split(' ');
      if (k.includes(u) || (words.length >= 2 && k.includes(words[0]) && k.includes(words[1])))
        return v;
    }
    // Match by first name only (last resort)
    const first = u.split(' ')[0];
    for (const [k,v] of Object.entries(driverMap)) {
      if (k.startsWith(first)) return v;
    }
    return undefined;
  }

  // ── 2. VEHICLES ──────────────────────────────────────────────────────────────
  console.log('\n🚗 Seeding vehicles (CADASTRO)...');
  const plateMap: Record<string, string> = {}; // PLATE → id
  const EQUIP_PLATES = new Set(['EMPILHADEIRA','GALÃO','GALAO','GERADOR','GFP9J45','GFP-9J45']);

  const cadSheet = wb.getWorksheet('CADASTRO');
  if (cadSheet) {
    const rows: ExcelJS.Row[] = [];
    cadSheet.eachRow((r, i) => { if (i >= 3) rows.push(r); });

    for (const row of rows) {
      const plate = str(row, 2);
      if (!plate || plate === 'PLACA') continue;
      const np = normPlate(plate);
      if (EQUIP_PLATES.has(np) || EQUIP_PLATES.has(plate)) continue;

      const existing = await (prisma as any).vehicle.findUnique({ where: { plate: np } });
      if (existing) { plateMap[np] = existing.id; continue; }

      const modelFull = str(row, 3);
      const slash = modelFull.indexOf('/');
      const brand = slash > -1 ? modelFull.slice(0, slash).trim() : modelFull;
      const model = slash > -1 ? modelFull.slice(slash+1).trim() : modelFull;
      const { mfgYear, year } = parseYear(str(row, 8));
      const vtype = vehicleTypeEnum(str(row, 5));

      const v = await (prisma as any).vehicle.create({ data: {
        branchId: BRANCH_ID, plate: np, brand, model,
        year: year ?? 2020, manufacturingYear: mfgYear ?? undefined,
        type: vtype, fuelType: fuelEnum(str(row,13)),
        status: 'ACTIVE', currentKm: 0,
        tag: (() => { const n = parseInt(str(row,1)); return isNaN(n) ? undefined : n; })(),
        renavam: str(row,7) || undefined,
        crvNumber: str(row,9) || undefined, chassisNumber: str(row,10) || undefined,
        securityCode: str(row,11) || undefined, engineCode: str(row,12) || undefined,
        category: str(row,14) || undefined,
        tankCapacity: parseTank(str(row,6)), horsepower: str(row,15) || undefined,
        grossWeight: str(row,16) || undefined,
        axles: str(row,17) || undefined,
        cmt: str(row,18) || undefined,
        seats: str(row,19) || undefined,
        responsiblePerson: str(row,20) || undefined,
        oilChangeIntervalKm: vtype === 'MOTORCYCLE' ? 1500 : vtype === 'TRUCK' ? 15000 : 10000,
      }});
      plateMap[np] = v.id;
      console.log(`  ✅ ${np} — ${brand} ${model}`);
    }
  }

  // ── 3. EQUIPMENT ─────────────────────────────────────────────────────────────
  console.log('\n🔧 Seeding equipment...');
  const eqMap: Record<string, string> = {};

  const eqDefs = [
    { identifier:'EMPILHADEIRA', name:'Empilhadeira',       type:'EMPILHADEIRA', tag: 7  },
    { identifier:'GERADOR',      name:'Gerador Drone',      type:'GERADOR',      tag: 32 },
    { identifier:'GALÃO',        name:'Galão Combustível',  type:'OUTRO',        tag: 20 },
    { identifier:'GFP-9J45',     name:'Toyota Hilux Drone', type:'DRONE',        tag: 33 },
  ];
  for (const eq of eqDefs) {
    let rec = await (prisma as any).equipment.findFirst({ where: { identifier: eq.identifier } });
    if (!rec) rec = await (prisma as any).equipment.create({ data: {
      branchId: BRANCH_ID, tag: eq.tag, name: eq.name, type: eq.type,
      identifier: eq.identifier, isActive: true,
    }});
    eqMap[eq.identifier] = rec.id;
    console.log(`  ✅ ${eq.name}`);
  }

  // ── 4. FUEL RECORDS ──────────────────────────────────────────────────────────
  console.log('\n⛽ Seeding fuel records (ABASTECIMENTO)...');
  const abSheet = wb.getWorksheet('ABASTECIMENTO');
  let fuelOk = 0;

  if (abSheet) {
    const batch: any[] = [];
    abSheet.eachRow((row, i) => {
      if (i < 3) return;
      const np = normPlate(str(row,2));
      const vid = plateMap[np];
      if (!vid) return;
      const liters    = num(row,6); if (!liters || liters <= 0) return;
      const totalCost = num(row,7); if (!totalCost || totalCost <= 0) return;
      const km        = num(row,5) ?? 0;
      const ppl       = num(row,8) ?? (totalCost / liters);
      const perf      = dat(row,3) ?? new Date();
      batch.push({
        vehicleId: vid,
        driverId: resolveDriver(str(row,11)) ?? undefined,
        liters, pricePerLiter: ppl, totalCost,
        km, fuelType: fuelEnum(str(row,9)),
        isFullTank: true,
        invoiceNumber: str(row,10) || undefined,
        station: undefined,
        performedAt: perf,
      });
    });

    for (let i = 0; i < batch.length; i += 200) {
      await (prisma as any).fuelRecord.createMany({ data: batch.slice(i,i+200), skipDuplicates: true });
      fuelOk = Math.min(i+200, batch.length);
      process.stdout.write(`  ⛽ ${fuelOk}/${batch.length}\r`);
    }
    console.log(`\n  ✅ ${batch.length} fuel records`);

    // Update vehicle currentKm
    for (const [, vid] of Object.entries(plateMap)) {
      const latest = await (prisma as any).fuelRecord.findFirst({
        where: { vehicleId: vid }, orderBy: { km: 'desc' },
      });
      if (latest?.km) await (prisma as any).vehicle.update({ where: { id: vid }, data: { currentKm: latest.km } });
    }
  }

  // ── 5. OIL CHANGE RECORDS ────────────────────────────────────────────────────
  console.log('\n🔩 Seeding oil changes (TROCA DE ÓLEO)...');
  const oilSheet = wb.getWorksheet('TROCA DE ÓLEO');
  let oilOk = 0;

  if (oilSheet) {
    const rows: ExcelJS.Row[] = [];
    oilSheet.eachRow((r, i) => { if (i >= 3) rows.push(r); });

    for (const row of rows) {
      const plate = str(row,3);
      if (!plate || plate === 'PLACA') continue;
      const np  = normPlate(plate);
      const vid = plateMap[np];
      if (!vid) {
        // Empilhadeira → equipment usage log
        if (np === 'EMPILHADEIRA') {
          const eqId = eqMap['EMPILHADEIRA'];
          const d = dat(row,5);
          if (eqId && d) await (prisma as any).equipmentUsageLog.create({ data: {
            equipmentId: eqId, date: d,
            initialKm: num(row,6) ?? 0, finalKm: num(row,7) ?? 0,
            totalKm: num(row,10) ?? 0,
            notes: `Troca de óleo. ${str(row,13) || ''}`.trim(),
          }}).catch(() => {});
        }
        continue;
      }

      const statusRaw = str(row,9).toUpperCase();
      const status = statusRaw === 'ATRASADO' ? 'OVERDUE'
                   : statusRaw.includes('PRÓXIMO') || statusRaw === 'PROXIMO' ? 'DUE_SOON'
                   : 'UP_TO_DATE';

      await (prisma as any).oilChangeRecord.create({ data: {
        vehicleId: vid,
        changeDate: dat(row,5) ?? undefined,
        changeKm: num(row,6) ?? undefined,
        currentKm: num(row,7) ?? undefined,
        nextChangeKm: num(row,8) ?? undefined,
        status, kmDriven: num(row,10) ?? undefined,
        oilType: str(row,11) || undefined,
        responsibleName: str(row,12) || undefined,
        notes: str(row,13) || undefined,
      }}).catch(() => {});
      oilOk++;
    }
  }
  console.log(`  ✅ ${oilOk} oil change records`);

  // ── 6. MAINTENANCE RECORDS ───────────────────────────────────────────────────
  console.log('\n🔨 Seeding maintenance (MANUTENÇÕES)...');
  const manSheet = wb.getWorksheet('MANUTENÇÕES');
  let manOk = 0;

  if (manSheet) {
    const rows: ExcelJS.Row[] = [];
    manSheet.eachRow((r, i) => { if (i >= 3) rows.push(r); });

    for (const row of rows) {
      const np = normPlate(str(row,2));
      const vid = plateMap[np];
      if (!vid) continue;
      const d = dat(row,3); if (!d) continue;
      const desc = str(row,6); if (!desc || desc === '0') continue;

      const parts  = num(row,7) ?? 0;
      const labor  = num(row,8) ?? 0;
      const total  = num(row,9) ?? (parts + labor);

      await (prisma as any).maintenanceRecord.create({ data: {
        vehicleId: vid,
        performedAt: d, km: num(row,4) ?? 0,
        type: str(row,5) || 'CORRETIVA',
        description: desc, cost: total,
        partsCost: parts > 0 ? parts : undefined,
        laborCost: labor > 0 ? labor : undefined,
        invoiceNumber: str(row,10) || undefined,
        workshopName: str(row,11) || undefined,
        provider: str(row,11) || 'Não informado',
        notes: str(row,12) || undefined,
      }}).catch(() => {});
      manOk++;
    }
  }
  console.log(`  ✅ ${manOk} maintenance records`);

  // ── 7. DAILY KM LOGS ─────────────────────────────────────────────────────────
  console.log('\n📏 Seeding daily KM logs (KMs DIA)...');
  const kmsSheet = wb.getWorksheet('KMs DIA');
  let kmOk = 0;

  if (kmsSheet) {
    const batch: any[] = [];
    kmsSheet.eachRow((row, i) => {
      if (i < 3) return;
      const d = dat(row,1); if (!d) return;
      const conductor = str(row,4); if (!conductor) return;
      const np  = normPlate(str(row,6));
      const vid = plateMap[np]; if (!vid) return;
      const did = resolveDriver(conductor); if (!did) return;
      const ini = num(row,7); const fin = num(row,8);
      if (ini === undefined || fin === undefined) return;
      const pKm = num(row,11) ?? 0;
      const tot = num(row,13) ?? Math.max(0, fin - ini);
      const wKm = num(row,12) ?? Math.max(0, tot - pKm);
      const statusRaw = str(row,14).toUpperCase();
      batch.push({
        vehicleId: vid, driverId: did, date: d,
        dayOfWeek: str(row,3) || undefined,
        initialKm: ini, finalKm: fin,
        personalInitialKm: num(row,9) ?? undefined,
        personalFinalKm:   num(row,10) ?? undefined,
        personalKm: pKm, workKm: wKm, totalKm: tot,
        status: statusRaw === 'NOK' ? 'NOK' : 'OK',
        notes: str(row,15) || undefined,
      });
    });

    for (let i = 0; i < batch.length; i += 300) {
      await (prisma as any).dailyKmLog.createMany({ data: batch.slice(i,i+300), skipDuplicates: true });
      kmOk = Math.min(i+300, batch.length);
      process.stdout.write(`  📏 ${kmOk}/${batch.length}\r`);
    }
    console.log(`\n  ✅ ${batch.length} daily KM logs`);
  }

  // ── 8. VEHICLE BOOKINGS ──────────────────────────────────────────────────────
  console.log('\n📅 Seeding bookings (AG. STRADA)...');
  const bookSheet = wb.getWorksheet('AG. STRADA');
  let bookOk = 0;
  const stradaId = plateMap['RFP0G29'];

  if (bookSheet && stradaId) {
    const rows: ExcelJS.Row[] = [];
    bookSheet.eachRow((r, i) => { if (i >= 4) rows.push(r); });

    for (const row of rows) {
      const d = dat(row,1); if (!d) continue;
      const conductor = str(row,3);
      if (!conductor || conductor.toUpperCase() === 'FERIADO') continue;
      const statusRaw = str(row,5).toUpperCase();
      const status = statusRaw.includes('CONCLU') ? 'COMPLETED'
                   : statusRaw === 'CANCELADO' ? 'CANCELLED'
                   : statusRaw.includes('ANDAMENTO') || statusRaw === 'CONFIRMADO' ? 'CONFIRMED'
                   : 'PENDING';
      await (prisma as any).vehicleBooking.create({ data: {
        vehicleId: stradaId, userId: ADMIN_ID, branchId: BRANCH_ID,
        date: d, timeSlot: str(row,4) || 'DIA TODO',
        purpose: conductor, status,
        notes: str(row,6) || undefined,
      }}).catch(() => {});
      bookOk++;
    }
  }
  console.log(`  ✅ ${bookOk} bookings`);

  // ── 9. VEHICLE MOVEMENTS ─────────────────────────────────────────────────────
  console.log('\n🚦 Seeding vehicle movements (CONTROLE DE CONDUÇÃO)...');
  const movSheet = wb.getWorksheet('CONTROLE DE CONDUÇÃO');
  let movOk = 0;

  if (movSheet) {
    const rows: ExcelJS.Row[] = [];
    movSheet.eachRow((r, i) => { if (i >= 3) rows.push(r); });

    for (const row of rows) {
      const d = dat(row,1); if (!d) return;
      const np = normPlate(str(row,2)); const vid = plateMap[np]; if (!vid) continue;
      const conductor = str(row,5);
      const did = resolveDriver(conductor); if (!did) continue; // required field
      const movRaw = str(row,8).toUpperCase();
      const movType = movRaw === 'CHEGADA' ? 'CHEGADA'
                    : movRaw.includes('INSP') ? 'INSPECAO' : 'SAIDA';

      await (prisma as any).vehicleMovement.create({ data: {
        vehicleId: vid, driverId: did,
        timestamp: d, km: num(row,4) ?? undefined,
        movementType: movType,
        destinationUnit: str(row,7) || undefined,
        notes: str(row,6) || undefined,
      }}).catch(() => {});
      movOk++;
    }
  }
  console.log(`  ✅ ${movOk} vehicle movements`);

  // ── 10. VEHICLE TAXES ────────────────────────────────────────────────────────
  console.log('\n💰 Seeding taxes (FINANCEIRO)...');
  const finSheet = wb.getWorksheet('FINANCEIRO');
  let taxOk = 0;

  if (finSheet) {
    const rows: ExcelJS.Row[] = [];
    finSheet.eachRow((r, i) => { if (i >= 3) rows.push(r); });

    for (const row of rows) {
      const platRaw = str(row,2);
      if (!platRaw || platRaw === 'PLACA' || platRaw === 'TOTAIS') continue;
      const np = normPlate(platRaw);
      const vid = plateMap[np]; if (!vid) continue;
      const statusRaw = str(row,10).toUpperCase();
      const ps = statusRaw === 'PAGO' ? 'PAID' : statusRaw === 'ISENTO' ? 'EXEMPT' : 'PENDING';
      const obs = str(row,11) || undefined;
      const yr  = 2025;

      const ipvaVal = num(row,8);
      if (ipvaVal && ipvaVal > 0) {
        await (prisma as any).vehicleTax.create({ data: {
          vehicleId: vid, type: 'IPVA', year: yr,
          dueDate: dat(row,5) ?? undefined, value: ipvaVal,
          paymentStatus: ps,
          paidAt: ps === 'PAID' ? new Date('2025-03-26') : undefined,
          paidValue: ps === 'PAID' ? ipvaVal : undefined, notes: obs,
        }}).catch(() => {});
        taxOk++;
      }

      const licVal = num(row,6);
      if (licVal && licVal > 0) {
        await (prisma as any).vehicleTax.create({ data: {
          vehicleId: vid, type: 'LICENSING', year: yr,
          dueDate: dat(row,7) ?? undefined, value: licVal,
          paymentStatus: ps,
          paidAt: ps === 'PAID' ? new Date('2025-03-26') : undefined,
          paidValue: ps === 'PAID' ? licVal : undefined, notes: obs,
        }}).catch(() => {});
        taxOk++;
      }
    }
  }
  console.log(`  ✅ ${taxOk} tax records`);

  // ── 11. EQUIPMENT USAGE (DRONE) ──────────────────────────────────────────────
  console.log('\n🚁 Seeding drone/equipment logs...');
  const drSheet = wb.getWorksheet('VALORES E KMS GASTOS PELO DRONE');
  let drOk = 0;

  if (drSheet) {
    const rows: ExcelJS.Row[] = [];
    drSheet.eachRow((r, i) => { if (i >= 3) rows.push(r); });

    for (const row of rows) {
      const d = dat(row,1); if (!d) continue;
      const plateRaw = str(row,3);
      const np = normPlate(plateRaw);
      const eqId = np === 'GERADOR' ? eqMap['GERADOR']
                 : np === 'GFP9J45' ? eqMap['GFP-9J45']
                 : undefined;
      if (!eqId) continue;

      const ini = num(row,4) ?? 0; const fin = num(row,5) ?? 0;
      const tot = num(row,6) ?? Math.max(0, fin - ini);
      const costStr = str(row,7).replace(/R\$|\s|\./g,'').replace(',','.');
      const cost = parseFloat(costStr) || undefined;

      await (prisma as any).equipmentUsageLog.create({ data: {
        equipmentId: eqId, date: d,
        initialKm: ini, finalKm: fin, totalKm: tot,
        totalCost: cost, notes: str(row,8) || undefined,
      }}).catch(() => {});
      drOk++;
    }
  }
  console.log(`  ✅ ${drOk} equipment usage logs`);

  // ── 12. CHECKLIST EXECUTIONS (INSPEÇÃO) ──────────────────────────────────────
  console.log('\n📋 Seeding inspections (INSPEÇÃO)...');
  const inspSheet = wb.getWorksheet('INSPEÇÃO');
  let inspOk = 0;

  // Upsert checklist template
  let tpl = await (prisma as any).checklist.findFirst({ where: { name: 'Inspeção Veicular AGROFERT' } });
  if (!tpl) {
    tpl = await (prisma as any).checklist.create({ data: {
      branchId: BRANCH_ID, name: 'Inspeção Veicular AGROFERT',
      type: 'PRE_TRIP', isActive: true,
      items: { create: [
        { description: 'Elétrica e Iluminação',   isRequired: true,  order: 1, allowPhoto: true, allowNotes: true },
        { description: 'Itens de Segurança',       isRequired: true,  order: 2, allowPhoto: true, allowNotes: true },
        { description: 'Manutenção e Inspeção',    isRequired: true,  order: 3, allowPhoto: true, allowNotes: true },
        { description: 'Componentes Internos',     isRequired: false, order: 4, allowPhoto: true, allowNotes: true },
        { description: 'Documentação',             isRequired: true,  order: 5, allowPhoto: true, allowNotes: true },
        { description: 'Avarias Externas',         isRequired: false, order: 6, allowPhoto: true, allowNotes: true },
        { description: 'Avarias Internas',         isRequired: false, order: 7, allowPhoto: true, allowNotes: true },
      ]},
    }});
    console.log('  ✅ Checklist template created');
  }

  // Pre-fetch first item id
  const firstItem = await (prisma as any).checklistItem.findFirst({
    where: { checklistId: tpl.id }, orderBy: { order: 'asc' },
  });

  if (inspSheet && firstItem) {
    const rows: ExcelJS.Row[] = [];
    inspSheet.eachRow((r, i) => { if (i >= 3) rows.push(r); });

    for (const row of rows) {
      const d = dat(row,1); if (!d) continue;
      const np = normPlate(str(row,4));
      const vid = plateMap[np]; if (!vid) continue;
      const conductor = str(row,3);
      const did = resolveDriver(conductor);
      if (!did) continue; // driverId is required

      const statusRaw = str(row,20).toUpperCase();
      const resStatus = statusRaw === 'REALIZADO' ? 'APPROVED'
                      : statusRaw === 'RESOLVIDO' ? 'RESOLVED' : 'PENDING';
      const extDmg = str(row,8) || undefined;
      const intDmg = str(row,9) || undefined;

      await (prisma as any).checklistExecution.create({ data: {
        checklistId: tpl.id, vehicleId: vid, driverId: did,
        inspectorId: ADMIN_ID,
        executedAt: d,
        hasIssues: !!(extDmg || intDmg),
        fuelLevel: str(row,7) || undefined,
        externalDamage: extDmg, internalDamage: intDmg,
        unitLocation: str(row,18) || undefined,
        resolutionStatus: resStatus,
        responses: { create: [{
          itemId: firstItem.id,
          status: extDmg || intDmg ? 'NOK' : 'OK',
          notes: str(row,21) || undefined,
        }]},
      }}).catch(() => {});
      inspOk++;
    }
  }
  console.log(`  ✅ ${inspOk} inspection executions`);

  // ── Summary ───────────────────────────────────────────────────────────────────
  console.log('\n🎉 Seed completed!\n');
  const [drivers, vehicles, fuel, maintenance, kmLogs, bookings, taxes, equipment] =
    await Promise.all([
      (prisma as any).driver.count(),
      (prisma as any).vehicle.count(),
      (prisma as any).fuelRecord.count(),
      (prisma as any).maintenanceRecord.count(),
      (prisma as any).dailyKmLog.count(),
      (prisma as any).vehicleBooking.count(),
      (prisma as any).vehicleTax.count(),
      (prisma as any).equipment.count(),
    ]);

  console.table({ Motoristas: drivers, Veículos: vehicles, Abastecimentos: fuel,
    Manutenções: maintenance, 'KMs Diários': kmLogs, Agendamentos: bookings,
    Tributos: taxes, Equipamentos: equipment });
}

main()
  .catch(e => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
