
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.BranchScalarFieldEnum = {
  id: 'id',
  name: 'name',
  cnpj: 'cnpj',
  address: 'address',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  phone: 'phone',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  passwordHash: 'passwordHash',
  role: 'role',
  branchId: 'branchId',
  isActive: 'isActive',
  lastLoginAt: 'lastLoginAt',
  refreshTokenHash: 'refreshTokenHash',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VehicleScalarFieldEnum = {
  id: 'id',
  plate: 'plate',
  model: 'model',
  brand: 'brand',
  year: 'year',
  manufacturingYear: 'manufacturingYear',
  type: 'type',
  fuelType: 'fuelType',
  status: 'status',
  currentKm: 'currentKm',
  nextMaintenanceKm: 'nextMaintenanceKm',
  nextMaintenanceDate: 'nextMaintenanceDate',
  tag: 'tag',
  renavam: 'renavam',
  crvNumber: 'crvNumber',
  chassisNumber: 'chassisNumber',
  securityCode: 'securityCode',
  engineCode: 'engineCode',
  documentExpiry: 'documentExpiry',
  responsiblePerson: 'responsiblePerson',
  tankCapacity: 'tankCapacity',
  horsepower: 'horsepower',
  grossWeight: 'grossWeight',
  axles: 'axles',
  cmt: 'cmt',
  seats: 'seats',
  category: 'category',
  oilChangeIntervalKm: 'oilChangeIntervalKm',
  branchId: 'branchId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MaintenanceRecordScalarFieldEnum = {
  id: 'id',
  vehicleId: 'vehicleId',
  type: 'type',
  description: 'description',
  cost: 'cost',
  partsCost: 'partsCost',
  laborCost: 'laborCost',
  km: 'km',
  performedAt: 'performedAt',
  nextDueKm: 'nextDueKm',
  nextDueDate: 'nextDueDate',
  provider: 'provider',
  workshopName: 'workshopName',
  invoiceNumber: 'invoiceNumber',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.FuelRecordScalarFieldEnum = {
  id: 'id',
  vehicleId: 'vehicleId',
  driverId: 'driverId',
  liters: 'liters',
  pricePerLiter: 'pricePerLiter',
  totalCost: 'totalCost',
  km: 'km',
  fuelType: 'fuelType',
  isFullTank: 'isFullTank',
  station: 'station',
  invoiceNumber: 'invoiceNumber',
  performedAt: 'performedAt',
  createdAt: 'createdAt'
};

exports.Prisma.OilChangeRecordScalarFieldEnum = {
  id: 'id',
  vehicleId: 'vehicleId',
  changeDate: 'changeDate',
  changeKm: 'changeKm',
  currentKm: 'currentKm',
  nextChangeKm: 'nextChangeKm',
  status: 'status',
  kmDriven: 'kmDriven',
  oilType: 'oilType',
  responsibleName: 'responsibleName',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DriverScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  name: 'name',
  cpf: 'cpf',
  phone: 'phone',
  licenseNumber: 'licenseNumber',
  licenseCategory: 'licenseCategory',
  licenseExpiry: 'licenseExpiry',
  birthDate: 'birthDate',
  rg: 'rg',
  rgIssuingOrg: 'rgIssuingOrg',
  rgIssuingState: 'rgIssuingState',
  nationality: 'nationality',
  filiation: 'filiation',
  licenseFirstDate: 'licenseFirstDate',
  licenseIssueDate: 'licenseIssueDate',
  licenseIssuingOrg: 'licenseIssuingOrg',
  licenseIssuingState: 'licenseIssuingState',
  licenseRegistrationNumber: 'licenseRegistrationNumber',
  status: 'status',
  branchId: 'branchId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DriverDocumentScalarFieldEnum = {
  id: 'id',
  driverId: 'driverId',
  type: 'type',
  description: 'description',
  fileUrl: 'fileUrl',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.DailyKmLogScalarFieldEnum = {
  id: 'id',
  vehicleId: 'vehicleId',
  driverId: 'driverId',
  date: 'date',
  dayOfWeek: 'dayOfWeek',
  initialKm: 'initialKm',
  finalKm: 'finalKm',
  personalInitialKm: 'personalInitialKm',
  personalFinalKm: 'personalFinalKm',
  personalKm: 'personalKm',
  workKm: 'workKm',
  totalKm: 'totalKm',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VehicleMovementScalarFieldEnum = {
  id: 'id',
  vehicleId: 'vehicleId',
  driverId: 'driverId',
  timestamp: 'timestamp',
  km: 'km',
  movementType: 'movementType',
  destinationUnit: 'destinationUnit',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.VehicleBookingScalarFieldEnum = {
  id: 'id',
  vehicleId: 'vehicleId',
  userId: 'userId',
  branchId: 'branchId',
  date: 'date',
  timeSlot: 'timeSlot',
  purpose: 'purpose',
  status: 'status',
  confirmedBy: 'confirmedBy',
  confirmedAt: 'confirmedAt',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VehicleTaxScalarFieldEnum = {
  id: 'id',
  vehicleId: 'vehicleId',
  type: 'type',
  year: 'year',
  dueDate: 'dueDate',
  value: 'value',
  paymentStatus: 'paymentStatus',
  paidAt: 'paidAt',
  paidValue: 'paidValue',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EquipmentScalarFieldEnum = {
  id: 'id',
  tag: 'tag',
  name: 'name',
  type: 'type',
  identifier: 'identifier',
  isActive: 'isActive',
  branchId: 'branchId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EquipmentUsageLogScalarFieldEnum = {
  id: 'id',
  equipmentId: 'equipmentId',
  date: 'date',
  initialKm: 'initialKm',
  finalKm: 'finalKm',
  totalKm: 'totalKm',
  totalCost: 'totalCost',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.RouteScalarFieldEnum = {
  id: 'id',
  name: 'name',
  vehicleId: 'vehicleId',
  driverId: 'driverId',
  branchId: 'branchId',
  status: 'status',
  scheduledDate: 'scheduledDate',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  totalDistance: 'totalDistance',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RouteStopScalarFieldEnum = {
  id: 'id',
  routeId: 'routeId',
  sequence: 'sequence',
  clientName: 'clientName',
  clientDocument: 'clientDocument',
  address: 'address',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  lat: 'lat',
  lng: 'lng',
  timeWindowStart: 'timeWindowStart',
  timeWindowEnd: 'timeWindowEnd',
  status: 'status',
  nonDeliveryReason: 'nonDeliveryReason',
  notes: 'notes',
  arrivedAt: 'arrivedAt',
  completedAt: 'completedAt',
  createdAt: 'createdAt'
};

exports.Prisma.DeliveryItemScalarFieldEnum = {
  id: 'id',
  stopId: 'stopId',
  description: 'description',
  quantity: 'quantity',
  deliveredQuantity: 'deliveredQuantity',
  weight: 'weight',
  nfeNumber: 'nfeNumber',
  barcode: 'barcode',
  createdAt: 'createdAt'
};

exports.Prisma.DeliveryProofScalarFieldEnum = {
  id: 'id',
  stopId: 'stopId',
  photoUrl: 'photoUrl',
  signatureUrl: 'signatureUrl',
  lat: 'lat',
  lng: 'lng',
  receiverName: 'receiverName',
  receiverDocument: 'receiverDocument',
  createdAt: 'createdAt'
};

exports.Prisma.ChecklistScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  branchId: 'branchId',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.ChecklistItemScalarFieldEnum = {
  id: 'id',
  checklistId: 'checklistId',
  description: 'description',
  isRequired: 'isRequired',
  order: 'order',
  allowPhoto: 'allowPhoto',
  allowNotes: 'allowNotes',
  createdAt: 'createdAt'
};

exports.Prisma.ChecklistExecutionScalarFieldEnum = {
  id: 'id',
  checklistId: 'checklistId',
  vehicleId: 'vehicleId',
  driverId: 'driverId',
  routeId: 'routeId',
  executedAt: 'executedAt',
  hasIssues: 'hasIssues',
  inspectorId: 'inspectorId',
  fuelLevel: 'fuelLevel',
  externalDamage: 'externalDamage',
  internalDamage: 'internalDamage',
  unitLocation: 'unitLocation',
  attachments: 'attachments',
  resolutionStatus: 'resolutionStatus',
  resolvedById: 'resolvedById',
  resolvedAt: 'resolvedAt'
};

exports.Prisma.ChecklistResponseScalarFieldEnum = {
  id: 'id',
  executionId: 'executionId',
  itemId: 'itemId',
  status: 'status',
  notes: 'notes',
  photoUrl: 'photoUrl',
  createdAt: 'createdAt'
};

exports.Prisma.TenantAuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  before: 'before',
  after: 'after',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.CostCenterScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FinancialEntryScalarFieldEnum = {
  id: 'id',
  type: 'type',
  category: 'category',
  description: 'description',
  amount: 'amount',
  dueDate: 'dueDate',
  paymentDate: 'paymentDate',
  status: 'status',
  paymentMethod: 'paymentMethod',
  documentNumber: 'documentNumber',
  costCenterId: 'costCenterId',
  vehicleId: 'vehicleId',
  driverId: 'driverId',
  recurrence: 'recurrence',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DriverCommissionScalarFieldEnum = {
  id: 'id',
  driverId: 'driverId',
  period: 'period',
  routeCount: 'routeCount',
  baseAmount: 'baseAmount',
  percentage: 'percentage',
  amount: 'amount',
  bonus: 'bonus',
  deductions: 'deductions',
  netAmount: 'netAmount',
  status: 'status',
  paidAt: 'paidAt',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  color: 'color',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  sku: 'sku',
  name: 'name',
  description: 'description',
  type: 'type',
  unit: 'unit',
  categoryId: 'categoryId',
  costPrice: 'costPrice',
  salePrice: 'salePrice',
  minStock: 'minStock',
  maxStock: 'maxStock',
  imageUrl: 'imageUrl',
  barcode: 'barcode',
  isActive: 'isActive',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BOMScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  yield: 'yield',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BOMItemScalarFieldEnum = {
  id: 'id',
  bomId: 'bomId',
  componentId: 'componentId',
  quantity: 'quantity',
  unit: 'unit',
  lossPercent: 'lossPercent',
  notes: 'notes'
};

exports.Prisma.StockLocationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StockItemScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  locationId: 'locationId',
  quantity: 'quantity',
  updatedAt: 'updatedAt'
};

exports.Prisma.StockMovementScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  type: 'type',
  quantity: 'quantity',
  unitCost: 'unitCost',
  totalCost: 'totalCost',
  locationId: 'locationId',
  reason: 'reason',
  referenceId: 'referenceId',
  referenceType: 'referenceType',
  performedById: 'performedById',
  createdAt: 'createdAt'
};

exports.Prisma.ProductionOrderScalarFieldEnum = {
  id: 'id',
  number: 'number',
  productId: 'productId',
  quantity: 'quantity',
  status: 'status',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductionOrderItemScalarFieldEnum = {
  id: 'id',
  productionOrderId: 'productionOrderId',
  componentName: 'componentName',
  requiredQty: 'requiredQty',
  consumedQty: 'consumedQty'
};

exports.Prisma.SellerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  cpf: 'cpf',
  commission: 'commission',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientScalarFieldEnum = {
  id: 'id',
  name: 'name',
  doc: 'doc',
  email: 'email',
  phone: 'phone',
  address: 'address',
  city: 'city',
  state: 'state',
  notes: 'notes',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupplierScalarFieldEnum = {
  id: 'id',
  name: 'name',
  tradeName: 'tradeName',
  cnpj: 'cnpj',
  cpf: 'cpf',
  email: 'email',
  phone: 'phone',
  address: 'address',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  notes: 'notes',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupplierProductScalarFieldEnum = {
  id: 'id',
  supplierId: 'supplierId',
  productId: 'productId',
  supplierSku: 'supplierSku',
  lastPrice: 'lastPrice',
  leadTimeDays: 'leadTimeDays',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PurchaseOrderScalarFieldEnum = {
  id: 'id',
  number: 'number',
  supplierId: 'supplierId',
  status: 'status',
  isPriceLocked: 'isPriceLocked',
  isSafra: 'isSafra',
  safra: 'safra',
  subtotal: 'subtotal',
  discount: 'discount',
  total: 'total',
  notes: 'notes',
  dueDate: 'dueDate',
  receivedAt: 'receivedAt',
  invoiceNumber: 'invoiceNumber',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PurchaseOrderItemScalarFieldEnum = {
  id: 'id',
  purchaseOrderId: 'purchaseOrderId',
  productId: 'productId',
  quantity: 'quantity',
  receivedQty: 'receivedQty',
  unitPrice: 'unitPrice',
  discount: 'discount',
  total: 'total'
};

exports.Prisma.SaleOrderScalarFieldEnum = {
  id: 'id',
  number: 'number',
  clientId: 'clientId',
  clientName: 'clientName',
  clientDoc: 'clientDoc',
  clientEmail: 'clientEmail',
  clientPhone: 'clientPhone',
  clientAddress: 'clientAddress',
  sellerId: 'sellerId',
  supplierId: 'supplierId',
  status: 'status',
  deliveryStatus: 'deliveryStatus',
  isPriceLocked: 'isPriceLocked',
  isSafra: 'isSafra',
  safra: 'safra',
  invoiceNumber: 'invoiceNumber',
  paymentMethod: 'paymentMethod',
  subtotal: 'subtotal',
  discount: 'discount',
  total: 'total',
  notes: 'notes',
  dueDate: 'dueDate',
  deliveredAt: 'deliveredAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SaleOrderItemScalarFieldEnum = {
  id: 'id',
  saleOrderId: 'saleOrderId',
  productId: 'productId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  discount: 'discount',
  total: 'total'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  OPERATOR: 'OPERATOR',
  DRIVER: 'DRIVER',
  VIEWER: 'VIEWER'
};

exports.VehicleType = exports.$Enums.VehicleType = {
  TRUCK: 'TRUCK',
  VAN: 'VAN',
  MOTORCYCLE: 'MOTORCYCLE',
  CAR: 'CAR',
  UTILITY: 'UTILITY'
};

exports.FuelType = exports.$Enums.FuelType = {
  GASOLINE: 'GASOLINE',
  ETHANOL: 'ETHANOL',
  DIESEL: 'DIESEL',
  GNV: 'GNV',
  ELECTRIC: 'ELECTRIC',
  FLEX: 'FLEX'
};

exports.VehicleStatus = exports.$Enums.VehicleStatus = {
  ACTIVE: 'ACTIVE',
  MAINTENANCE: 'MAINTENANCE',
  INACTIVE: 'INACTIVE'
};

exports.OilChangeStatus = exports.$Enums.OilChangeStatus = {
  UP_TO_DATE: 'UP_TO_DATE',
  OVERDUE: 'OVERDUE',
  DUE_SOON: 'DUE_SOON'
};

exports.LicenseCategory = exports.$Enums.LicenseCategory = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  AB: 'AB',
  AC: 'AC',
  AD: 'AD',
  AE: 'AE'
};

exports.DriverStatus = exports.$Enums.DriverStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  ON_LEAVE: 'ON_LEAVE'
};

exports.DailyKmStatus = exports.$Enums.DailyKmStatus = {
  OK: 'OK',
  NOK: 'NOK'
};

exports.BookingStatus = exports.$Enums.BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

exports.TaxType = exports.$Enums.TaxType = {
  IPVA: 'IPVA',
  LICENSING: 'LICENSING',
  INSURANCE: 'INSURANCE',
  FINE: 'FINE',
  OTHER: 'OTHER'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  EXEMPT: 'EXEMPT'
};

exports.RouteStatus = exports.$Enums.RouteStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.StopStatus = exports.$Enums.StopStatus = {
  PENDING: 'PENDING',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  PARTIAL_DELIVERY: 'PARTIAL_DELIVERY',
  NOT_DELIVERED: 'NOT_DELIVERED',
  RESCHEDULED: 'RESCHEDULED'
};

exports.NonDeliveryReason = exports.$Enums.NonDeliveryReason = {
  ABSENT_RECIPIENT: 'ABSENT_RECIPIENT',
  REFUSED: 'REFUSED',
  WRONG_ADDRESS: 'WRONG_ADDRESS',
  DAMAGED_GOODS: 'DAMAGED_GOODS',
  SECURITY: 'SECURITY',
  OTHER: 'OTHER'
};

exports.ChecklistType = exports.$Enums.ChecklistType = {
  PRE_TRIP: 'PRE_TRIP',
  POST_TRIP: 'POST_TRIP',
  MAINTENANCE: 'MAINTENANCE'
};

exports.InspectionStatus = exports.$Enums.InspectionStatus = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  APPROVED: 'APPROVED'
};

exports.ChecklistItemStatus = exports.$Enums.ChecklistItemStatus = {
  OK: 'OK',
  NOK: 'NOK',
  NA: 'NA'
};

exports.FinancialType = exports.$Enums.FinancialType = {
  PAYABLE: 'PAYABLE',
  RECEIVABLE: 'RECEIVABLE'
};

exports.FinancialCategory = exports.$Enums.FinancialCategory = {
  FUEL: 'FUEL',
  MAINTENANCE: 'MAINTENANCE',
  INSURANCE: 'INSURANCE',
  TAX: 'TAX',
  TOLL: 'TOLL',
  SALARY: 'SALARY',
  COMMISSION: 'COMMISSION',
  SUPPLIER: 'SUPPLIER',
  RENT: 'RENT',
  UTILITIES: 'UTILITIES',
  SERVICE: 'SERVICE',
  CONTRACT: 'CONTRACT',
  BONUS: 'BONUS',
  REIMBURSEMENT: 'REIMBURSEMENT',
  OTHER: 'OTHER'
};

exports.FinancialStatus = exports.$Enums.FinancialStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  RECEIVED: 'RECEIVED',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
  PARTIAL: 'PARTIAL'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  PIX: 'PIX',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  BOLETO: 'BOLETO',
  CHECK: 'CHECK'
};

exports.Recurrence = exports.$Enums.Recurrence = {
  NONE: 'NONE',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  YEARLY: 'YEARLY'
};

exports.CommissionStatus = exports.$Enums.CommissionStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED'
};

exports.ProductType = exports.$Enums.ProductType = {
  RAW_MATERIAL: 'RAW_MATERIAL',
  SEMI_FINISHED: 'SEMI_FINISHED',
  FINISHED_GOOD: 'FINISHED_GOOD',
  SERVICE: 'SERVICE'
};

exports.UnitOfMeasure = exports.$Enums.UnitOfMeasure = {
  UN: 'UN',
  KG: 'KG',
  G: 'G',
  L: 'L',
  ML: 'ML',
  M: 'M',
  CM: 'CM',
  M2: 'M2',
  M3: 'M3',
  CX: 'CX',
  PC: 'PC',
  PR: 'PR',
  FD: 'FD',
  SC: 'SC'
};

exports.StockMovementType = exports.$Enums.StockMovementType = {
  ENTRY: 'ENTRY',
  EXIT: 'EXIT',
  ADJUSTMENT: 'ADJUSTMENT',
  PRODUCTION_IN: 'PRODUCTION_IN',
  PRODUCTION_OUT: 'PRODUCTION_OUT',
  SALE_OUT: 'SALE_OUT',
  TRANSFER_IN: 'TRANSFER_IN',
  TRANSFER_OUT: 'TRANSFER_OUT',
  LOSS: 'LOSS'
};

exports.ProductionOrderStatus = exports.$Enums.ProductionOrderStatus = {
  DRAFT: 'DRAFT',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.PurchaseOrderStatus = exports.$Enums.PurchaseOrderStatus = {
  DRAFT: 'DRAFT',
  CONFIRMED: 'CONFIRMED',
  PARTIALLY_RECEIVED: 'PARTIALLY_RECEIVED',
  RECEIVED: 'RECEIVED',
  CANCELLED: 'CANCELLED'
};

exports.SaleOrderStatus = exports.$Enums.SaleOrderStatus = {
  DRAFT: 'DRAFT',
  CONFIRMED: 'CONFIRMED',
  PARTIALLY_DELIVERED: 'PARTIALLY_DELIVERED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  INVOICED: 'INVOICED'
};

exports.DeliveryStatus = exports.$Enums.DeliveryStatus = {
  PENDING: 'PENDING',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED'
};

exports.Prisma.ModelName = {
  Branch: 'Branch',
  User: 'User',
  Vehicle: 'Vehicle',
  MaintenanceRecord: 'MaintenanceRecord',
  FuelRecord: 'FuelRecord',
  OilChangeRecord: 'OilChangeRecord',
  Driver: 'Driver',
  DriverDocument: 'DriverDocument',
  DailyKmLog: 'DailyKmLog',
  VehicleMovement: 'VehicleMovement',
  VehicleBooking: 'VehicleBooking',
  VehicleTax: 'VehicleTax',
  Equipment: 'Equipment',
  EquipmentUsageLog: 'EquipmentUsageLog',
  Route: 'Route',
  RouteStop: 'RouteStop',
  DeliveryItem: 'DeliveryItem',
  DeliveryProof: 'DeliveryProof',
  Checklist: 'Checklist',
  ChecklistItem: 'ChecklistItem',
  ChecklistExecution: 'ChecklistExecution',
  ChecklistResponse: 'ChecklistResponse',
  TenantAuditLog: 'TenantAuditLog',
  CostCenter: 'CostCenter',
  FinancialEntry: 'FinancialEntry',
  DriverCommission: 'DriverCommission',
  ProductCategory: 'ProductCategory',
  Product: 'Product',
  BOM: 'BOM',
  BOMItem: 'BOMItem',
  StockLocation: 'StockLocation',
  StockItem: 'StockItem',
  StockMovement: 'StockMovement',
  ProductionOrder: 'ProductionOrder',
  ProductionOrderItem: 'ProductionOrderItem',
  Seller: 'Seller',
  Client: 'Client',
  Supplier: 'Supplier',
  SupplierProduct: 'SupplierProduct',
  PurchaseOrder: 'PurchaseOrder',
  PurchaseOrderItem: 'PurchaseOrderItem',
  SaleOrder: 'SaleOrder',
  SaleOrderItem: 'SaleOrderItem'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
