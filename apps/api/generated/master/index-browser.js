
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

exports.Prisma.PlanScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  maxVehicles: 'maxVehicles',
  maxDrivers: 'maxDrivers',
  maxUsers: 'maxUsers',
  maxBranches: 'maxBranches',
  storageGb: 'storageGb',
  priceMonthly: 'priceMonthly',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.PaymentGatewaySettingsScalarFieldEnum = {
  id: 'id',
  singletonKey: 'singletonKey',
  provider: 'provider',
  environment: 'environment',
  asaasApiKey: 'asaasApiKey',
  asaasWalletId: 'asaasWalletId',
  asaasWebhookToken: 'asaasWebhookToken',
  sicoobClientId: 'sicoobClientId',
  sicoobClientSecret: 'sicoobClientSecret',
  sicoobCertificateBase64: 'sicoobCertificateBase64',
  sicoobPixKey: 'sicoobPixKey',
  isActive: 'isActive',
  updatedAt: 'updatedAt',
  createdAt: 'createdAt'
};

exports.Prisma.CompanyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  cnpj: 'cnpj',
  email: 'email',
  phone: 'phone',
  schemaName: 'schemaName',
  planId: 'planId',
  isActive: 'isActive',
  trialEndsAt: 'trialEndsAt',
  features: 'features',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  id: 'id',
  companyId: 'companyId',
  planId: 'planId',
  status: 'status',
  startsAt: 'startsAt',
  endsAt: 'endsAt',
  cancelledAt: 'cancelledAt',
  createdAt: 'createdAt'
};

exports.Prisma.SuperAdminScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  passwordHash: 'passwordHash',
  isActive: 'isActive',
  refreshTokenHash: 'refreshTokenHash',
  lastLoginAt: 'lastLoginAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BillingCustomerScalarFieldEnum = {
  id: 'id',
  companyId: 'companyId',
  asaasCustomerId: 'asaasCustomerId',
  name: 'name',
  cpfCnpj: 'cpfCnpj',
  email: 'email',
  phone: 'phone',
  postalCode: 'postalCode',
  address: 'address',
  addressNumber: 'addressNumber',
  complement: 'complement',
  province: 'province',
  city: 'city',
  state: 'state',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BillingSubscriptionScalarFieldEnum = {
  id: 'id',
  billingCustomerId: 'billingCustomerId',
  asaasSubscriptionId: 'asaasSubscriptionId',
  planId: 'planId',
  billingType: 'billingType',
  value: 'value',
  nextDueDate: 'nextDueDate',
  cycle: 'cycle',
  status: 'status',
  description: 'description',
  externalReference: 'externalReference',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  billingCustomerId: 'billingCustomerId',
  asaasPaymentId: 'asaasPaymentId',
  value: 'value',
  netValue: 'netValue',
  billingType: 'billingType',
  status: 'status',
  dueDate: 'dueDate',
  paidAt: 'paidAt',
  invoiceUrl: 'invoiceUrl',
  bankSlipUrl: 'bankSlipUrl',
  pixQrCode: 'pixQrCode',
  pixQrCodeImage: 'pixQrCodeImage',
  description: 'description',
  externalReference: 'externalReference',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BillingWebhookLogScalarFieldEnum = {
  id: 'id',
  event: 'event',
  payload: 'payload',
  processed: 'processed',
  error: 'error',
  createdAt: 'createdAt'
};

exports.Prisma.AdminNotificationScalarFieldEnum = {
  id: 'id',
  type: 'type',
  title: 'title',
  message: 'message',
  companyId: 'companyId',
  metadata: 'metadata',
  isRead: 'isRead',
  createdAt: 'createdAt'
};

exports.Prisma.MasterAuditLogScalarFieldEnum = {
  id: 'id',
  companyId: 'companyId',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  userId: 'userId',
  userEmail: 'userEmail',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
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
exports.PlanType = exports.$Enums.PlanType = {
  STARTER: 'STARTER',
  PROFESSIONAL: 'PROFESSIONAL',
  ENTERPRISE: 'ENTERPRISE'
};

exports.PaymentProvider = exports.$Enums.PaymentProvider = {
  ASAAS: 'ASAAS',
  SICOOB: 'SICOOB',
  NONE: 'NONE'
};

exports.PaymentEnvironment = exports.$Enums.PaymentEnvironment = {
  SANDBOX: 'SANDBOX',
  PRODUCTION: 'PRODUCTION'
};

exports.SubscriptionStatus = exports.$Enums.SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  PAST_DUE: 'PAST_DUE',
  TRIALING: 'TRIALING'
};

exports.BillingType = exports.$Enums.BillingType = {
  BOLETO: 'BOLETO',
  CREDIT_CARD: 'CREDIT_CARD',
  PIX: 'PIX',
  UNDEFINED: 'UNDEFINED'
};

exports.BillingCycle = exports.$Enums.BillingCycle = {
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  SEMIANNUALLY: 'SEMIANNUALLY',
  YEARLY: 'YEARLY'
};

exports.BillingSubscriptionStatus = exports.$Enums.BillingSubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  EXPIRED: 'EXPIRED'
};

exports.InvoiceStatus = exports.$Enums.InvoiceStatus = {
  PENDING: 'PENDING',
  RECEIVED: 'RECEIVED',
  CONFIRMED: 'CONFIRMED',
  OVERDUE: 'OVERDUE',
  REFUNDED: 'REFUNDED',
  RECEIVED_IN_CASH: 'RECEIVED_IN_CASH',
  REFUND_REQUESTED: 'REFUND_REQUESTED',
  REFUND_IN_PROGRESS: 'REFUND_IN_PROGRESS',
  CHARGEBACK_REQUESTED: 'CHARGEBACK_REQUESTED',
  CHARGEBACK_DISPUTE: 'CHARGEBACK_DISPUTE',
  AWAITING_CHARGEBACK_REVERSAL: 'AWAITING_CHARGEBACK_REVERSAL',
  DUNNING_REQUESTED: 'DUNNING_REQUESTED',
  DUNNING_RECEIVED: 'DUNNING_RECEIVED',
  AWAITING_RISK_ANALYSIS: 'AWAITING_RISK_ANALYSIS'
};

exports.AdminNotificationType = exports.$Enums.AdminNotificationType = {
  NEW_COMPANY: 'NEW_COMPANY',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  PAYMENT_OVERDUE: 'PAYMENT_OVERDUE',
  SUBSCRIPTION_CANCELLED: 'SUBSCRIPTION_CANCELLED',
  TRIAL_EXPIRING: 'TRIAL_EXPIRING',
  SYSTEM: 'SYSTEM'
};

exports.Prisma.ModelName = {
  Plan: 'Plan',
  PaymentGatewaySettings: 'PaymentGatewaySettings',
  Company: 'Company',
  Subscription: 'Subscription',
  SuperAdmin: 'SuperAdmin',
  BillingCustomer: 'BillingCustomer',
  BillingSubscription: 'BillingSubscription',
  Invoice: 'Invoice',
  BillingWebhookLog: 'BillingWebhookLog',
  AdminNotification: 'AdminNotification',
  MasterAuditLog: 'MasterAuditLog'
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
