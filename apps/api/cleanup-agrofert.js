'use strict';

const { PrismaClient } = require('./generated/tenant');

const SCHEMA = 'tenant_e887950794f049bb';
const DB_URL = `postgresql://postgres:postgres@localhost:5432/transrota_master?schema=${SCHEMA}`;
const prisma = new PrismaClient({ datasources: { db: { url: DB_URL } } });

async function main() {
  await prisma.$connect();
  console.log('🔌 Conectado\n');

  // Ordem respeita FKs: registros dependentes primeiro, depois as entidades
  const r1 = await prisma.dailyKmLog.deleteMany({});
  console.log(`🗑  DailyKmLog:        ${r1.count}`);

  const r2 = await prisma.vehicleMovement.deleteMany({});
  console.log(`🗑  VehicleMovement:   ${r2.count}`);

  const r3 = await prisma.fuelRecord.deleteMany({});
  console.log(`🗑  FuelRecord:        ${r3.count}`);

  const r4 = await prisma.oilChangeRecord.deleteMany({});
  console.log(`🗑  OilChangeRecord:   ${r4.count}`);

  const r5 = await prisma.maintenanceRecord.deleteMany({});
  console.log(`🗑  MaintenanceRecord: ${r5.count}`);

  const r6 = await prisma.vehicle.deleteMany({});
  console.log(`🗑  Vehicle:           ${r6.count}`);

  const r7 = await prisma.driver.deleteMany({});
  console.log(`🗑  Driver:            ${r7.count}`);

  console.log('\n✅ Todos os dados importados foram removidos.');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('\n❌ ERRO:', e.message);
  process.exit(1);
});
