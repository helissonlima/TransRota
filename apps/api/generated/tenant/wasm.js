
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
  type: 'type',
  fuelType: 'fuelType',
  status: 'status',
  currentKm: 'currentKm',
  nextMaintenanceKm: 'nextMaintenanceKm',
  nextMaintenanceDate: 'nextMaintenanceDate',
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
  km: 'km',
  performedAt: 'performedAt',
  nextDueKm: 'nextDueKm',
  nextDueDate: 'nextDueDate',
  provider: 'provider',
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
  performedAt: 'performedAt',
  createdAt: 'createdAt'
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
  hasIssues: 'hasIssues'
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

exports.ChecklistItemStatus = exports.$Enums.ChecklistItemStatus = {
  OK: 'OK',
  NOK: 'NOK',
  NA: 'NA'
};

exports.Prisma.ModelName = {
  Branch: 'Branch',
  User: 'User',
  Vehicle: 'Vehicle',
  MaintenanceRecord: 'MaintenanceRecord',
  FuelRecord: 'FuelRecord',
  Driver: 'Driver',
  DriverDocument: 'DriverDocument',
  Route: 'Route',
  RouteStop: 'RouteStop',
  DeliveryItem: 'DeliveryItem',
  DeliveryProof: 'DeliveryProof',
  Checklist: 'Checklist',
  ChecklistItem: 'ChecklistItem',
  ChecklistExecution: 'ChecklistExecution',
  ChecklistResponse: 'ChecklistResponse',
  TenantAuditLog: 'TenantAuditLog'
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
