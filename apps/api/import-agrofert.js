/**
 * Importador PCM - AGROFERT → EFRATAGRO AGRONEGOCIOS LTDA
 * Popula: Vehicles, Drivers, FuelRecords, OilChangeRecords,
 *         MaintenanceRecords, VehicleMovements, DailyKmLogs
 */
'use strict';

const Excel   = require('exceljs');
const { PrismaClient } = require('./generated/tenant');

const SCHEMA  = 'tenant_e887950794f049bb';
const DB_URL  = `postgresql://postgres:postgres@localhost:5432/transrota_master?schema=${SCHEMA}`;
const XLSX    = '/Users/helisson/Downloads/PCM - AGROFERT.xlsx';

const prisma  = new PrismaClient({ datasources: { db: { url: DB_URL } } });

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extrai valor de células normais OU de fórmula (retorna result/text) */
function val(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'object') {
    if (v.result  !== undefined) return v.result;
    if (v.richText) return v.richText.map(r => r.text).join('');
    if (v.text    !== undefined) return v.text;
    if (v.formula !== undefined) return null; // sem result
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
  if (y < 1950 || y > 2100) return null; // rejeita datas inválidas/corrompidas
  return result;
}

/** "R$ 283,87" → 283.87  |  number → number */
function parseMoney(v) {
  const raw = val(v);
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === 'number') return raw;
  const clean = String(raw).replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
}

// ─── Mapeamentos de enum ──────────────────────────────────────────────────────

const VEHICLE_TYPE = {
  'PASSAGEIRO AUTOMOVEL':  'CAR',
  'PASSAGEIRO AUTOMÓVEL':  'CAR',
  'AUTOMOVEL':             'CAR',
  'AUTOMÓVEL':             'CAR',
  'MOTOCICLETA':           'MOTORCYCLE',
  'MOTO':                  'MOTORCYCLE',
  'CAMINHAO':              'TRUCK',
  'CAMINHÃO':              'TRUCK',
  'VAN':                   'VAN',
  'VAN FURGAO':            'VAN',
  'VAN FURGÃO':            'VAN',
  'FURGAO':                'VAN',
  'FURGÃO':                'VAN',
  'UTILITARIO':            'UTILITY',
  'UTILITÁRIO':            'UTILITY',
};

const FUEL_TYPE = {
  'ÁLCOOL / GASOLINA':  'FLEX',
  'ALCOOL / GASOLINA':  'FLEX',
  'FLEX':               'FLEX',
  'GASOLINA':           'GASOLINE',
  'ETANOL':             'ETHANOL',
  'ETHANOL':            'ETHANOL',
  'ÁLCOOL':             'ETHANOL',
  'ALCOOL':             'ETHANOL',
  'DIESEL':             'DIESEL',
  'DIESEL S-10':        'DIESEL',
  'DIESEL S10':         'DIESEL',
  'GNV':                'GNV',
  'ELÉTRICO':           'ELECTRIC',
  'ELETRICO':           'ELECTRIC',
};

const OIL_STATUS = {
  'EM DIA':    'UP_TO_DATE',
  'EM DIA ':   'UP_TO_DATE',
  'ATRASADO':  'OVERDUE',
  'PRÓXIMO':   'DUE_SOON',
  'PRÓXIMO ':  'DUE_SOON',
  'PROXIMO':   'DUE_SOON',
};

const LICENSE_CATS = ['A','B','C','D','E','AB','AC','AD','AE'];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await prisma.$connect();
  console.log('🔌 Conectado ao banco de dados\n');

  // Branch padrão
  let branch = await prisma.branch.findFirst();
  if (!branch) {
    branch = await prisma.branch.create({
      data: { name: 'EFRATAGRO AGRONEGOCIOS LTDA', city: 'Não informado', state: 'MG' },
    });
    console.log('🏢 Branch criada:', branch.name);
  }
  const branchId = branch.id;
  console.log(`🏢 Branch: ${branch.name} (${branchId})\n`);

  const wb = new Excel.Workbook();
  await wb.xlsx.readFile(XLSX);
  console.log('📂 Planilha carregada\n');

  // ─── 1. VEÍCULOS (CADASTRO) ───────────────────────────────────────────────

  console.log('─── 1/7  Importando Veículos...');
  const wsV = wb.getWorksheet('CADASTRO');
  let vehicleOk = 0, vehicleSkip = 0;

  for (let r = 3; r <= wsV.rowCount; r++) {
    const row = wsV.getRow(r).values;
    const plate = str(row[2]).replace(/\s/g, '').toUpperCase();
    if (!plate || !/^[A-Z]{3}/.test(plate) || plate.length < 6) { vehicleSkip++; continue; }

    const brandModel   = str(row[3]);
    const sep          = brandModel.indexOf(' / ');
    const brand        = sep > -1 ? brandModel.slice(0, sep) : brandModel;
    const model        = sep > -1 ? brandModel.slice(sep + 3) : brandModel;

    // VIGÊNCIA: número (ano) ou data completa
    const vigRaw   = val(row[4]);
    let documentExpiry = null;
    if (vigRaw instanceof Date) documentExpiry = vigRaw;
    else if (typeof vigRaw === 'number' && vigRaw > 1990 && vigRaw < 2100)
      documentExpiry = new Date(`${vigRaw}-12-31`);

    const tipoRaw   = str(row[5]).toUpperCase();
    const vehicleType = VEHICLE_TYPE[tipoRaw] || 'CAR';

    const tanqueStr = str(row[6]);
    const tankCapacity = parseFloat(tanqueStr) || null;

    const renavam = str(row[7]) || null;

    const fabMod = str(row[8]);
    const yParts = fabMod.split(' / ');
    const manufacturingYear = parseInt(yParts[0]) || new Date().getFullYear();
    const year = parseInt(yParts[1]) || manufacturingYear;

    const crvNumber     = str(row[9])  || null;
    const chassisNumber = str(row[10]) || null;
    const securityCode  = str(row[11]) || null;
    const engineCode    = str(row[12]) || null;

    const fuelRaw   = str(row[13]).toUpperCase().trim();
    const fuelType  = FUEL_TYPE[fuelRaw] || FUEL_TYPE['FLEX'];

    const category        = str(row[14]) || null;
    const horsepower      = str(row[15]) || null;
    const grossWeight     = str(row[16]) || null;
    const axles           = str(row[17]) || null;
    const cmt             = str(row[18]) || null;
    const seats           = str(row[19]) || null;
    const responsiblePerson = str(row[20]) || null;
    const tagRaw = val(row[1]);
    const tag = typeof tagRaw === 'number' ? tagRaw : null;
    const oilInterval = vehicleType === 'MOTORCYCLE' ? 1000 : 10000;

    try {
      await prisma.vehicle.upsert({
        where: { plate },
        create: {
          plate, brand: brand || 'Não informado', model: model || 'Não informado',
          year, manufacturingYear, type: vehicleType, fuelType,
          status: 'ACTIVE', currentKm: 0, branchId,
          tag, renavam, crvNumber, chassisNumber, securityCode, engineCode,
          documentExpiry, category, horsepower, grossWeight, axles, cmt, seats,
          tankCapacity, responsiblePerson, oilChangeIntervalKm: oilInterval,
        },
        update: {
          brand: brand || 'Não informado', model: model || 'Não informado',
          year, manufacturingYear, type: vehicleType, fuelType,
          tag, renavam, crvNumber, chassisNumber, securityCode, engineCode,
          documentExpiry, category, horsepower, grossWeight, axles, cmt, seats,
          tankCapacity, responsiblePerson,
        },
      });
      vehicleOk++;
    } catch (e) { console.warn(`  ⚠  Veículo ${plate}: ${e.message}`); vehicleSkip++; }
  }
  console.log(`   ✅ ${vehicleOk} veículos | ⏭  ${vehicleSkip} ignorados\n`);

  // Mapa plate → {id, currentKm}
  const vehicles = await prisma.vehicle.findMany({ select: { id: true, plate: true, currentKm: true } });
  const vehicleMap = Object.fromEntries(vehicles.map(v => [v.plate, { id: v.id, currentKm: v.currentKm }]));
  // Mutable clone para atualizar currentKm em memória
  const kmTracker = Object.fromEntries(vehicles.map(v => [v.plate, v.currentKm]));

  function trackKm(plate, km) {
    if (km && km > (kmTracker[plate] ?? 0)) kmTracker[plate] = km;
  }

  // ─── 2. MOTORISTAS (CONDUTORES) ───────────────────────────────────────────

  console.log('─── 2/7  Importando Motoristas...');
  const wsD = wb.getWorksheet('CONDUTORES');
  let driverOk = 0, driverSkip = 0;
  /** name.toUpperCase() → driverId */
  const driverNameMap = {};

  for (let r = 4; r <= wsD.rowCount; r++) {
    const row  = wsD.getRow(r).values;
    const name = str(row[2]);
    if (!name || name.length < 3) { driverSkip++; continue; }

    const cpfRaw = str(row[10]).replace(/\D/g, '');
    if (!cpfRaw || cpfRaw.length !== 11) { driverSkip++; continue; }
    const cpf = cpfRaw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    const birthDate         = parseDate(row[3]);
    const licenseFirstDate  = parseDate(row[4]);
    const licenseIssueDate  = parseDate(row[5]);
    const licenseExpiry     = parseDate(row[6]) || new Date('2099-12-31');

    const rg              = str(row[7])  || null;
    const rgIssuingOrg    = str(row[8])  || null;
    const rgIssuingState  = (str(row[9]).slice(0, 2)) || null; // @db.Char(2)

    // licenseNumber do nº de registro (11 dígitos); usa CPF como fallback
    const regRaw   = str(row[11]).replace(/\D/g, '');
    const licNum   = regRaw.length >= 11 ? regRaw.slice(0, 11) : cpfRaw;

    const catRaw   = str(row[12]).toUpperCase().trim();
    const licenseCategory = LICENSE_CATS.includes(catRaw) ? catRaw : 'B';

    const nationality = str(row[13]) || null;
    const filiation   = str(row[14]) || null;

    try {
      const driver = await prisma.driver.upsert({
        where: { cpf },
        create: {
          name, cpf, phone: '(00) 00000-0000',
          licenseNumber: licNum, licenseCategory, licenseExpiry,
          birthDate, rg, rgIssuingOrg, rgIssuingState,
          licenseFirstDate, licenseIssueDate,
          licenseRegistrationNumber: str(row[11]) || null,
          nationality, filiation, status: 'ACTIVE', branchId,
        },
        update: {
          name, licenseExpiry, birthDate, rg, rgIssuingOrg, rgIssuingState,
          licenseFirstDate, licenseIssueDate, nationality, filiation,
        },
      });
      driverOk++;
      driverNameMap[name.toUpperCase()] = driver.id;
    } catch (e) {
      // licenseNumber duplicado — tenta com sufixo único
      try {
        const altLic = cpfRaw; // usa CPF como chave alternativa
        const driver = await prisma.driver.upsert({
          where: { cpf },
          create: {
            name, cpf, phone: '(00) 00000-0000',
            licenseNumber: altLic, licenseCategory, licenseExpiry,
            birthDate, rg, rgIssuingOrg, rgIssuingState,
            licenseFirstDate, licenseIssueDate, nationality, filiation,
            status: 'ACTIVE', branchId,
          },
          update: { name },
        });
        driverOk++;
        driverNameMap[name.toUpperCase()] = driver.id;
      } catch (e2) { console.warn(`  ⚠  Motorista ${name}: ${e2.message}`); driverSkip++; }
    }
  }
  console.log(`   ✅ ${driverOk} motoristas | ⏭  ${driverSkip} ignorados\n`);

  /** Busca driverId pelo nome (exato → parcial primeiro+último) */
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

  // ─── 3. ABASTECIMENTOS (ABASTECIMENTO) ────────────────────────────────────

  console.log('─── 3/7  Importando Abastecimentos...');
  const wsF = wb.getWorksheet('ABASTECIMENTO');
  const fuelData = [];

  for (let r = 4; r <= wsF.rowCount; r++) {
    const row   = wsF.getRow(r).values;
    const plate = str(row[2]).toUpperCase().replace(/\s/g,'');
    const veh   = vehicleMap[plate];
    if (!plate || !veh) continue;

    const performedAt = parseDate(row[3]);
    if (!performedAt) continue;

    const km          = num(row[5]) ?? 0;
    const liters      = num(row[6]) ?? 0;
    if (liters <= 0) continue;

    const totalCost    = parseMoney(row[7]);
    const pplRaw       = parseMoney(row[8]);
    const pricePerLiter = pplRaw > 0 ? pplRaw : (liters > 0 ? totalCost / liters : 0);
    const fuelRaw      = str(row[9]).toUpperCase().trim();
    const fuelType     = FUEL_TYPE[fuelRaw] || FUEL_TYPE[fuelRaw.split(' ')[0]] || 'GASOLINE';
    const invRaw       = val(row[10]);
    const invoiceNumber = invRaw ? String(invRaw) : null;
    const driverName   = val(row[11]);
    const driverId     = findDriver(driverName) || null;

    fuelData.push({
      vehicleId: veh.id, driverId,
      liters, pricePerLiter, totalCost, km, fuelType,
      isFullTank: true, invoiceNumber, performedAt,
    });
    trackKm(plate, km);
  }

  let fuelOk = 0;
  for (let i = 0; i < fuelData.length; i += 100) {
    const chunk = fuelData.slice(i, i + 100);
    const r = await prisma.fuelRecord.createMany({ data: chunk, skipDuplicates: false });
    fuelOk += r.count;
  }
  console.log(`   ✅ ${fuelOk} abastecimentos\n`);

  // ─── 4. TROCA DE ÓLEO (TROCA DE ÓLEO) ────────────────────────────────────

  console.log('─── 4/7  Importando Trocas de Óleo...');
  const wsO = wb.getWorksheet('TROCA DE ÓLEO');
  const oilData = [];

  for (let r = 3; r <= wsO.rowCount; r++) {
    const row   = wsO.getRow(r).values;
    const plate = str(row[3]).toUpperCase().replace(/\s/g,'');
    const veh   = vehicleMap[plate];
    if (!plate || !veh) continue;

    const changeDate   = parseDate(row[5]);
    const changeKm     = num(row[6]);
    if (!changeDate && !changeKm) continue;

    const currentKm   = num(row[7]);
    const nextChangeKm = num(row[8]);
    const statusRaw   = str(row[9]).toUpperCase().trim().replace(/É/g,'E');
    const status      = OIL_STATUS[statusRaw] || OIL_STATUS[str(row[9]).toUpperCase().trim()] || 'UP_TO_DATE';
    const kmDriven    = num(row[10]);
    const oilType     = str(row[11]) || null;
    const responsibleName = str(row[12]) || null;
    const notes       = str(row[13]) || null;

    oilData.push({
      vehicleId: veh.id, changeDate, changeKm, currentKm,
      nextChangeKm, status, kmDriven, oilType, responsibleName, notes,
    });
    trackKm(plate, currentKm);
  }

  let oilOk = 0;
  for (let i = 0; i < oilData.length; i += 100) {
    const r = await prisma.oilChangeRecord.createMany({ data: oilData.slice(i, i+100) });
    oilOk += r.count;
  }
  console.log(`   ✅ ${oilOk} trocas de óleo\n`);

  // ─── 5. MANUTENÇÕES ───────────────────────────────────────────────────────

  console.log('─── 5/7  Importando Manutenções...');
  const wsM = wb.getWorksheet('MANUTENÇÕES');
  const maintData = [];

  for (let r = 4; r <= wsM.rowCount; r++) {
    const row   = wsM.getRow(r).values;
    const plate = str(row[2]).toUpperCase().replace(/\s/g,'');
    const veh   = vehicleMap[plate];
    if (!plate || !veh) continue;

    const performedAt = parseDate(row[3]);
    if (!performedAt) continue;

    const km          = num(row[4]) ?? 0;
    const type        = str(row[5]).toLowerCase() || 'corretiva';
    const description = str(row[6]);
    if (!description) continue;

    const partsCost   = num(row[7]) ?? 0;
    const laborCost   = num(row[8]) ?? 0;
    const costRaw     = val(row[9]);
    const cost        = typeof costRaw === 'number' ? costRaw : parseMoney(row[9]) || (partsCost + laborCost);
    const invRaw      = val(row[10]);
    const invoiceNumber = invRaw ? String(invRaw) : null;
    const workshopName  = str(row[11]) || null;
    const notes         = str(row[12]) || null;

    maintData.push({
      vehicleId: veh.id, type, description,
      cost, partsCost, laborCost, km, performedAt,
      provider: workshopName || 'Não informado', workshopName, invoiceNumber, notes,
    });
    trackKm(plate, km);
  }

  let maintOk = 0;
  for (let i = 0; i < maintData.length; i += 100) {
    const r = await prisma.maintenanceRecord.createMany({ data: maintData.slice(i, i+100) });
    maintOk += r.count;
  }
  console.log(`   ✅ ${maintOk} manutenções\n`);

  // ─── 6. CONTROLE DE CONDUÇÃO → VehicleMovement ───────────────────────────

  console.log('─── 6/7  Importando Movimentações...');
  const wsMov = wb.getWorksheet('CONTROLE DE CONDUÇÃO');
  const movData = [];
  let movSkip = 0;

  for (let r = 4; r <= wsMov.rowCount; r++) {
    const row       = wsMov.getRow(r).values;
    const plate     = str(row[2]).toUpperCase().replace(/\s/g,'');
    const veh       = vehicleMap[plate];
    if (!plate || !veh) continue;

    const timestamp = parseDate(row[1]);
    if (!timestamp) continue;

    const driverId    = findDriver(val(row[5]));
    if (!driverId) { movSkip++; continue; }

    const km              = num(row[4]);
    const movementType    = str(row[8]) || null;
    const destinationUnit = str(row[7]) || null;
    const notes           = str(row[6]) || null;

    movData.push({ vehicleId: veh.id, driverId, timestamp, km, movementType, destinationUnit, notes });
    trackKm(plate, km);
  }

  let movOk = 0;
  for (let i = 0; i < movData.length; i += 100) {
    const r = await prisma.vehicleMovement.createMany({ data: movData.slice(i, i+100) });
    movOk += r.count;
  }
  console.log(`   ✅ ${movOk} movimentações | ⏭  ${movSkip} sem motorista mapeado\n`);

  // ─── 7. KMs DIA → DailyKmLog ─────────────────────────────────────────────

  console.log('─── 7/7  Importando KM Diário...');
  const wsKm = wb.getWorksheet('KMs DIA');
  const kmData = [];
  let kmSkip = 0;

  for (let r = 3; r <= wsKm.rowCount; r++) {
    const row   = wsKm.getRow(r).values;
    const plate = str(row[6]).toUpperCase().replace(/\s/g,'');
    const veh   = vehicleMap[plate];
    if (!plate || !veh) continue;

    const date = parseDate(row[1]);
    if (!date) continue;

    const driverId = findDriver(val(row[4]));
    if (!driverId) { kmSkip++; continue; }

    const initialKm       = num(row[7]) ?? 0;
    const finalKm         = num(row[8]) ?? 0;
    if (initialKm === 0 && finalKm === 0) continue;

    const personalInitialKm = num(row[9]);
    const personalFinalKm   = num(row[10]);
    const personalKm        = num(row[11]) ?? 0;
    const workKm            = num(row[12]) ?? 0;
    const totalKm           = num(row[13]) ?? 0;
    const statusRaw         = str(row[14]).toUpperCase();
    const status            = statusRaw === 'NOK' ? 'NOK' : 'OK';
    const dayOfWeek         = str(row[3]) || null;
    const notes             = str(row[15]) || null;

    kmData.push({
      vehicleId: veh.id, driverId, date, dayOfWeek,
      initialKm, finalKm, personalInitialKm, personalFinalKm,
      personalKm, workKm, totalKm, status, notes,
    });
    trackKm(plate, finalKm);
  }

  let kmOk = 0;
  for (let i = 0; i < kmData.length; i += 200) {
    const r = await prisma.dailyKmLog.createMany({ data: kmData.slice(i, i+200) });
    kmOk += r.count;
  }
  console.log(`   ✅ ${kmOk} registros KM diário | ⏭  ${kmSkip} sem motorista mapeado\n`);

  // ─── 8. Atualiza currentKm dos veículos ───────────────────────────────────

  console.log('─── Atualizando KM atual dos veículos...');
  let kmUpdates = 0;
  const origKm = Object.fromEntries(vehicles.map(v => [v.plate, v.currentKm]));
  for (const [plate, km] of Object.entries(kmTracker)) {
    if (km > (origKm[plate] ?? 0) && vehicleMap[plate]) {
      await prisma.vehicle.update({
        where: { id: vehicleMap[plate].id },
        data: { currentKm: km },
      });
      kmUpdates++;
    }
  }
  console.log(`   ✅ ${kmUpdates} veículos com KM atualizado\n`);

  // ─── Resumo ───────────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════');
  console.log('  IMPORTAÇÃO CONCLUÍDA — EFRATAGRO AGRONEG.');
  console.log('═══════════════════════════════════════════');
  console.log(`  Veículos:        ${vehicleOk}`);
  console.log(`  Motoristas:      ${driverOk}`);
  console.log(`  Abastecimentos:  ${fuelOk}`);
  console.log(`  Troca de óleo:   ${oilOk}`);
  console.log(`  Manutenções:     ${maintOk}`);
  console.log(`  Movimentações:   ${movOk}`);
  console.log(`  KM Diário:       ${kmOk}`);
  console.log('═══════════════════════════════════════════\n');

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('\n❌ ERRO FATAL:', e.message);
  console.error(e.stack);
  process.exit(1);
});
