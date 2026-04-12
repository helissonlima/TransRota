
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Plan
 * 
 */
export type Plan = $Result.DefaultSelection<Prisma.$PlanPayload>
/**
 * Model PaymentGatewaySettings
 * 
 */
export type PaymentGatewaySettings = $Result.DefaultSelection<Prisma.$PaymentGatewaySettingsPayload>
/**
 * Model Company
 * 
 */
export type Company = $Result.DefaultSelection<Prisma.$CompanyPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model SuperAdmin
 * 
 */
export type SuperAdmin = $Result.DefaultSelection<Prisma.$SuperAdminPayload>
/**
 * Model BillingCustomer
 * 
 */
export type BillingCustomer = $Result.DefaultSelection<Prisma.$BillingCustomerPayload>
/**
 * Model BillingSubscription
 * 
 */
export type BillingSubscription = $Result.DefaultSelection<Prisma.$BillingSubscriptionPayload>
/**
 * Model Invoice
 * 
 */
export type Invoice = $Result.DefaultSelection<Prisma.$InvoicePayload>
/**
 * Model BillingWebhookLog
 * 
 */
export type BillingWebhookLog = $Result.DefaultSelection<Prisma.$BillingWebhookLogPayload>
/**
 * Model AdminNotification
 * 
 */
export type AdminNotification = $Result.DefaultSelection<Prisma.$AdminNotificationPayload>
/**
 * Model MasterAuditLog
 * 
 */
export type MasterAuditLog = $Result.DefaultSelection<Prisma.$MasterAuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PlanType: {
  STARTER: 'STARTER',
  PROFESSIONAL: 'PROFESSIONAL',
  ENTERPRISE: 'ENTERPRISE'
};

export type PlanType = (typeof PlanType)[keyof typeof PlanType]


export const PaymentProvider: {
  ASAAS: 'ASAAS',
  SICOOB: 'SICOOB',
  NONE: 'NONE'
};

export type PaymentProvider = (typeof PaymentProvider)[keyof typeof PaymentProvider]


export const PaymentEnvironment: {
  SANDBOX: 'SANDBOX',
  PRODUCTION: 'PRODUCTION'
};

export type PaymentEnvironment = (typeof PaymentEnvironment)[keyof typeof PaymentEnvironment]


export const SubscriptionStatus: {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  PAST_DUE: 'PAST_DUE',
  TRIALING: 'TRIALING'
};

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]


export const BillingType: {
  BOLETO: 'BOLETO',
  CREDIT_CARD: 'CREDIT_CARD',
  PIX: 'PIX',
  UNDEFINED: 'UNDEFINED'
};

export type BillingType = (typeof BillingType)[keyof typeof BillingType]


export const BillingCycle: {
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  SEMIANNUALLY: 'SEMIANNUALLY',
  YEARLY: 'YEARLY'
};

export type BillingCycle = (typeof BillingCycle)[keyof typeof BillingCycle]


export const BillingSubscriptionStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  EXPIRED: 'EXPIRED'
};

export type BillingSubscriptionStatus = (typeof BillingSubscriptionStatus)[keyof typeof BillingSubscriptionStatus]


export const InvoiceStatus: {
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

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]


export const AdminNotificationType: {
  NEW_COMPANY: 'NEW_COMPANY',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  PAYMENT_OVERDUE: 'PAYMENT_OVERDUE',
  SUBSCRIPTION_CANCELLED: 'SUBSCRIPTION_CANCELLED',
  TRIAL_EXPIRING: 'TRIAL_EXPIRING',
  SYSTEM: 'SYSTEM'
};

export type AdminNotificationType = (typeof AdminNotificationType)[keyof typeof AdminNotificationType]

}

export type PlanType = $Enums.PlanType

export const PlanType: typeof $Enums.PlanType

export type PaymentProvider = $Enums.PaymentProvider

export const PaymentProvider: typeof $Enums.PaymentProvider

export type PaymentEnvironment = $Enums.PaymentEnvironment

export const PaymentEnvironment: typeof $Enums.PaymentEnvironment

export type SubscriptionStatus = $Enums.SubscriptionStatus

export const SubscriptionStatus: typeof $Enums.SubscriptionStatus

export type BillingType = $Enums.BillingType

export const BillingType: typeof $Enums.BillingType

export type BillingCycle = $Enums.BillingCycle

export const BillingCycle: typeof $Enums.BillingCycle

export type BillingSubscriptionStatus = $Enums.BillingSubscriptionStatus

export const BillingSubscriptionStatus: typeof $Enums.BillingSubscriptionStatus

export type InvoiceStatus = $Enums.InvoiceStatus

export const InvoiceStatus: typeof $Enums.InvoiceStatus

export type AdminNotificationType = $Enums.AdminNotificationType

export const AdminNotificationType: typeof $Enums.AdminNotificationType

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Plans
 * const plans = await prisma.plan.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Plans
   * const plans = await prisma.plan.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.plan`: Exposes CRUD operations for the **Plan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Plans
    * const plans = await prisma.plan.findMany()
    * ```
    */
  get plan(): Prisma.PlanDelegate<ExtArgs>;

  /**
   * `prisma.paymentGatewaySettings`: Exposes CRUD operations for the **PaymentGatewaySettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentGatewaySettings
    * const paymentGatewaySettings = await prisma.paymentGatewaySettings.findMany()
    * ```
    */
  get paymentGatewaySettings(): Prisma.PaymentGatewaySettingsDelegate<ExtArgs>;

  /**
   * `prisma.company`: Exposes CRUD operations for the **Company** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Companies
    * const companies = await prisma.company.findMany()
    * ```
    */
  get company(): Prisma.CompanyDelegate<ExtArgs>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs>;

  /**
   * `prisma.superAdmin`: Exposes CRUD operations for the **SuperAdmin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SuperAdmins
    * const superAdmins = await prisma.superAdmin.findMany()
    * ```
    */
  get superAdmin(): Prisma.SuperAdminDelegate<ExtArgs>;

  /**
   * `prisma.billingCustomer`: Exposes CRUD operations for the **BillingCustomer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingCustomers
    * const billingCustomers = await prisma.billingCustomer.findMany()
    * ```
    */
  get billingCustomer(): Prisma.BillingCustomerDelegate<ExtArgs>;

  /**
   * `prisma.billingSubscription`: Exposes CRUD operations for the **BillingSubscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingSubscriptions
    * const billingSubscriptions = await prisma.billingSubscription.findMany()
    * ```
    */
  get billingSubscription(): Prisma.BillingSubscriptionDelegate<ExtArgs>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.InvoiceDelegate<ExtArgs>;

  /**
   * `prisma.billingWebhookLog`: Exposes CRUD operations for the **BillingWebhookLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingWebhookLogs
    * const billingWebhookLogs = await prisma.billingWebhookLog.findMany()
    * ```
    */
  get billingWebhookLog(): Prisma.BillingWebhookLogDelegate<ExtArgs>;

  /**
   * `prisma.adminNotification`: Exposes CRUD operations for the **AdminNotification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminNotifications
    * const adminNotifications = await prisma.adminNotification.findMany()
    * ```
    */
  get adminNotification(): Prisma.AdminNotificationDelegate<ExtArgs>;

  /**
   * `prisma.masterAuditLog`: Exposes CRUD operations for the **MasterAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MasterAuditLogs
    * const masterAuditLogs = await prisma.masterAuditLog.findMany()
    * ```
    */
  get masterAuditLog(): Prisma.MasterAuditLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "plan" | "paymentGatewaySettings" | "company" | "subscription" | "superAdmin" | "billingCustomer" | "billingSubscription" | "invoice" | "billingWebhookLog" | "adminNotification" | "masterAuditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Plan: {
        payload: Prisma.$PlanPayload<ExtArgs>
        fields: Prisma.PlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findFirst: {
            args: Prisma.PlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findMany: {
            args: Prisma.PlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>[]
          }
          create: {
            args: Prisma.PlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          createMany: {
            args: Prisma.PlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>[]
          }
          delete: {
            args: Prisma.PlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          update: {
            args: Prisma.PlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          deleteMany: {
            args: Prisma.PlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          aggregate: {
            args: Prisma.PlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlan>
          }
          groupBy: {
            args: Prisma.PlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlanCountArgs<ExtArgs>
            result: $Utils.Optional<PlanCountAggregateOutputType> | number
          }
        }
      }
      PaymentGatewaySettings: {
        payload: Prisma.$PaymentGatewaySettingsPayload<ExtArgs>
        fields: Prisma.PaymentGatewaySettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentGatewaySettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentGatewaySettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentGatewaySettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentGatewaySettingsPayload>
          }
          findFirst: {
            args: Prisma.PaymentGatewaySettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentGatewaySettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentGatewaySettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentGatewaySettingsPayload>
          }
          findMany: {
            args: Prisma.PaymentGatewaySettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentGatewaySettingsPayload>[]
          }
          create: {
            args: Prisma.PaymentGatewaySettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentGatewaySettingsPayload>
          }
          createMany: {
            args: Prisma.PaymentGatewaySettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentGatewaySettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentGatewaySettingsPayload>[]
          }
          delete: {
            args: Prisma.PaymentGatewaySettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentGatewaySettingsPayload>
          }
          update: {
            args: Prisma.PaymentGatewaySettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentGatewaySettingsPayload>
          }
          deleteMany: {
            args: Prisma.PaymentGatewaySettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentGatewaySettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentGatewaySettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentGatewaySettingsPayload>
          }
          aggregate: {
            args: Prisma.PaymentGatewaySettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentGatewaySettings>
          }
          groupBy: {
            args: Prisma.PaymentGatewaySettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGatewaySettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentGatewaySettingsCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentGatewaySettingsCountAggregateOutputType> | number
          }
        }
      }
      Company: {
        payload: Prisma.$CompanyPayload<ExtArgs>
        fields: Prisma.CompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findFirst: {
            args: Prisma.CompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findMany: {
            args: Prisma.CompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          create: {
            args: Prisma.CompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          createMany: {
            args: Prisma.CompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          delete: {
            args: Prisma.CompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          update: {
            args: Prisma.CompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          deleteMany: {
            args: Prisma.CompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          aggregate: {
            args: Prisma.CompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompany>
          }
          groupBy: {
            args: Prisma.CompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      SuperAdmin: {
        payload: Prisma.$SuperAdminPayload<ExtArgs>
        fields: Prisma.SuperAdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SuperAdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SuperAdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findFirst: {
            args: Prisma.SuperAdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SuperAdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findMany: {
            args: Prisma.SuperAdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          create: {
            args: Prisma.SuperAdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          createMany: {
            args: Prisma.SuperAdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SuperAdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          delete: {
            args: Prisma.SuperAdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          update: {
            args: Prisma.SuperAdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          deleteMany: {
            args: Prisma.SuperAdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SuperAdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SuperAdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          aggregate: {
            args: Prisma.SuperAdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSuperAdmin>
          }
          groupBy: {
            args: Prisma.SuperAdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.SuperAdminCountArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminCountAggregateOutputType> | number
          }
        }
      }
      BillingCustomer: {
        payload: Prisma.$BillingCustomerPayload<ExtArgs>
        fields: Prisma.BillingCustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingCustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingCustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          findFirst: {
            args: Prisma.BillingCustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingCustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          findMany: {
            args: Prisma.BillingCustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>[]
          }
          create: {
            args: Prisma.BillingCustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          createMany: {
            args: Prisma.BillingCustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingCustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>[]
          }
          delete: {
            args: Prisma.BillingCustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          update: {
            args: Prisma.BillingCustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          deleteMany: {
            args: Prisma.BillingCustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingCustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BillingCustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingCustomerPayload>
          }
          aggregate: {
            args: Prisma.BillingCustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingCustomer>
          }
          groupBy: {
            args: Prisma.BillingCustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingCustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingCustomerCountArgs<ExtArgs>
            result: $Utils.Optional<BillingCustomerCountAggregateOutputType> | number
          }
        }
      }
      BillingSubscription: {
        payload: Prisma.$BillingSubscriptionPayload<ExtArgs>
        fields: Prisma.BillingSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingSubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingSubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.BillingSubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingSubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          findMany: {
            args: Prisma.BillingSubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>[]
          }
          create: {
            args: Prisma.BillingSubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          createMany: {
            args: Prisma.BillingSubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingSubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>[]
          }
          delete: {
            args: Prisma.BillingSubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          update: {
            args: Prisma.BillingSubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.BillingSubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingSubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BillingSubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.BillingSubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingSubscription>
          }
          groupBy: {
            args: Prisma.BillingSubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingSubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingSubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<BillingSubscriptionCountAggregateOutputType> | number
          }
        }
      }
      Invoice: {
        payload: Prisma.$InvoicePayload<ExtArgs>
        fields: Prisma.InvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findFirst: {
            args: Prisma.InvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findMany: {
            args: Prisma.InvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          create: {
            args: Prisma.InvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          createMany: {
            args: Prisma.InvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          delete: {
            args: Prisma.InvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          update: {
            args: Prisma.InvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.InvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      BillingWebhookLog: {
        payload: Prisma.$BillingWebhookLogPayload<ExtArgs>
        fields: Prisma.BillingWebhookLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingWebhookLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingWebhookLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingWebhookLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingWebhookLogPayload>
          }
          findFirst: {
            args: Prisma.BillingWebhookLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingWebhookLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingWebhookLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingWebhookLogPayload>
          }
          findMany: {
            args: Prisma.BillingWebhookLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingWebhookLogPayload>[]
          }
          create: {
            args: Prisma.BillingWebhookLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingWebhookLogPayload>
          }
          createMany: {
            args: Prisma.BillingWebhookLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingWebhookLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingWebhookLogPayload>[]
          }
          delete: {
            args: Prisma.BillingWebhookLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingWebhookLogPayload>
          }
          update: {
            args: Prisma.BillingWebhookLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingWebhookLogPayload>
          }
          deleteMany: {
            args: Prisma.BillingWebhookLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingWebhookLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BillingWebhookLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingWebhookLogPayload>
          }
          aggregate: {
            args: Prisma.BillingWebhookLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingWebhookLog>
          }
          groupBy: {
            args: Prisma.BillingWebhookLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingWebhookLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingWebhookLogCountArgs<ExtArgs>
            result: $Utils.Optional<BillingWebhookLogCountAggregateOutputType> | number
          }
        }
      }
      AdminNotification: {
        payload: Prisma.$AdminNotificationPayload<ExtArgs>
        fields: Prisma.AdminNotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminNotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminNotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminNotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminNotificationPayload>
          }
          findFirst: {
            args: Prisma.AdminNotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminNotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminNotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminNotificationPayload>
          }
          findMany: {
            args: Prisma.AdminNotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminNotificationPayload>[]
          }
          create: {
            args: Prisma.AdminNotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminNotificationPayload>
          }
          createMany: {
            args: Prisma.AdminNotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminNotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminNotificationPayload>[]
          }
          delete: {
            args: Prisma.AdminNotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminNotificationPayload>
          }
          update: {
            args: Prisma.AdminNotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminNotificationPayload>
          }
          deleteMany: {
            args: Prisma.AdminNotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminNotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AdminNotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminNotificationPayload>
          }
          aggregate: {
            args: Prisma.AdminNotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminNotification>
          }
          groupBy: {
            args: Prisma.AdminNotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminNotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminNotificationCountArgs<ExtArgs>
            result: $Utils.Optional<AdminNotificationCountAggregateOutputType> | number
          }
        }
      }
      MasterAuditLog: {
        payload: Prisma.$MasterAuditLogPayload<ExtArgs>
        fields: Prisma.MasterAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MasterAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MasterAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterAuditLogPayload>
          }
          findFirst: {
            args: Prisma.MasterAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MasterAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterAuditLogPayload>
          }
          findMany: {
            args: Prisma.MasterAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterAuditLogPayload>[]
          }
          create: {
            args: Prisma.MasterAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterAuditLogPayload>
          }
          createMany: {
            args: Prisma.MasterAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MasterAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterAuditLogPayload>[]
          }
          delete: {
            args: Prisma.MasterAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterAuditLogPayload>
          }
          update: {
            args: Prisma.MasterAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.MasterAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MasterAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MasterAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterAuditLogPayload>
          }
          aggregate: {
            args: Prisma.MasterAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMasterAuditLog>
          }
          groupBy: {
            args: Prisma.MasterAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<MasterAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.MasterAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<MasterAuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PlanCountOutputType
   */

  export type PlanCountOutputType = {
    companies: number
    billingSubscriptions: number
  }

  export type PlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    companies?: boolean | PlanCountOutputTypeCountCompaniesArgs
    billingSubscriptions?: boolean | PlanCountOutputTypeCountBillingSubscriptionsArgs
  }

  // Custom InputTypes
  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanCountOutputType
     */
    select?: PlanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeCountCompaniesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyWhereInput
  }

  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeCountBillingSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingSubscriptionWhereInput
  }


  /**
   * Count Type CompanyCountOutputType
   */

  export type CompanyCountOutputType = {
    subscriptions: number
    auditLogs: number
    notifications: number
  }

  export type CompanyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | CompanyCountOutputTypeCountSubscriptionsArgs
    auditLogs?: boolean | CompanyCountOutputTypeCountAuditLogsArgs
    notifications?: boolean | CompanyCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyCountOutputType
     */
    select?: CompanyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MasterAuditLogWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminNotificationWhereInput
  }


  /**
   * Count Type BillingCustomerCountOutputType
   */

  export type BillingCustomerCountOutputType = {
    invoices: number
  }

  export type BillingCustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | BillingCustomerCountOutputTypeCountInvoicesArgs
  }

  // Custom InputTypes
  /**
   * BillingCustomerCountOutputType without action
   */
  export type BillingCustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomerCountOutputType
     */
    select?: BillingCustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BillingCustomerCountOutputType without action
   */
  export type BillingCustomerCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Plan
   */

  export type AggregatePlan = {
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  export type PlanAvgAggregateOutputType = {
    maxVehicles: number | null
    maxDrivers: number | null
    maxUsers: number | null
    maxBranches: number | null
    storageGb: number | null
    priceMonthly: Decimal | null
  }

  export type PlanSumAggregateOutputType = {
    maxVehicles: number | null
    maxDrivers: number | null
    maxUsers: number | null
    maxBranches: number | null
    storageGb: number | null
    priceMonthly: Decimal | null
  }

  export type PlanMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.PlanType | null
    maxVehicles: number | null
    maxDrivers: number | null
    maxUsers: number | null
    maxBranches: number | null
    storageGb: number | null
    priceMonthly: Decimal | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type PlanMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.PlanType | null
    maxVehicles: number | null
    maxDrivers: number | null
    maxUsers: number | null
    maxBranches: number | null
    storageGb: number | null
    priceMonthly: Decimal | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type PlanCountAggregateOutputType = {
    id: number
    name: number
    type: number
    maxVehicles: number
    maxDrivers: number
    maxUsers: number
    maxBranches: number
    storageGb: number
    priceMonthly: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type PlanAvgAggregateInputType = {
    maxVehicles?: true
    maxDrivers?: true
    maxUsers?: true
    maxBranches?: true
    storageGb?: true
    priceMonthly?: true
  }

  export type PlanSumAggregateInputType = {
    maxVehicles?: true
    maxDrivers?: true
    maxUsers?: true
    maxBranches?: true
    storageGb?: true
    priceMonthly?: true
  }

  export type PlanMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    maxVehicles?: true
    maxDrivers?: true
    maxUsers?: true
    maxBranches?: true
    storageGb?: true
    priceMonthly?: true
    isActive?: true
    createdAt?: true
  }

  export type PlanMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    maxVehicles?: true
    maxDrivers?: true
    maxUsers?: true
    maxBranches?: true
    storageGb?: true
    priceMonthly?: true
    isActive?: true
    createdAt?: true
  }

  export type PlanCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    maxVehicles?: true
    maxDrivers?: true
    maxUsers?: true
    maxBranches?: true
    storageGb?: true
    priceMonthly?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type PlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plan to aggregate.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Plans
    **/
    _count?: true | PlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanMaxAggregateInputType
  }

  export type GetPlanAggregateType<T extends PlanAggregateArgs> = {
        [P in keyof T & keyof AggregatePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlan[P]>
      : GetScalarType<T[P], AggregatePlan[P]>
  }




  export type PlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanWhereInput
    orderBy?: PlanOrderByWithAggregationInput | PlanOrderByWithAggregationInput[]
    by: PlanScalarFieldEnum[] | PlanScalarFieldEnum
    having?: PlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanCountAggregateInputType | true
    _avg?: PlanAvgAggregateInputType
    _sum?: PlanSumAggregateInputType
    _min?: PlanMinAggregateInputType
    _max?: PlanMaxAggregateInputType
  }

  export type PlanGroupByOutputType = {
    id: string
    name: string
    type: $Enums.PlanType
    maxVehicles: number
    maxDrivers: number
    maxUsers: number
    maxBranches: number
    storageGb: number
    priceMonthly: Decimal
    isActive: boolean
    createdAt: Date
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  type GetPlanGroupByPayload<T extends PlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanGroupByOutputType[P]>
            : GetScalarType<T[P], PlanGroupByOutputType[P]>
        }
      >
    >


  export type PlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    maxVehicles?: boolean
    maxDrivers?: boolean
    maxUsers?: boolean
    maxBranches?: boolean
    storageGb?: boolean
    priceMonthly?: boolean
    isActive?: boolean
    createdAt?: boolean
    companies?: boolean | Plan$companiesArgs<ExtArgs>
    billingSubscriptions?: boolean | Plan$billingSubscriptionsArgs<ExtArgs>
    _count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plan"]>

  export type PlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    maxVehicles?: boolean
    maxDrivers?: boolean
    maxUsers?: boolean
    maxBranches?: boolean
    storageGb?: boolean
    priceMonthly?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["plan"]>

  export type PlanSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    maxVehicles?: boolean
    maxDrivers?: boolean
    maxUsers?: boolean
    maxBranches?: boolean
    storageGb?: boolean
    priceMonthly?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type PlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    companies?: boolean | Plan$companiesArgs<ExtArgs>
    billingSubscriptions?: boolean | Plan$billingSubscriptionsArgs<ExtArgs>
    _count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Plan"
    objects: {
      companies: Prisma.$CompanyPayload<ExtArgs>[]
      billingSubscriptions: Prisma.$BillingSubscriptionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: $Enums.PlanType
      maxVehicles: number
      maxDrivers: number
      maxUsers: number
      maxBranches: number
      storageGb: number
      priceMonthly: Prisma.Decimal
      isActive: boolean
      createdAt: Date
    }, ExtArgs["result"]["plan"]>
    composites: {}
  }

  type PlanGetPayload<S extends boolean | null | undefined | PlanDefaultArgs> = $Result.GetResult<Prisma.$PlanPayload, S>

  type PlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PlanFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PlanCountAggregateInputType | true
    }

  export interface PlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Plan'], meta: { name: 'Plan' } }
    /**
     * Find zero or one Plan that matches the filter.
     * @param {PlanFindUniqueArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlanFindUniqueArgs>(args: SelectSubset<T, PlanFindUniqueArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Plan that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PlanFindUniqueOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlanFindUniqueOrThrowArgs>(args: SelectSubset<T, PlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Plan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlanFindFirstArgs>(args?: SelectSubset<T, PlanFindFirstArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Plan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlanFindFirstOrThrowArgs>(args?: SelectSubset<T, PlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Plans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Plans
     * const plans = await prisma.plan.findMany()
     * 
     * // Get first 10 Plans
     * const plans = await prisma.plan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const planWithIdOnly = await prisma.plan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlanFindManyArgs>(args?: SelectSubset<T, PlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Plan.
     * @param {PlanCreateArgs} args - Arguments to create a Plan.
     * @example
     * // Create one Plan
     * const Plan = await prisma.plan.create({
     *   data: {
     *     // ... data to create a Plan
     *   }
     * })
     * 
     */
    create<T extends PlanCreateArgs>(args: SelectSubset<T, PlanCreateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Plans.
     * @param {PlanCreateManyArgs} args - Arguments to create many Plans.
     * @example
     * // Create many Plans
     * const plan = await prisma.plan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlanCreateManyArgs>(args?: SelectSubset<T, PlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Plans and returns the data saved in the database.
     * @param {PlanCreateManyAndReturnArgs} args - Arguments to create many Plans.
     * @example
     * // Create many Plans
     * const plan = await prisma.plan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Plans and only return the `id`
     * const planWithIdOnly = await prisma.plan.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlanCreateManyAndReturnArgs>(args?: SelectSubset<T, PlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Plan.
     * @param {PlanDeleteArgs} args - Arguments to delete one Plan.
     * @example
     * // Delete one Plan
     * const Plan = await prisma.plan.delete({
     *   where: {
     *     // ... filter to delete one Plan
     *   }
     * })
     * 
     */
    delete<T extends PlanDeleteArgs>(args: SelectSubset<T, PlanDeleteArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Plan.
     * @param {PlanUpdateArgs} args - Arguments to update one Plan.
     * @example
     * // Update one Plan
     * const plan = await prisma.plan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlanUpdateArgs>(args: SelectSubset<T, PlanUpdateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Plans.
     * @param {PlanDeleteManyArgs} args - Arguments to filter Plans to delete.
     * @example
     * // Delete a few Plans
     * const { count } = await prisma.plan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlanDeleteManyArgs>(args?: SelectSubset<T, PlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Plans
     * const plan = await prisma.plan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlanUpdateManyArgs>(args: SelectSubset<T, PlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Plan.
     * @param {PlanUpsertArgs} args - Arguments to update or create a Plan.
     * @example
     * // Update or create a Plan
     * const plan = await prisma.plan.upsert({
     *   create: {
     *     // ... data to create a Plan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Plan we want to update
     *   }
     * })
     */
    upsert<T extends PlanUpsertArgs>(args: SelectSubset<T, PlanUpsertArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanCountArgs} args - Arguments to filter Plans to count.
     * @example
     * // Count the number of Plans
     * const count = await prisma.plan.count({
     *   where: {
     *     // ... the filter for the Plans we want to count
     *   }
     * })
    **/
    count<T extends PlanCountArgs>(
      args?: Subset<T, PlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlanAggregateArgs>(args: Subset<T, PlanAggregateArgs>): Prisma.PrismaPromise<GetPlanAggregateType<T>>

    /**
     * Group by Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanGroupByArgs['orderBy'] }
        : { orderBy?: PlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Plan model
   */
  readonly fields: PlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Plan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    companies<T extends Plan$companiesArgs<ExtArgs> = {}>(args?: Subset<T, Plan$companiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany"> | Null>
    billingSubscriptions<T extends Plan$billingSubscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Plan$billingSubscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Plan model
   */ 
  interface PlanFieldRefs {
    readonly id: FieldRef<"Plan", 'String'>
    readonly name: FieldRef<"Plan", 'String'>
    readonly type: FieldRef<"Plan", 'PlanType'>
    readonly maxVehicles: FieldRef<"Plan", 'Int'>
    readonly maxDrivers: FieldRef<"Plan", 'Int'>
    readonly maxUsers: FieldRef<"Plan", 'Int'>
    readonly maxBranches: FieldRef<"Plan", 'Int'>
    readonly storageGb: FieldRef<"Plan", 'Int'>
    readonly priceMonthly: FieldRef<"Plan", 'Decimal'>
    readonly isActive: FieldRef<"Plan", 'Boolean'>
    readonly createdAt: FieldRef<"Plan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Plan findUnique
   */
  export type PlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findUniqueOrThrow
   */
  export type PlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findFirst
   */
  export type PlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findFirstOrThrow
   */
  export type PlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findMany
   */
  export type PlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plans to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan create
   */
  export type PlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to create a Plan.
     */
    data: XOR<PlanCreateInput, PlanUncheckedCreateInput>
  }

  /**
   * Plan createMany
   */
  export type PlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Plans.
     */
    data: PlanCreateManyInput | PlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plan createManyAndReturn
   */
  export type PlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Plans.
     */
    data: PlanCreateManyInput | PlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plan update
   */
  export type PlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to update a Plan.
     */
    data: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
    /**
     * Choose, which Plan to update.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan updateMany
   */
  export type PlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Plans.
     */
    data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyInput>
    /**
     * Filter which Plans to update
     */
    where?: PlanWhereInput
  }

  /**
   * Plan upsert
   */
  export type PlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The filter to search for the Plan to update in case it exists.
     */
    where: PlanWhereUniqueInput
    /**
     * In case the Plan found by the `where` argument doesn't exist, create a new Plan with this data.
     */
    create: XOR<PlanCreateInput, PlanUncheckedCreateInput>
    /**
     * In case the Plan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
  }

  /**
   * Plan delete
   */
  export type PlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter which Plan to delete.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan deleteMany
   */
  export type PlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plans to delete
     */
    where?: PlanWhereInput
  }

  /**
   * Plan.companies
   */
  export type Plan$companiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    where?: CompanyWhereInput
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    cursor?: CompanyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Plan.billingSubscriptions
   */
  export type Plan$billingSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
    where?: BillingSubscriptionWhereInput
    orderBy?: BillingSubscriptionOrderByWithRelationInput | BillingSubscriptionOrderByWithRelationInput[]
    cursor?: BillingSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingSubscriptionScalarFieldEnum | BillingSubscriptionScalarFieldEnum[]
  }

  /**
   * Plan without action
   */
  export type PlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
  }


  /**
   * Model PaymentGatewaySettings
   */

  export type AggregatePaymentGatewaySettings = {
    _count: PaymentGatewaySettingsCountAggregateOutputType | null
    _min: PaymentGatewaySettingsMinAggregateOutputType | null
    _max: PaymentGatewaySettingsMaxAggregateOutputType | null
  }

  export type PaymentGatewaySettingsMinAggregateOutputType = {
    id: string | null
    singletonKey: string | null
    provider: $Enums.PaymentProvider | null
    environment: $Enums.PaymentEnvironment | null
    asaasApiKey: string | null
    asaasWalletId: string | null
    asaasWebhookToken: string | null
    sicoobClientId: string | null
    sicoobClientSecret: string | null
    sicoobCertificateBase64: string | null
    sicoobPixKey: string | null
    isActive: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type PaymentGatewaySettingsMaxAggregateOutputType = {
    id: string | null
    singletonKey: string | null
    provider: $Enums.PaymentProvider | null
    environment: $Enums.PaymentEnvironment | null
    asaasApiKey: string | null
    asaasWalletId: string | null
    asaasWebhookToken: string | null
    sicoobClientId: string | null
    sicoobClientSecret: string | null
    sicoobCertificateBase64: string | null
    sicoobPixKey: string | null
    isActive: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type PaymentGatewaySettingsCountAggregateOutputType = {
    id: number
    singletonKey: number
    provider: number
    environment: number
    asaasApiKey: number
    asaasWalletId: number
    asaasWebhookToken: number
    sicoobClientId: number
    sicoobClientSecret: number
    sicoobCertificateBase64: number
    sicoobPixKey: number
    isActive: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type PaymentGatewaySettingsMinAggregateInputType = {
    id?: true
    singletonKey?: true
    provider?: true
    environment?: true
    asaasApiKey?: true
    asaasWalletId?: true
    asaasWebhookToken?: true
    sicoobClientId?: true
    sicoobClientSecret?: true
    sicoobCertificateBase64?: true
    sicoobPixKey?: true
    isActive?: true
    updatedAt?: true
    createdAt?: true
  }

  export type PaymentGatewaySettingsMaxAggregateInputType = {
    id?: true
    singletonKey?: true
    provider?: true
    environment?: true
    asaasApiKey?: true
    asaasWalletId?: true
    asaasWebhookToken?: true
    sicoobClientId?: true
    sicoobClientSecret?: true
    sicoobCertificateBase64?: true
    sicoobPixKey?: true
    isActive?: true
    updatedAt?: true
    createdAt?: true
  }

  export type PaymentGatewaySettingsCountAggregateInputType = {
    id?: true
    singletonKey?: true
    provider?: true
    environment?: true
    asaasApiKey?: true
    asaasWalletId?: true
    asaasWebhookToken?: true
    sicoobClientId?: true
    sicoobClientSecret?: true
    sicoobCertificateBase64?: true
    sicoobPixKey?: true
    isActive?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PaymentGatewaySettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentGatewaySettings to aggregate.
     */
    where?: PaymentGatewaySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentGatewaySettings to fetch.
     */
    orderBy?: PaymentGatewaySettingsOrderByWithRelationInput | PaymentGatewaySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentGatewaySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentGatewaySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentGatewaySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentGatewaySettings
    **/
    _count?: true | PaymentGatewaySettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentGatewaySettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentGatewaySettingsMaxAggregateInputType
  }

  export type GetPaymentGatewaySettingsAggregateType<T extends PaymentGatewaySettingsAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentGatewaySettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentGatewaySettings[P]>
      : GetScalarType<T[P], AggregatePaymentGatewaySettings[P]>
  }




  export type PaymentGatewaySettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentGatewaySettingsWhereInput
    orderBy?: PaymentGatewaySettingsOrderByWithAggregationInput | PaymentGatewaySettingsOrderByWithAggregationInput[]
    by: PaymentGatewaySettingsScalarFieldEnum[] | PaymentGatewaySettingsScalarFieldEnum
    having?: PaymentGatewaySettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentGatewaySettingsCountAggregateInputType | true
    _min?: PaymentGatewaySettingsMinAggregateInputType
    _max?: PaymentGatewaySettingsMaxAggregateInputType
  }

  export type PaymentGatewaySettingsGroupByOutputType = {
    id: string
    singletonKey: string
    provider: $Enums.PaymentProvider
    environment: $Enums.PaymentEnvironment
    asaasApiKey: string | null
    asaasWalletId: string | null
    asaasWebhookToken: string | null
    sicoobClientId: string | null
    sicoobClientSecret: string | null
    sicoobCertificateBase64: string | null
    sicoobPixKey: string | null
    isActive: boolean
    updatedAt: Date
    createdAt: Date
    _count: PaymentGatewaySettingsCountAggregateOutputType | null
    _min: PaymentGatewaySettingsMinAggregateOutputType | null
    _max: PaymentGatewaySettingsMaxAggregateOutputType | null
  }

  type GetPaymentGatewaySettingsGroupByPayload<T extends PaymentGatewaySettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGatewaySettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGatewaySettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGatewaySettingsGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGatewaySettingsGroupByOutputType[P]>
        }
      >
    >


  export type PaymentGatewaySettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    singletonKey?: boolean
    provider?: boolean
    environment?: boolean
    asaasApiKey?: boolean
    asaasWalletId?: boolean
    asaasWebhookToken?: boolean
    sicoobClientId?: boolean
    sicoobClientSecret?: boolean
    sicoobCertificateBase64?: boolean
    sicoobPixKey?: boolean
    isActive?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["paymentGatewaySettings"]>

  export type PaymentGatewaySettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    singletonKey?: boolean
    provider?: boolean
    environment?: boolean
    asaasApiKey?: boolean
    asaasWalletId?: boolean
    asaasWebhookToken?: boolean
    sicoobClientId?: boolean
    sicoobClientSecret?: boolean
    sicoobCertificateBase64?: boolean
    sicoobPixKey?: boolean
    isActive?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["paymentGatewaySettings"]>

  export type PaymentGatewaySettingsSelectScalar = {
    id?: boolean
    singletonKey?: boolean
    provider?: boolean
    environment?: boolean
    asaasApiKey?: boolean
    asaasWalletId?: boolean
    asaasWebhookToken?: boolean
    sicoobClientId?: boolean
    sicoobClientSecret?: boolean
    sicoobCertificateBase64?: boolean
    sicoobPixKey?: boolean
    isActive?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }


  export type $PaymentGatewaySettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentGatewaySettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      singletonKey: string
      provider: $Enums.PaymentProvider
      environment: $Enums.PaymentEnvironment
      asaasApiKey: string | null
      asaasWalletId: string | null
      asaasWebhookToken: string | null
      sicoobClientId: string | null
      sicoobClientSecret: string | null
      sicoobCertificateBase64: string | null
      sicoobPixKey: string | null
      isActive: boolean
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["paymentGatewaySettings"]>
    composites: {}
  }

  type PaymentGatewaySettingsGetPayload<S extends boolean | null | undefined | PaymentGatewaySettingsDefaultArgs> = $Result.GetResult<Prisma.$PaymentGatewaySettingsPayload, S>

  type PaymentGatewaySettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentGatewaySettingsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentGatewaySettingsCountAggregateInputType | true
    }

  export interface PaymentGatewaySettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentGatewaySettings'], meta: { name: 'PaymentGatewaySettings' } }
    /**
     * Find zero or one PaymentGatewaySettings that matches the filter.
     * @param {PaymentGatewaySettingsFindUniqueArgs} args - Arguments to find a PaymentGatewaySettings
     * @example
     * // Get one PaymentGatewaySettings
     * const paymentGatewaySettings = await prisma.paymentGatewaySettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentGatewaySettingsFindUniqueArgs>(args: SelectSubset<T, PaymentGatewaySettingsFindUniqueArgs<ExtArgs>>): Prisma__PaymentGatewaySettingsClient<$Result.GetResult<Prisma.$PaymentGatewaySettingsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PaymentGatewaySettings that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentGatewaySettingsFindUniqueOrThrowArgs} args - Arguments to find a PaymentGatewaySettings
     * @example
     * // Get one PaymentGatewaySettings
     * const paymentGatewaySettings = await prisma.paymentGatewaySettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentGatewaySettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentGatewaySettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentGatewaySettingsClient<$Result.GetResult<Prisma.$PaymentGatewaySettingsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PaymentGatewaySettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewaySettingsFindFirstArgs} args - Arguments to find a PaymentGatewaySettings
     * @example
     * // Get one PaymentGatewaySettings
     * const paymentGatewaySettings = await prisma.paymentGatewaySettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentGatewaySettingsFindFirstArgs>(args?: SelectSubset<T, PaymentGatewaySettingsFindFirstArgs<ExtArgs>>): Prisma__PaymentGatewaySettingsClient<$Result.GetResult<Prisma.$PaymentGatewaySettingsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PaymentGatewaySettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewaySettingsFindFirstOrThrowArgs} args - Arguments to find a PaymentGatewaySettings
     * @example
     * // Get one PaymentGatewaySettings
     * const paymentGatewaySettings = await prisma.paymentGatewaySettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentGatewaySettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentGatewaySettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentGatewaySettingsClient<$Result.GetResult<Prisma.$PaymentGatewaySettingsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PaymentGatewaySettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewaySettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentGatewaySettings
     * const paymentGatewaySettings = await prisma.paymentGatewaySettings.findMany()
     * 
     * // Get first 10 PaymentGatewaySettings
     * const paymentGatewaySettings = await prisma.paymentGatewaySettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentGatewaySettingsWithIdOnly = await prisma.paymentGatewaySettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentGatewaySettingsFindManyArgs>(args?: SelectSubset<T, PaymentGatewaySettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentGatewaySettingsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PaymentGatewaySettings.
     * @param {PaymentGatewaySettingsCreateArgs} args - Arguments to create a PaymentGatewaySettings.
     * @example
     * // Create one PaymentGatewaySettings
     * const PaymentGatewaySettings = await prisma.paymentGatewaySettings.create({
     *   data: {
     *     // ... data to create a PaymentGatewaySettings
     *   }
     * })
     * 
     */
    create<T extends PaymentGatewaySettingsCreateArgs>(args: SelectSubset<T, PaymentGatewaySettingsCreateArgs<ExtArgs>>): Prisma__PaymentGatewaySettingsClient<$Result.GetResult<Prisma.$PaymentGatewaySettingsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PaymentGatewaySettings.
     * @param {PaymentGatewaySettingsCreateManyArgs} args - Arguments to create many PaymentGatewaySettings.
     * @example
     * // Create many PaymentGatewaySettings
     * const paymentGatewaySettings = await prisma.paymentGatewaySettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentGatewaySettingsCreateManyArgs>(args?: SelectSubset<T, PaymentGatewaySettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentGatewaySettings and returns the data saved in the database.
     * @param {PaymentGatewaySettingsCreateManyAndReturnArgs} args - Arguments to create many PaymentGatewaySettings.
     * @example
     * // Create many PaymentGatewaySettings
     * const paymentGatewaySettings = await prisma.paymentGatewaySettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentGatewaySettings and only return the `id`
     * const paymentGatewaySettingsWithIdOnly = await prisma.paymentGatewaySettings.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentGatewaySettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentGatewaySettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentGatewaySettingsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PaymentGatewaySettings.
     * @param {PaymentGatewaySettingsDeleteArgs} args - Arguments to delete one PaymentGatewaySettings.
     * @example
     * // Delete one PaymentGatewaySettings
     * const PaymentGatewaySettings = await prisma.paymentGatewaySettings.delete({
     *   where: {
     *     // ... filter to delete one PaymentGatewaySettings
     *   }
     * })
     * 
     */
    delete<T extends PaymentGatewaySettingsDeleteArgs>(args: SelectSubset<T, PaymentGatewaySettingsDeleteArgs<ExtArgs>>): Prisma__PaymentGatewaySettingsClient<$Result.GetResult<Prisma.$PaymentGatewaySettingsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PaymentGatewaySettings.
     * @param {PaymentGatewaySettingsUpdateArgs} args - Arguments to update one PaymentGatewaySettings.
     * @example
     * // Update one PaymentGatewaySettings
     * const paymentGatewaySettings = await prisma.paymentGatewaySettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentGatewaySettingsUpdateArgs>(args: SelectSubset<T, PaymentGatewaySettingsUpdateArgs<ExtArgs>>): Prisma__PaymentGatewaySettingsClient<$Result.GetResult<Prisma.$PaymentGatewaySettingsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PaymentGatewaySettings.
     * @param {PaymentGatewaySettingsDeleteManyArgs} args - Arguments to filter PaymentGatewaySettings to delete.
     * @example
     * // Delete a few PaymentGatewaySettings
     * const { count } = await prisma.paymentGatewaySettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentGatewaySettingsDeleteManyArgs>(args?: SelectSubset<T, PaymentGatewaySettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentGatewaySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewaySettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentGatewaySettings
     * const paymentGatewaySettings = await prisma.paymentGatewaySettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentGatewaySettingsUpdateManyArgs>(args: SelectSubset<T, PaymentGatewaySettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PaymentGatewaySettings.
     * @param {PaymentGatewaySettingsUpsertArgs} args - Arguments to update or create a PaymentGatewaySettings.
     * @example
     * // Update or create a PaymentGatewaySettings
     * const paymentGatewaySettings = await prisma.paymentGatewaySettings.upsert({
     *   create: {
     *     // ... data to create a PaymentGatewaySettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentGatewaySettings we want to update
     *   }
     * })
     */
    upsert<T extends PaymentGatewaySettingsUpsertArgs>(args: SelectSubset<T, PaymentGatewaySettingsUpsertArgs<ExtArgs>>): Prisma__PaymentGatewaySettingsClient<$Result.GetResult<Prisma.$PaymentGatewaySettingsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PaymentGatewaySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewaySettingsCountArgs} args - Arguments to filter PaymentGatewaySettings to count.
     * @example
     * // Count the number of PaymentGatewaySettings
     * const count = await prisma.paymentGatewaySettings.count({
     *   where: {
     *     // ... the filter for the PaymentGatewaySettings we want to count
     *   }
     * })
    **/
    count<T extends PaymentGatewaySettingsCountArgs>(
      args?: Subset<T, PaymentGatewaySettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentGatewaySettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentGatewaySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewaySettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentGatewaySettingsAggregateArgs>(args: Subset<T, PaymentGatewaySettingsAggregateArgs>): Prisma.PrismaPromise<GetPaymentGatewaySettingsAggregateType<T>>

    /**
     * Group by PaymentGatewaySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGatewaySettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGatewaySettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGatewaySettingsGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGatewaySettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGatewaySettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGatewaySettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentGatewaySettings model
   */
  readonly fields: PaymentGatewaySettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentGatewaySettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentGatewaySettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PaymentGatewaySettings model
   */ 
  interface PaymentGatewaySettingsFieldRefs {
    readonly id: FieldRef<"PaymentGatewaySettings", 'String'>
    readonly singletonKey: FieldRef<"PaymentGatewaySettings", 'String'>
    readonly provider: FieldRef<"PaymentGatewaySettings", 'PaymentProvider'>
    readonly environment: FieldRef<"PaymentGatewaySettings", 'PaymentEnvironment'>
    readonly asaasApiKey: FieldRef<"PaymentGatewaySettings", 'String'>
    readonly asaasWalletId: FieldRef<"PaymentGatewaySettings", 'String'>
    readonly asaasWebhookToken: FieldRef<"PaymentGatewaySettings", 'String'>
    readonly sicoobClientId: FieldRef<"PaymentGatewaySettings", 'String'>
    readonly sicoobClientSecret: FieldRef<"PaymentGatewaySettings", 'String'>
    readonly sicoobCertificateBase64: FieldRef<"PaymentGatewaySettings", 'String'>
    readonly sicoobPixKey: FieldRef<"PaymentGatewaySettings", 'String'>
    readonly isActive: FieldRef<"PaymentGatewaySettings", 'Boolean'>
    readonly updatedAt: FieldRef<"PaymentGatewaySettings", 'DateTime'>
    readonly createdAt: FieldRef<"PaymentGatewaySettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentGatewaySettings findUnique
   */
  export type PaymentGatewaySettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewaySettings
     */
    select?: PaymentGatewaySettingsSelect<ExtArgs> | null
    /**
     * Filter, which PaymentGatewaySettings to fetch.
     */
    where: PaymentGatewaySettingsWhereUniqueInput
  }

  /**
   * PaymentGatewaySettings findUniqueOrThrow
   */
  export type PaymentGatewaySettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewaySettings
     */
    select?: PaymentGatewaySettingsSelect<ExtArgs> | null
    /**
     * Filter, which PaymentGatewaySettings to fetch.
     */
    where: PaymentGatewaySettingsWhereUniqueInput
  }

  /**
   * PaymentGatewaySettings findFirst
   */
  export type PaymentGatewaySettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewaySettings
     */
    select?: PaymentGatewaySettingsSelect<ExtArgs> | null
    /**
     * Filter, which PaymentGatewaySettings to fetch.
     */
    where?: PaymentGatewaySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentGatewaySettings to fetch.
     */
    orderBy?: PaymentGatewaySettingsOrderByWithRelationInput | PaymentGatewaySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentGatewaySettings.
     */
    cursor?: PaymentGatewaySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentGatewaySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentGatewaySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentGatewaySettings.
     */
    distinct?: PaymentGatewaySettingsScalarFieldEnum | PaymentGatewaySettingsScalarFieldEnum[]
  }

  /**
   * PaymentGatewaySettings findFirstOrThrow
   */
  export type PaymentGatewaySettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewaySettings
     */
    select?: PaymentGatewaySettingsSelect<ExtArgs> | null
    /**
     * Filter, which PaymentGatewaySettings to fetch.
     */
    where?: PaymentGatewaySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentGatewaySettings to fetch.
     */
    orderBy?: PaymentGatewaySettingsOrderByWithRelationInput | PaymentGatewaySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentGatewaySettings.
     */
    cursor?: PaymentGatewaySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentGatewaySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentGatewaySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentGatewaySettings.
     */
    distinct?: PaymentGatewaySettingsScalarFieldEnum | PaymentGatewaySettingsScalarFieldEnum[]
  }

  /**
   * PaymentGatewaySettings findMany
   */
  export type PaymentGatewaySettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewaySettings
     */
    select?: PaymentGatewaySettingsSelect<ExtArgs> | null
    /**
     * Filter, which PaymentGatewaySettings to fetch.
     */
    where?: PaymentGatewaySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentGatewaySettings to fetch.
     */
    orderBy?: PaymentGatewaySettingsOrderByWithRelationInput | PaymentGatewaySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentGatewaySettings.
     */
    cursor?: PaymentGatewaySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentGatewaySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentGatewaySettings.
     */
    skip?: number
    distinct?: PaymentGatewaySettingsScalarFieldEnum | PaymentGatewaySettingsScalarFieldEnum[]
  }

  /**
   * PaymentGatewaySettings create
   */
  export type PaymentGatewaySettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewaySettings
     */
    select?: PaymentGatewaySettingsSelect<ExtArgs> | null
    /**
     * The data needed to create a PaymentGatewaySettings.
     */
    data: XOR<PaymentGatewaySettingsCreateInput, PaymentGatewaySettingsUncheckedCreateInput>
  }

  /**
   * PaymentGatewaySettings createMany
   */
  export type PaymentGatewaySettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentGatewaySettings.
     */
    data: PaymentGatewaySettingsCreateManyInput | PaymentGatewaySettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentGatewaySettings createManyAndReturn
   */
  export type PaymentGatewaySettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewaySettings
     */
    select?: PaymentGatewaySettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PaymentGatewaySettings.
     */
    data: PaymentGatewaySettingsCreateManyInput | PaymentGatewaySettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentGatewaySettings update
   */
  export type PaymentGatewaySettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewaySettings
     */
    select?: PaymentGatewaySettingsSelect<ExtArgs> | null
    /**
     * The data needed to update a PaymentGatewaySettings.
     */
    data: XOR<PaymentGatewaySettingsUpdateInput, PaymentGatewaySettingsUncheckedUpdateInput>
    /**
     * Choose, which PaymentGatewaySettings to update.
     */
    where: PaymentGatewaySettingsWhereUniqueInput
  }

  /**
   * PaymentGatewaySettings updateMany
   */
  export type PaymentGatewaySettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentGatewaySettings.
     */
    data: XOR<PaymentGatewaySettingsUpdateManyMutationInput, PaymentGatewaySettingsUncheckedUpdateManyInput>
    /**
     * Filter which PaymentGatewaySettings to update
     */
    where?: PaymentGatewaySettingsWhereInput
  }

  /**
   * PaymentGatewaySettings upsert
   */
  export type PaymentGatewaySettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewaySettings
     */
    select?: PaymentGatewaySettingsSelect<ExtArgs> | null
    /**
     * The filter to search for the PaymentGatewaySettings to update in case it exists.
     */
    where: PaymentGatewaySettingsWhereUniqueInput
    /**
     * In case the PaymentGatewaySettings found by the `where` argument doesn't exist, create a new PaymentGatewaySettings with this data.
     */
    create: XOR<PaymentGatewaySettingsCreateInput, PaymentGatewaySettingsUncheckedCreateInput>
    /**
     * In case the PaymentGatewaySettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentGatewaySettingsUpdateInput, PaymentGatewaySettingsUncheckedUpdateInput>
  }

  /**
   * PaymentGatewaySettings delete
   */
  export type PaymentGatewaySettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewaySettings
     */
    select?: PaymentGatewaySettingsSelect<ExtArgs> | null
    /**
     * Filter which PaymentGatewaySettings to delete.
     */
    where: PaymentGatewaySettingsWhereUniqueInput
  }

  /**
   * PaymentGatewaySettings deleteMany
   */
  export type PaymentGatewaySettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentGatewaySettings to delete
     */
    where?: PaymentGatewaySettingsWhereInput
  }

  /**
   * PaymentGatewaySettings without action
   */
  export type PaymentGatewaySettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentGatewaySettings
     */
    select?: PaymentGatewaySettingsSelect<ExtArgs> | null
  }


  /**
   * Model Company
   */

  export type AggregateCompany = {
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  export type CompanyMinAggregateOutputType = {
    id: string | null
    name: string | null
    cnpj: string | null
    email: string | null
    phone: string | null
    schemaName: string | null
    planId: string | null
    isActive: boolean | null
    trialEndsAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    cnpj: string | null
    email: string | null
    phone: string | null
    schemaName: string | null
    planId: string | null
    isActive: boolean | null
    trialEndsAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyCountAggregateOutputType = {
    id: number
    name: number
    cnpj: number
    email: number
    phone: number
    schemaName: number
    planId: number
    isActive: number
    trialEndsAt: number
    features: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CompanyMinAggregateInputType = {
    id?: true
    name?: true
    cnpj?: true
    email?: true
    phone?: true
    schemaName?: true
    planId?: true
    isActive?: true
    trialEndsAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyMaxAggregateInputType = {
    id?: true
    name?: true
    cnpj?: true
    email?: true
    phone?: true
    schemaName?: true
    planId?: true
    isActive?: true
    trialEndsAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyCountAggregateInputType = {
    id?: true
    name?: true
    cnpj?: true
    email?: true
    phone?: true
    schemaName?: true
    planId?: true
    isActive?: true
    trialEndsAt?: true
    features?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Company to aggregate.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Companies
    **/
    _count?: true | CompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyMaxAggregateInputType
  }

  export type GetCompanyAggregateType<T extends CompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompany[P]>
      : GetScalarType<T[P], AggregateCompany[P]>
  }




  export type CompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyWhereInput
    orderBy?: CompanyOrderByWithAggregationInput | CompanyOrderByWithAggregationInput[]
    by: CompanyScalarFieldEnum[] | CompanyScalarFieldEnum
    having?: CompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyCountAggregateInputType | true
    _min?: CompanyMinAggregateInputType
    _max?: CompanyMaxAggregateInputType
  }

  export type CompanyGroupByOutputType = {
    id: string
    name: string
    cnpj: string
    email: string
    phone: string | null
    schemaName: string
    planId: string
    isActive: boolean
    trialEndsAt: Date | null
    features: string[]
    createdAt: Date
    updatedAt: Date
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  type GetCompanyGroupByPayload<T extends CompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyGroupByOutputType[P]>
        }
      >
    >


  export type CompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    cnpj?: boolean
    email?: boolean
    phone?: boolean
    schemaName?: boolean
    planId?: boolean
    isActive?: boolean
    trialEndsAt?: boolean
    features?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    plan?: boolean | PlanDefaultArgs<ExtArgs>
    subscriptions?: boolean | Company$subscriptionsArgs<ExtArgs>
    auditLogs?: boolean | Company$auditLogsArgs<ExtArgs>
    billingCustomer?: boolean | Company$billingCustomerArgs<ExtArgs>
    notifications?: boolean | Company$notificationsArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>

  export type CompanySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    cnpj?: boolean
    email?: boolean
    phone?: boolean
    schemaName?: boolean
    planId?: boolean
    isActive?: boolean
    trialEndsAt?: boolean
    features?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    plan?: boolean | PlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>

  export type CompanySelectScalar = {
    id?: boolean
    name?: boolean
    cnpj?: boolean
    email?: boolean
    phone?: boolean
    schemaName?: boolean
    planId?: boolean
    isActive?: boolean
    trialEndsAt?: boolean
    features?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plan?: boolean | PlanDefaultArgs<ExtArgs>
    subscriptions?: boolean | Company$subscriptionsArgs<ExtArgs>
    auditLogs?: boolean | Company$auditLogsArgs<ExtArgs>
    billingCustomer?: boolean | Company$billingCustomerArgs<ExtArgs>
    notifications?: boolean | Company$notificationsArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompanyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plan?: boolean | PlanDefaultArgs<ExtArgs>
  }

  export type $CompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Company"
    objects: {
      plan: Prisma.$PlanPayload<ExtArgs>
      subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[]
      auditLogs: Prisma.$MasterAuditLogPayload<ExtArgs>[]
      billingCustomer: Prisma.$BillingCustomerPayload<ExtArgs> | null
      notifications: Prisma.$AdminNotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      cnpj: string
      email: string
      phone: string | null
      schemaName: string
      planId: string
      isActive: boolean
      trialEndsAt: Date | null
      features: string[]
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["company"]>
    composites: {}
  }

  type CompanyGetPayload<S extends boolean | null | undefined | CompanyDefaultArgs> = $Result.GetResult<Prisma.$CompanyPayload, S>

  type CompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CompanyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CompanyCountAggregateInputType | true
    }

  export interface CompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Company'], meta: { name: 'Company' } }
    /**
     * Find zero or one Company that matches the filter.
     * @param {CompanyFindUniqueArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyFindUniqueArgs>(args: SelectSubset<T, CompanyFindUniqueArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Company that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CompanyFindUniqueOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Company that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyFindFirstArgs>(args?: SelectSubset<T, CompanyFindFirstArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Company that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Companies
     * const companies = await prisma.company.findMany()
     * 
     * // Get first 10 Companies
     * const companies = await prisma.company.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companyWithIdOnly = await prisma.company.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanyFindManyArgs>(args?: SelectSubset<T, CompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Company.
     * @param {CompanyCreateArgs} args - Arguments to create a Company.
     * @example
     * // Create one Company
     * const Company = await prisma.company.create({
     *   data: {
     *     // ... data to create a Company
     *   }
     * })
     * 
     */
    create<T extends CompanyCreateArgs>(args: SelectSubset<T, CompanyCreateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Companies.
     * @param {CompanyCreateManyArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyCreateManyArgs>(args?: SelectSubset<T, CompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Companies and returns the data saved in the database.
     * @param {CompanyCreateManyAndReturnArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Companies and only return the `id`
     * const companyWithIdOnly = await prisma.company.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanyCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Company.
     * @param {CompanyDeleteArgs} args - Arguments to delete one Company.
     * @example
     * // Delete one Company
     * const Company = await prisma.company.delete({
     *   where: {
     *     // ... filter to delete one Company
     *   }
     * })
     * 
     */
    delete<T extends CompanyDeleteArgs>(args: SelectSubset<T, CompanyDeleteArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Company.
     * @param {CompanyUpdateArgs} args - Arguments to update one Company.
     * @example
     * // Update one Company
     * const company = await prisma.company.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyUpdateArgs>(args: SelectSubset<T, CompanyUpdateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Companies.
     * @param {CompanyDeleteManyArgs} args - Arguments to filter Companies to delete.
     * @example
     * // Delete a few Companies
     * const { count } = await prisma.company.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyDeleteManyArgs>(args?: SelectSubset<T, CompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyUpdateManyArgs>(args: SelectSubset<T, CompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Company.
     * @param {CompanyUpsertArgs} args - Arguments to update or create a Company.
     * @example
     * // Update or create a Company
     * const company = await prisma.company.upsert({
     *   create: {
     *     // ... data to create a Company
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Company we want to update
     *   }
     * })
     */
    upsert<T extends CompanyUpsertArgs>(args: SelectSubset<T, CompanyUpsertArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyCountArgs} args - Arguments to filter Companies to count.
     * @example
     * // Count the number of Companies
     * const count = await prisma.company.count({
     *   where: {
     *     // ... the filter for the Companies we want to count
     *   }
     * })
    **/
    count<T extends CompanyCountArgs>(
      args?: Subset<T, CompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompanyAggregateArgs>(args: Subset<T, CompanyAggregateArgs>): Prisma.PrismaPromise<GetCompanyAggregateType<T>>

    /**
     * Group by Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyGroupByArgs['orderBy'] }
        : { orderBy?: CompanyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Company model
   */
  readonly fields: CompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Company.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    plan<T extends PlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlanDefaultArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    subscriptions<T extends Company$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Company$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany"> | Null>
    auditLogs<T extends Company$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Company$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MasterAuditLogPayload<ExtArgs>, T, "findMany"> | Null>
    billingCustomer<T extends Company$billingCustomerArgs<ExtArgs> = {}>(args?: Subset<T, Company$billingCustomerArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    notifications<T extends Company$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, Company$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminNotificationPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Company model
   */ 
  interface CompanyFieldRefs {
    readonly id: FieldRef<"Company", 'String'>
    readonly name: FieldRef<"Company", 'String'>
    readonly cnpj: FieldRef<"Company", 'String'>
    readonly email: FieldRef<"Company", 'String'>
    readonly phone: FieldRef<"Company", 'String'>
    readonly schemaName: FieldRef<"Company", 'String'>
    readonly planId: FieldRef<"Company", 'String'>
    readonly isActive: FieldRef<"Company", 'Boolean'>
    readonly trialEndsAt: FieldRef<"Company", 'DateTime'>
    readonly features: FieldRef<"Company", 'String[]'>
    readonly createdAt: FieldRef<"Company", 'DateTime'>
    readonly updatedAt: FieldRef<"Company", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Company findUnique
   */
  export type CompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findUniqueOrThrow
   */
  export type CompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findFirst
   */
  export type CompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findFirstOrThrow
   */
  export type CompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findMany
   */
  export type CompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Companies to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company create
   */
  export type CompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to create a Company.
     */
    data: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
  }

  /**
   * Company createMany
   */
  export type CompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company createManyAndReturn
   */
  export type CompanyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Company update
   */
  export type CompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to update a Company.
     */
    data: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
    /**
     * Choose, which Company to update.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company updateMany
   */
  export type CompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
  }

  /**
   * Company upsert
   */
  export type CompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The filter to search for the Company to update in case it exists.
     */
    where: CompanyWhereUniqueInput
    /**
     * In case the Company found by the `where` argument doesn't exist, create a new Company with this data.
     */
    create: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
    /**
     * In case the Company was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
  }

  /**
   * Company delete
   */
  export type CompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter which Company to delete.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company deleteMany
   */
  export type CompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Companies to delete
     */
    where?: CompanyWhereInput
  }

  /**
   * Company.subscriptions
   */
  export type Company$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Company.auditLogs
   */
  export type Company$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogInclude<ExtArgs> | null
    where?: MasterAuditLogWhereInput
    orderBy?: MasterAuditLogOrderByWithRelationInput | MasterAuditLogOrderByWithRelationInput[]
    cursor?: MasterAuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MasterAuditLogScalarFieldEnum | MasterAuditLogScalarFieldEnum[]
  }

  /**
   * Company.billingCustomer
   */
  export type Company$billingCustomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    where?: BillingCustomerWhereInput
  }

  /**
   * Company.notifications
   */
  export type Company$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationInclude<ExtArgs> | null
    where?: AdminNotificationWhereInput
    orderBy?: AdminNotificationOrderByWithRelationInput | AdminNotificationOrderByWithRelationInput[]
    cursor?: AdminNotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AdminNotificationScalarFieldEnum | AdminNotificationScalarFieldEnum[]
  }

  /**
   * Company without action
   */
  export type CompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    companyId: string | null
    planId: string | null
    status: $Enums.SubscriptionStatus | null
    startsAt: Date | null
    endsAt: Date | null
    cancelledAt: Date | null
    createdAt: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    companyId: string | null
    planId: string | null
    status: $Enums.SubscriptionStatus | null
    startsAt: Date | null
    endsAt: Date | null
    cancelledAt: Date | null
    createdAt: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    companyId: number
    planId: number
    status: number
    startsAt: number
    endsAt: number
    cancelledAt: number
    createdAt: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    id?: true
    companyId?: true
    planId?: true
    status?: true
    startsAt?: true
    endsAt?: true
    cancelledAt?: true
    createdAt?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    companyId?: true
    planId?: true
    status?: true
    startsAt?: true
    endsAt?: true
    cancelledAt?: true
    createdAt?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    companyId?: true
    planId?: true
    status?: true
    startsAt?: true
    endsAt?: true
    cancelledAt?: true
    createdAt?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    companyId: string
    planId: string
    status: $Enums.SubscriptionStatus
    startsAt: Date
    endsAt: Date | null
    cancelledAt: Date | null
    createdAt: Date
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    planId?: boolean
    status?: boolean
    startsAt?: boolean
    endsAt?: boolean
    cancelledAt?: boolean
    createdAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    planId?: boolean
    status?: boolean
    startsAt?: boolean
    endsAt?: boolean
    cancelledAt?: boolean
    createdAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    companyId?: boolean
    planId?: boolean
    status?: boolean
    startsAt?: boolean
    endsAt?: boolean
    cancelledAt?: boolean
    createdAt?: boolean
  }

  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyId: string
      planId: string
      status: $Enums.SubscriptionStatus
      startsAt: Date
      endsAt: Date | null
      cancelledAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */ 
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly companyId: FieldRef<"Subscription", 'String'>
    readonly planId: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'SubscriptionStatus'>
    readonly startsAt: FieldRef<"Subscription", 'DateTime'>
    readonly endsAt: FieldRef<"Subscription", 'DateTime'>
    readonly cancelledAt: FieldRef<"Subscription", 'DateTime'>
    readonly createdAt: FieldRef<"Subscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model SuperAdmin
   */

  export type AggregateSuperAdmin = {
    _count: SuperAdminCountAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  export type SuperAdminMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    isActive: boolean | null
    refreshTokenHash: string | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SuperAdminMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    isActive: boolean | null
    refreshTokenHash: string | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SuperAdminCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    isActive: number
    refreshTokenHash: number
    lastLoginAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SuperAdminMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    isActive?: true
    refreshTokenHash?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SuperAdminMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    isActive?: true
    refreshTokenHash?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SuperAdminCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    isActive?: true
    refreshTokenHash?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SuperAdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmin to aggregate.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SuperAdmins
    **/
    _count?: true | SuperAdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SuperAdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SuperAdminMaxAggregateInputType
  }

  export type GetSuperAdminAggregateType<T extends SuperAdminAggregateArgs> = {
        [P in keyof T & keyof AggregateSuperAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSuperAdmin[P]>
      : GetScalarType<T[P], AggregateSuperAdmin[P]>
  }




  export type SuperAdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SuperAdminWhereInput
    orderBy?: SuperAdminOrderByWithAggregationInput | SuperAdminOrderByWithAggregationInput[]
    by: SuperAdminScalarFieldEnum[] | SuperAdminScalarFieldEnum
    having?: SuperAdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SuperAdminCountAggregateInputType | true
    _min?: SuperAdminMinAggregateInputType
    _max?: SuperAdminMaxAggregateInputType
  }

  export type SuperAdminGroupByOutputType = {
    id: string
    name: string
    email: string
    passwordHash: string
    isActive: boolean
    refreshTokenHash: string | null
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: SuperAdminCountAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  type GetSuperAdminGroupByPayload<T extends SuperAdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SuperAdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SuperAdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
            : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
        }
      >
    >


  export type SuperAdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    isActive?: boolean
    refreshTokenHash?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["superAdmin"]>

  export type SuperAdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    isActive?: boolean
    refreshTokenHash?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["superAdmin"]>

  export type SuperAdminSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    isActive?: boolean
    refreshTokenHash?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SuperAdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SuperAdmin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      passwordHash: string
      isActive: boolean
      refreshTokenHash: string | null
      lastLoginAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["superAdmin"]>
    composites: {}
  }

  type SuperAdminGetPayload<S extends boolean | null | undefined | SuperAdminDefaultArgs> = $Result.GetResult<Prisma.$SuperAdminPayload, S>

  type SuperAdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SuperAdminFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SuperAdminCountAggregateInputType | true
    }

  export interface SuperAdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SuperAdmin'], meta: { name: 'SuperAdmin' } }
    /**
     * Find zero or one SuperAdmin that matches the filter.
     * @param {SuperAdminFindUniqueArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SuperAdminFindUniqueArgs>(args: SelectSubset<T, SuperAdminFindUniqueArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SuperAdmin that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SuperAdminFindUniqueOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SuperAdminFindUniqueOrThrowArgs>(args: SelectSubset<T, SuperAdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SuperAdmin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SuperAdminFindFirstArgs>(args?: SelectSubset<T, SuperAdminFindFirstArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SuperAdmin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SuperAdminFindFirstOrThrowArgs>(args?: SelectSubset<T, SuperAdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SuperAdmins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany()
     * 
     * // Get first 10 SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SuperAdminFindManyArgs>(args?: SelectSubset<T, SuperAdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SuperAdmin.
     * @param {SuperAdminCreateArgs} args - Arguments to create a SuperAdmin.
     * @example
     * // Create one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.create({
     *   data: {
     *     // ... data to create a SuperAdmin
     *   }
     * })
     * 
     */
    create<T extends SuperAdminCreateArgs>(args: SelectSubset<T, SuperAdminCreateArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SuperAdmins.
     * @param {SuperAdminCreateManyArgs} args - Arguments to create many SuperAdmins.
     * @example
     * // Create many SuperAdmins
     * const superAdmin = await prisma.superAdmin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SuperAdminCreateManyArgs>(args?: SelectSubset<T, SuperAdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SuperAdmins and returns the data saved in the database.
     * @param {SuperAdminCreateManyAndReturnArgs} args - Arguments to create many SuperAdmins.
     * @example
     * // Create many SuperAdmins
     * const superAdmin = await prisma.superAdmin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SuperAdmins and only return the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SuperAdminCreateManyAndReturnArgs>(args?: SelectSubset<T, SuperAdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SuperAdmin.
     * @param {SuperAdminDeleteArgs} args - Arguments to delete one SuperAdmin.
     * @example
     * // Delete one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.delete({
     *   where: {
     *     // ... filter to delete one SuperAdmin
     *   }
     * })
     * 
     */
    delete<T extends SuperAdminDeleteArgs>(args: SelectSubset<T, SuperAdminDeleteArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SuperAdmin.
     * @param {SuperAdminUpdateArgs} args - Arguments to update one SuperAdmin.
     * @example
     * // Update one SuperAdmin
     * const superAdmin = await prisma.superAdmin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SuperAdminUpdateArgs>(args: SelectSubset<T, SuperAdminUpdateArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SuperAdmins.
     * @param {SuperAdminDeleteManyArgs} args - Arguments to filter SuperAdmins to delete.
     * @example
     * // Delete a few SuperAdmins
     * const { count } = await prisma.superAdmin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SuperAdminDeleteManyArgs>(args?: SelectSubset<T, SuperAdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SuperAdmins
     * const superAdmin = await prisma.superAdmin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SuperAdminUpdateManyArgs>(args: SelectSubset<T, SuperAdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SuperAdmin.
     * @param {SuperAdminUpsertArgs} args - Arguments to update or create a SuperAdmin.
     * @example
     * // Update or create a SuperAdmin
     * const superAdmin = await prisma.superAdmin.upsert({
     *   create: {
     *     // ... data to create a SuperAdmin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SuperAdmin we want to update
     *   }
     * })
     */
    upsert<T extends SuperAdminUpsertArgs>(args: SelectSubset<T, SuperAdminUpsertArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminCountArgs} args - Arguments to filter SuperAdmins to count.
     * @example
     * // Count the number of SuperAdmins
     * const count = await prisma.superAdmin.count({
     *   where: {
     *     // ... the filter for the SuperAdmins we want to count
     *   }
     * })
    **/
    count<T extends SuperAdminCountArgs>(
      args?: Subset<T, SuperAdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SuperAdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SuperAdminAggregateArgs>(args: Subset<T, SuperAdminAggregateArgs>): Prisma.PrismaPromise<GetSuperAdminAggregateType<T>>

    /**
     * Group by SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SuperAdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SuperAdminGroupByArgs['orderBy'] }
        : { orderBy?: SuperAdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SuperAdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSuperAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SuperAdmin model
   */
  readonly fields: SuperAdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SuperAdmin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SuperAdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SuperAdmin model
   */ 
  interface SuperAdminFieldRefs {
    readonly id: FieldRef<"SuperAdmin", 'String'>
    readonly name: FieldRef<"SuperAdmin", 'String'>
    readonly email: FieldRef<"SuperAdmin", 'String'>
    readonly passwordHash: FieldRef<"SuperAdmin", 'String'>
    readonly isActive: FieldRef<"SuperAdmin", 'Boolean'>
    readonly refreshTokenHash: FieldRef<"SuperAdmin", 'String'>
    readonly lastLoginAt: FieldRef<"SuperAdmin", 'DateTime'>
    readonly createdAt: FieldRef<"SuperAdmin", 'DateTime'>
    readonly updatedAt: FieldRef<"SuperAdmin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SuperAdmin findUnique
   */
  export type SuperAdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findUniqueOrThrow
   */
  export type SuperAdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findFirst
   */
  export type SuperAdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findFirstOrThrow
   */
  export type SuperAdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findMany
   */
  export type SuperAdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter, which SuperAdmins to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin create
   */
  export type SuperAdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * The data needed to create a SuperAdmin.
     */
    data: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
  }

  /**
   * SuperAdmin createMany
   */
  export type SuperAdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SuperAdmins.
     */
    data: SuperAdminCreateManyInput | SuperAdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdmin createManyAndReturn
   */
  export type SuperAdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SuperAdmins.
     */
    data: SuperAdminCreateManyInput | SuperAdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdmin update
   */
  export type SuperAdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * The data needed to update a SuperAdmin.
     */
    data: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
    /**
     * Choose, which SuperAdmin to update.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin updateMany
   */
  export type SuperAdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SuperAdmins.
     */
    data: XOR<SuperAdminUpdateManyMutationInput, SuperAdminUncheckedUpdateManyInput>
    /**
     * Filter which SuperAdmins to update
     */
    where?: SuperAdminWhereInput
  }

  /**
   * SuperAdmin upsert
   */
  export type SuperAdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * The filter to search for the SuperAdmin to update in case it exists.
     */
    where: SuperAdminWhereUniqueInput
    /**
     * In case the SuperAdmin found by the `where` argument doesn't exist, create a new SuperAdmin with this data.
     */
    create: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
    /**
     * In case the SuperAdmin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
  }

  /**
   * SuperAdmin delete
   */
  export type SuperAdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Filter which SuperAdmin to delete.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin deleteMany
   */
  export type SuperAdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmins to delete
     */
    where?: SuperAdminWhereInput
  }

  /**
   * SuperAdmin without action
   */
  export type SuperAdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
  }


  /**
   * Model BillingCustomer
   */

  export type AggregateBillingCustomer = {
    _count: BillingCustomerCountAggregateOutputType | null
    _min: BillingCustomerMinAggregateOutputType | null
    _max: BillingCustomerMaxAggregateOutputType | null
  }

  export type BillingCustomerMinAggregateOutputType = {
    id: string | null
    companyId: string | null
    asaasCustomerId: string | null
    name: string | null
    cpfCnpj: string | null
    email: string | null
    phone: string | null
    postalCode: string | null
    address: string | null
    addressNumber: string | null
    complement: string | null
    province: string | null
    city: string | null
    state: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingCustomerMaxAggregateOutputType = {
    id: string | null
    companyId: string | null
    asaasCustomerId: string | null
    name: string | null
    cpfCnpj: string | null
    email: string | null
    phone: string | null
    postalCode: string | null
    address: string | null
    addressNumber: string | null
    complement: string | null
    province: string | null
    city: string | null
    state: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingCustomerCountAggregateOutputType = {
    id: number
    companyId: number
    asaasCustomerId: number
    name: number
    cpfCnpj: number
    email: number
    phone: number
    postalCode: number
    address: number
    addressNumber: number
    complement: number
    province: number
    city: number
    state: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BillingCustomerMinAggregateInputType = {
    id?: true
    companyId?: true
    asaasCustomerId?: true
    name?: true
    cpfCnpj?: true
    email?: true
    phone?: true
    postalCode?: true
    address?: true
    addressNumber?: true
    complement?: true
    province?: true
    city?: true
    state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingCustomerMaxAggregateInputType = {
    id?: true
    companyId?: true
    asaasCustomerId?: true
    name?: true
    cpfCnpj?: true
    email?: true
    phone?: true
    postalCode?: true
    address?: true
    addressNumber?: true
    complement?: true
    province?: true
    city?: true
    state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingCustomerCountAggregateInputType = {
    id?: true
    companyId?: true
    asaasCustomerId?: true
    name?: true
    cpfCnpj?: true
    email?: true
    phone?: true
    postalCode?: true
    address?: true
    addressNumber?: true
    complement?: true
    province?: true
    city?: true
    state?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BillingCustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingCustomer to aggregate.
     */
    where?: BillingCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCustomers to fetch.
     */
    orderBy?: BillingCustomerOrderByWithRelationInput | BillingCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingCustomers
    **/
    _count?: true | BillingCustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingCustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingCustomerMaxAggregateInputType
  }

  export type GetBillingCustomerAggregateType<T extends BillingCustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingCustomer[P]>
      : GetScalarType<T[P], AggregateBillingCustomer[P]>
  }




  export type BillingCustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingCustomerWhereInput
    orderBy?: BillingCustomerOrderByWithAggregationInput | BillingCustomerOrderByWithAggregationInput[]
    by: BillingCustomerScalarFieldEnum[] | BillingCustomerScalarFieldEnum
    having?: BillingCustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingCustomerCountAggregateInputType | true
    _min?: BillingCustomerMinAggregateInputType
    _max?: BillingCustomerMaxAggregateInputType
  }

  export type BillingCustomerGroupByOutputType = {
    id: string
    companyId: string
    asaasCustomerId: string
    name: string
    cpfCnpj: string
    email: string
    phone: string | null
    postalCode: string | null
    address: string | null
    addressNumber: string | null
    complement: string | null
    province: string | null
    city: string | null
    state: string | null
    createdAt: Date
    updatedAt: Date
    _count: BillingCustomerCountAggregateOutputType | null
    _min: BillingCustomerMinAggregateOutputType | null
    _max: BillingCustomerMaxAggregateOutputType | null
  }

  type GetBillingCustomerGroupByPayload<T extends BillingCustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingCustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingCustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingCustomerGroupByOutputType[P]>
            : GetScalarType<T[P], BillingCustomerGroupByOutputType[P]>
        }
      >
    >


  export type BillingCustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    asaasCustomerId?: boolean
    name?: boolean
    cpfCnpj?: boolean
    email?: boolean
    phone?: boolean
    postalCode?: boolean
    address?: boolean
    addressNumber?: boolean
    complement?: boolean
    province?: boolean
    city?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    invoices?: boolean | BillingCustomer$invoicesArgs<ExtArgs>
    billingSubscription?: boolean | BillingCustomer$billingSubscriptionArgs<ExtArgs>
    _count?: boolean | BillingCustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingCustomer"]>

  export type BillingCustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    asaasCustomerId?: boolean
    name?: boolean
    cpfCnpj?: boolean
    email?: boolean
    phone?: boolean
    postalCode?: boolean
    address?: boolean
    addressNumber?: boolean
    complement?: boolean
    province?: boolean
    city?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingCustomer"]>

  export type BillingCustomerSelectScalar = {
    id?: boolean
    companyId?: boolean
    asaasCustomerId?: boolean
    name?: boolean
    cpfCnpj?: boolean
    email?: boolean
    phone?: boolean
    postalCode?: boolean
    address?: boolean
    addressNumber?: boolean
    complement?: boolean
    province?: boolean
    city?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BillingCustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    invoices?: boolean | BillingCustomer$invoicesArgs<ExtArgs>
    billingSubscription?: boolean | BillingCustomer$billingSubscriptionArgs<ExtArgs>
    _count?: boolean | BillingCustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BillingCustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }

  export type $BillingCustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingCustomer"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
      billingSubscription: Prisma.$BillingSubscriptionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyId: string
      asaasCustomerId: string
      name: string
      cpfCnpj: string
      email: string
      phone: string | null
      postalCode: string | null
      address: string | null
      addressNumber: string | null
      complement: string | null
      province: string | null
      city: string | null
      state: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["billingCustomer"]>
    composites: {}
  }

  type BillingCustomerGetPayload<S extends boolean | null | undefined | BillingCustomerDefaultArgs> = $Result.GetResult<Prisma.$BillingCustomerPayload, S>

  type BillingCustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BillingCustomerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BillingCustomerCountAggregateInputType | true
    }

  export interface BillingCustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingCustomer'], meta: { name: 'BillingCustomer' } }
    /**
     * Find zero or one BillingCustomer that matches the filter.
     * @param {BillingCustomerFindUniqueArgs} args - Arguments to find a BillingCustomer
     * @example
     * // Get one BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingCustomerFindUniqueArgs>(args: SelectSubset<T, BillingCustomerFindUniqueArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BillingCustomer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BillingCustomerFindUniqueOrThrowArgs} args - Arguments to find a BillingCustomer
     * @example
     * // Get one BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingCustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingCustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BillingCustomer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerFindFirstArgs} args - Arguments to find a BillingCustomer
     * @example
     * // Get one BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingCustomerFindFirstArgs>(args?: SelectSubset<T, BillingCustomerFindFirstArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BillingCustomer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerFindFirstOrThrowArgs} args - Arguments to find a BillingCustomer
     * @example
     * // Get one BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingCustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingCustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BillingCustomers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingCustomers
     * const billingCustomers = await prisma.billingCustomer.findMany()
     * 
     * // Get first 10 BillingCustomers
     * const billingCustomers = await prisma.billingCustomer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingCustomerWithIdOnly = await prisma.billingCustomer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingCustomerFindManyArgs>(args?: SelectSubset<T, BillingCustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BillingCustomer.
     * @param {BillingCustomerCreateArgs} args - Arguments to create a BillingCustomer.
     * @example
     * // Create one BillingCustomer
     * const BillingCustomer = await prisma.billingCustomer.create({
     *   data: {
     *     // ... data to create a BillingCustomer
     *   }
     * })
     * 
     */
    create<T extends BillingCustomerCreateArgs>(args: SelectSubset<T, BillingCustomerCreateArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BillingCustomers.
     * @param {BillingCustomerCreateManyArgs} args - Arguments to create many BillingCustomers.
     * @example
     * // Create many BillingCustomers
     * const billingCustomer = await prisma.billingCustomer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingCustomerCreateManyArgs>(args?: SelectSubset<T, BillingCustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingCustomers and returns the data saved in the database.
     * @param {BillingCustomerCreateManyAndReturnArgs} args - Arguments to create many BillingCustomers.
     * @example
     * // Create many BillingCustomers
     * const billingCustomer = await prisma.billingCustomer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingCustomers and only return the `id`
     * const billingCustomerWithIdOnly = await prisma.billingCustomer.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingCustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingCustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BillingCustomer.
     * @param {BillingCustomerDeleteArgs} args - Arguments to delete one BillingCustomer.
     * @example
     * // Delete one BillingCustomer
     * const BillingCustomer = await prisma.billingCustomer.delete({
     *   where: {
     *     // ... filter to delete one BillingCustomer
     *   }
     * })
     * 
     */
    delete<T extends BillingCustomerDeleteArgs>(args: SelectSubset<T, BillingCustomerDeleteArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BillingCustomer.
     * @param {BillingCustomerUpdateArgs} args - Arguments to update one BillingCustomer.
     * @example
     * // Update one BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingCustomerUpdateArgs>(args: SelectSubset<T, BillingCustomerUpdateArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BillingCustomers.
     * @param {BillingCustomerDeleteManyArgs} args - Arguments to filter BillingCustomers to delete.
     * @example
     * // Delete a few BillingCustomers
     * const { count } = await prisma.billingCustomer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingCustomerDeleteManyArgs>(args?: SelectSubset<T, BillingCustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingCustomers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingCustomers
     * const billingCustomer = await prisma.billingCustomer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingCustomerUpdateManyArgs>(args: SelectSubset<T, BillingCustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BillingCustomer.
     * @param {BillingCustomerUpsertArgs} args - Arguments to update or create a BillingCustomer.
     * @example
     * // Update or create a BillingCustomer
     * const billingCustomer = await prisma.billingCustomer.upsert({
     *   create: {
     *     // ... data to create a BillingCustomer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingCustomer we want to update
     *   }
     * })
     */
    upsert<T extends BillingCustomerUpsertArgs>(args: SelectSubset<T, BillingCustomerUpsertArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BillingCustomers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerCountArgs} args - Arguments to filter BillingCustomers to count.
     * @example
     * // Count the number of BillingCustomers
     * const count = await prisma.billingCustomer.count({
     *   where: {
     *     // ... the filter for the BillingCustomers we want to count
     *   }
     * })
    **/
    count<T extends BillingCustomerCountArgs>(
      args?: Subset<T, BillingCustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingCustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingCustomer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BillingCustomerAggregateArgs>(args: Subset<T, BillingCustomerAggregateArgs>): Prisma.PrismaPromise<GetBillingCustomerAggregateType<T>>

    /**
     * Group by BillingCustomer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BillingCustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingCustomerGroupByArgs['orderBy'] }
        : { orderBy?: BillingCustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BillingCustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingCustomer model
   */
  readonly fields: BillingCustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingCustomer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingCustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    invoices<T extends BillingCustomer$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, BillingCustomer$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany"> | Null>
    billingSubscription<T extends BillingCustomer$billingSubscriptionArgs<ExtArgs> = {}>(args?: Subset<T, BillingCustomer$billingSubscriptionArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BillingCustomer model
   */ 
  interface BillingCustomerFieldRefs {
    readonly id: FieldRef<"BillingCustomer", 'String'>
    readonly companyId: FieldRef<"BillingCustomer", 'String'>
    readonly asaasCustomerId: FieldRef<"BillingCustomer", 'String'>
    readonly name: FieldRef<"BillingCustomer", 'String'>
    readonly cpfCnpj: FieldRef<"BillingCustomer", 'String'>
    readonly email: FieldRef<"BillingCustomer", 'String'>
    readonly phone: FieldRef<"BillingCustomer", 'String'>
    readonly postalCode: FieldRef<"BillingCustomer", 'String'>
    readonly address: FieldRef<"BillingCustomer", 'String'>
    readonly addressNumber: FieldRef<"BillingCustomer", 'String'>
    readonly complement: FieldRef<"BillingCustomer", 'String'>
    readonly province: FieldRef<"BillingCustomer", 'String'>
    readonly city: FieldRef<"BillingCustomer", 'String'>
    readonly state: FieldRef<"BillingCustomer", 'String'>
    readonly createdAt: FieldRef<"BillingCustomer", 'DateTime'>
    readonly updatedAt: FieldRef<"BillingCustomer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingCustomer findUnique
   */
  export type BillingCustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter, which BillingCustomer to fetch.
     */
    where: BillingCustomerWhereUniqueInput
  }

  /**
   * BillingCustomer findUniqueOrThrow
   */
  export type BillingCustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter, which BillingCustomer to fetch.
     */
    where: BillingCustomerWhereUniqueInput
  }

  /**
   * BillingCustomer findFirst
   */
  export type BillingCustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter, which BillingCustomer to fetch.
     */
    where?: BillingCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCustomers to fetch.
     */
    orderBy?: BillingCustomerOrderByWithRelationInput | BillingCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingCustomers.
     */
    cursor?: BillingCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingCustomers.
     */
    distinct?: BillingCustomerScalarFieldEnum | BillingCustomerScalarFieldEnum[]
  }

  /**
   * BillingCustomer findFirstOrThrow
   */
  export type BillingCustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter, which BillingCustomer to fetch.
     */
    where?: BillingCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCustomers to fetch.
     */
    orderBy?: BillingCustomerOrderByWithRelationInput | BillingCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingCustomers.
     */
    cursor?: BillingCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingCustomers.
     */
    distinct?: BillingCustomerScalarFieldEnum | BillingCustomerScalarFieldEnum[]
  }

  /**
   * BillingCustomer findMany
   */
  export type BillingCustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter, which BillingCustomers to fetch.
     */
    where?: BillingCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingCustomers to fetch.
     */
    orderBy?: BillingCustomerOrderByWithRelationInput | BillingCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingCustomers.
     */
    cursor?: BillingCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingCustomers.
     */
    skip?: number
    distinct?: BillingCustomerScalarFieldEnum | BillingCustomerScalarFieldEnum[]
  }

  /**
   * BillingCustomer create
   */
  export type BillingCustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a BillingCustomer.
     */
    data: XOR<BillingCustomerCreateInput, BillingCustomerUncheckedCreateInput>
  }

  /**
   * BillingCustomer createMany
   */
  export type BillingCustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingCustomers.
     */
    data: BillingCustomerCreateManyInput | BillingCustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingCustomer createManyAndReturn
   */
  export type BillingCustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BillingCustomers.
     */
    data: BillingCustomerCreateManyInput | BillingCustomerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BillingCustomer update
   */
  export type BillingCustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a BillingCustomer.
     */
    data: XOR<BillingCustomerUpdateInput, BillingCustomerUncheckedUpdateInput>
    /**
     * Choose, which BillingCustomer to update.
     */
    where: BillingCustomerWhereUniqueInput
  }

  /**
   * BillingCustomer updateMany
   */
  export type BillingCustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingCustomers.
     */
    data: XOR<BillingCustomerUpdateManyMutationInput, BillingCustomerUncheckedUpdateManyInput>
    /**
     * Filter which BillingCustomers to update
     */
    where?: BillingCustomerWhereInput
  }

  /**
   * BillingCustomer upsert
   */
  export type BillingCustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the BillingCustomer to update in case it exists.
     */
    where: BillingCustomerWhereUniqueInput
    /**
     * In case the BillingCustomer found by the `where` argument doesn't exist, create a new BillingCustomer with this data.
     */
    create: XOR<BillingCustomerCreateInput, BillingCustomerUncheckedCreateInput>
    /**
     * In case the BillingCustomer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingCustomerUpdateInput, BillingCustomerUncheckedUpdateInput>
  }

  /**
   * BillingCustomer delete
   */
  export type BillingCustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
    /**
     * Filter which BillingCustomer to delete.
     */
    where: BillingCustomerWhereUniqueInput
  }

  /**
   * BillingCustomer deleteMany
   */
  export type BillingCustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingCustomers to delete
     */
    where?: BillingCustomerWhereInput
  }

  /**
   * BillingCustomer.invoices
   */
  export type BillingCustomer$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * BillingCustomer.billingSubscription
   */
  export type BillingCustomer$billingSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
    where?: BillingSubscriptionWhereInput
  }

  /**
   * BillingCustomer without action
   */
  export type BillingCustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingCustomer
     */
    select?: BillingCustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingCustomerInclude<ExtArgs> | null
  }


  /**
   * Model BillingSubscription
   */

  export type AggregateBillingSubscription = {
    _count: BillingSubscriptionCountAggregateOutputType | null
    _avg: BillingSubscriptionAvgAggregateOutputType | null
    _sum: BillingSubscriptionSumAggregateOutputType | null
    _min: BillingSubscriptionMinAggregateOutputType | null
    _max: BillingSubscriptionMaxAggregateOutputType | null
  }

  export type BillingSubscriptionAvgAggregateOutputType = {
    value: Decimal | null
  }

  export type BillingSubscriptionSumAggregateOutputType = {
    value: Decimal | null
  }

  export type BillingSubscriptionMinAggregateOutputType = {
    id: string | null
    billingCustomerId: string | null
    asaasSubscriptionId: string | null
    planId: string | null
    billingType: $Enums.BillingType | null
    value: Decimal | null
    nextDueDate: Date | null
    cycle: $Enums.BillingCycle | null
    status: $Enums.BillingSubscriptionStatus | null
    description: string | null
    externalReference: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingSubscriptionMaxAggregateOutputType = {
    id: string | null
    billingCustomerId: string | null
    asaasSubscriptionId: string | null
    planId: string | null
    billingType: $Enums.BillingType | null
    value: Decimal | null
    nextDueDate: Date | null
    cycle: $Enums.BillingCycle | null
    status: $Enums.BillingSubscriptionStatus | null
    description: string | null
    externalReference: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingSubscriptionCountAggregateOutputType = {
    id: number
    billingCustomerId: number
    asaasSubscriptionId: number
    planId: number
    billingType: number
    value: number
    nextDueDate: number
    cycle: number
    status: number
    description: number
    externalReference: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BillingSubscriptionAvgAggregateInputType = {
    value?: true
  }

  export type BillingSubscriptionSumAggregateInputType = {
    value?: true
  }

  export type BillingSubscriptionMinAggregateInputType = {
    id?: true
    billingCustomerId?: true
    asaasSubscriptionId?: true
    planId?: true
    billingType?: true
    value?: true
    nextDueDate?: true
    cycle?: true
    status?: true
    description?: true
    externalReference?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingSubscriptionMaxAggregateInputType = {
    id?: true
    billingCustomerId?: true
    asaasSubscriptionId?: true
    planId?: true
    billingType?: true
    value?: true
    nextDueDate?: true
    cycle?: true
    status?: true
    description?: true
    externalReference?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingSubscriptionCountAggregateInputType = {
    id?: true
    billingCustomerId?: true
    asaasSubscriptionId?: true
    planId?: true
    billingType?: true
    value?: true
    nextDueDate?: true
    cycle?: true
    status?: true
    description?: true
    externalReference?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BillingSubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingSubscription to aggregate.
     */
    where?: BillingSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingSubscriptions to fetch.
     */
    orderBy?: BillingSubscriptionOrderByWithRelationInput | BillingSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingSubscriptions
    **/
    _count?: true | BillingSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BillingSubscriptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BillingSubscriptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingSubscriptionMaxAggregateInputType
  }

  export type GetBillingSubscriptionAggregateType<T extends BillingSubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingSubscription[P]>
      : GetScalarType<T[P], AggregateBillingSubscription[P]>
  }




  export type BillingSubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingSubscriptionWhereInput
    orderBy?: BillingSubscriptionOrderByWithAggregationInput | BillingSubscriptionOrderByWithAggregationInput[]
    by: BillingSubscriptionScalarFieldEnum[] | BillingSubscriptionScalarFieldEnum
    having?: BillingSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingSubscriptionCountAggregateInputType | true
    _avg?: BillingSubscriptionAvgAggregateInputType
    _sum?: BillingSubscriptionSumAggregateInputType
    _min?: BillingSubscriptionMinAggregateInputType
    _max?: BillingSubscriptionMaxAggregateInputType
  }

  export type BillingSubscriptionGroupByOutputType = {
    id: string
    billingCustomerId: string
    asaasSubscriptionId: string
    planId: string
    billingType: $Enums.BillingType
    value: Decimal
    nextDueDate: Date
    cycle: $Enums.BillingCycle
    status: $Enums.BillingSubscriptionStatus
    description: string | null
    externalReference: string | null
    createdAt: Date
    updatedAt: Date
    _count: BillingSubscriptionCountAggregateOutputType | null
    _avg: BillingSubscriptionAvgAggregateOutputType | null
    _sum: BillingSubscriptionSumAggregateOutputType | null
    _min: BillingSubscriptionMinAggregateOutputType | null
    _max: BillingSubscriptionMaxAggregateOutputType | null
  }

  type GetBillingSubscriptionGroupByPayload<T extends BillingSubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingSubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingSubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingSubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], BillingSubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type BillingSubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    billingCustomerId?: boolean
    asaasSubscriptionId?: boolean
    planId?: boolean
    billingType?: boolean
    value?: boolean
    nextDueDate?: boolean
    cycle?: boolean
    status?: boolean
    description?: boolean
    externalReference?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    billingCustomer?: boolean | BillingCustomerDefaultArgs<ExtArgs>
    plan?: boolean | PlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingSubscription"]>

  export type BillingSubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    billingCustomerId?: boolean
    asaasSubscriptionId?: boolean
    planId?: boolean
    billingType?: boolean
    value?: boolean
    nextDueDate?: boolean
    cycle?: boolean
    status?: boolean
    description?: boolean
    externalReference?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    billingCustomer?: boolean | BillingCustomerDefaultArgs<ExtArgs>
    plan?: boolean | PlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingSubscription"]>

  export type BillingSubscriptionSelectScalar = {
    id?: boolean
    billingCustomerId?: boolean
    asaasSubscriptionId?: boolean
    planId?: boolean
    billingType?: boolean
    value?: boolean
    nextDueDate?: boolean
    cycle?: boolean
    status?: boolean
    description?: boolean
    externalReference?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BillingSubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    billingCustomer?: boolean | BillingCustomerDefaultArgs<ExtArgs>
    plan?: boolean | PlanDefaultArgs<ExtArgs>
  }
  export type BillingSubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    billingCustomer?: boolean | BillingCustomerDefaultArgs<ExtArgs>
    plan?: boolean | PlanDefaultArgs<ExtArgs>
  }

  export type $BillingSubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingSubscription"
    objects: {
      billingCustomer: Prisma.$BillingCustomerPayload<ExtArgs>
      plan: Prisma.$PlanPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      billingCustomerId: string
      asaasSubscriptionId: string
      planId: string
      billingType: $Enums.BillingType
      value: Prisma.Decimal
      nextDueDate: Date
      cycle: $Enums.BillingCycle
      status: $Enums.BillingSubscriptionStatus
      description: string | null
      externalReference: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["billingSubscription"]>
    composites: {}
  }

  type BillingSubscriptionGetPayload<S extends boolean | null | undefined | BillingSubscriptionDefaultArgs> = $Result.GetResult<Prisma.$BillingSubscriptionPayload, S>

  type BillingSubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BillingSubscriptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BillingSubscriptionCountAggregateInputType | true
    }

  export interface BillingSubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingSubscription'], meta: { name: 'BillingSubscription' } }
    /**
     * Find zero or one BillingSubscription that matches the filter.
     * @param {BillingSubscriptionFindUniqueArgs} args - Arguments to find a BillingSubscription
     * @example
     * // Get one BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingSubscriptionFindUniqueArgs>(args: SelectSubset<T, BillingSubscriptionFindUniqueArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BillingSubscription that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BillingSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a BillingSubscription
     * @example
     * // Get one BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingSubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingSubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BillingSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionFindFirstArgs} args - Arguments to find a BillingSubscription
     * @example
     * // Get one BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingSubscriptionFindFirstArgs>(args?: SelectSubset<T, BillingSubscriptionFindFirstArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BillingSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionFindFirstOrThrowArgs} args - Arguments to find a BillingSubscription
     * @example
     * // Get one BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingSubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingSubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BillingSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingSubscriptions
     * const billingSubscriptions = await prisma.billingSubscription.findMany()
     * 
     * // Get first 10 BillingSubscriptions
     * const billingSubscriptions = await prisma.billingSubscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingSubscriptionWithIdOnly = await prisma.billingSubscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingSubscriptionFindManyArgs>(args?: SelectSubset<T, BillingSubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BillingSubscription.
     * @param {BillingSubscriptionCreateArgs} args - Arguments to create a BillingSubscription.
     * @example
     * // Create one BillingSubscription
     * const BillingSubscription = await prisma.billingSubscription.create({
     *   data: {
     *     // ... data to create a BillingSubscription
     *   }
     * })
     * 
     */
    create<T extends BillingSubscriptionCreateArgs>(args: SelectSubset<T, BillingSubscriptionCreateArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BillingSubscriptions.
     * @param {BillingSubscriptionCreateManyArgs} args - Arguments to create many BillingSubscriptions.
     * @example
     * // Create many BillingSubscriptions
     * const billingSubscription = await prisma.billingSubscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingSubscriptionCreateManyArgs>(args?: SelectSubset<T, BillingSubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingSubscriptions and returns the data saved in the database.
     * @param {BillingSubscriptionCreateManyAndReturnArgs} args - Arguments to create many BillingSubscriptions.
     * @example
     * // Create many BillingSubscriptions
     * const billingSubscription = await prisma.billingSubscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingSubscriptions and only return the `id`
     * const billingSubscriptionWithIdOnly = await prisma.billingSubscription.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingSubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingSubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BillingSubscription.
     * @param {BillingSubscriptionDeleteArgs} args - Arguments to delete one BillingSubscription.
     * @example
     * // Delete one BillingSubscription
     * const BillingSubscription = await prisma.billingSubscription.delete({
     *   where: {
     *     // ... filter to delete one BillingSubscription
     *   }
     * })
     * 
     */
    delete<T extends BillingSubscriptionDeleteArgs>(args: SelectSubset<T, BillingSubscriptionDeleteArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BillingSubscription.
     * @param {BillingSubscriptionUpdateArgs} args - Arguments to update one BillingSubscription.
     * @example
     * // Update one BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingSubscriptionUpdateArgs>(args: SelectSubset<T, BillingSubscriptionUpdateArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BillingSubscriptions.
     * @param {BillingSubscriptionDeleteManyArgs} args - Arguments to filter BillingSubscriptions to delete.
     * @example
     * // Delete a few BillingSubscriptions
     * const { count } = await prisma.billingSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingSubscriptionDeleteManyArgs>(args?: SelectSubset<T, BillingSubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingSubscriptions
     * const billingSubscription = await prisma.billingSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingSubscriptionUpdateManyArgs>(args: SelectSubset<T, BillingSubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BillingSubscription.
     * @param {BillingSubscriptionUpsertArgs} args - Arguments to update or create a BillingSubscription.
     * @example
     * // Update or create a BillingSubscription
     * const billingSubscription = await prisma.billingSubscription.upsert({
     *   create: {
     *     // ... data to create a BillingSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingSubscription we want to update
     *   }
     * })
     */
    upsert<T extends BillingSubscriptionUpsertArgs>(args: SelectSubset<T, BillingSubscriptionUpsertArgs<ExtArgs>>): Prisma__BillingSubscriptionClient<$Result.GetResult<Prisma.$BillingSubscriptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BillingSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionCountArgs} args - Arguments to filter BillingSubscriptions to count.
     * @example
     * // Count the number of BillingSubscriptions
     * const count = await prisma.billingSubscription.count({
     *   where: {
     *     // ... the filter for the BillingSubscriptions we want to count
     *   }
     * })
    **/
    count<T extends BillingSubscriptionCountArgs>(
      args?: Subset<T, BillingSubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BillingSubscriptionAggregateArgs>(args: Subset<T, BillingSubscriptionAggregateArgs>): Prisma.PrismaPromise<GetBillingSubscriptionAggregateType<T>>

    /**
     * Group by BillingSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingSubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BillingSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: BillingSubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BillingSubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingSubscription model
   */
  readonly fields: BillingSubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingSubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    billingCustomer<T extends BillingCustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BillingCustomerDefaultArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    plan<T extends PlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlanDefaultArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BillingSubscription model
   */ 
  interface BillingSubscriptionFieldRefs {
    readonly id: FieldRef<"BillingSubscription", 'String'>
    readonly billingCustomerId: FieldRef<"BillingSubscription", 'String'>
    readonly asaasSubscriptionId: FieldRef<"BillingSubscription", 'String'>
    readonly planId: FieldRef<"BillingSubscription", 'String'>
    readonly billingType: FieldRef<"BillingSubscription", 'BillingType'>
    readonly value: FieldRef<"BillingSubscription", 'Decimal'>
    readonly nextDueDate: FieldRef<"BillingSubscription", 'DateTime'>
    readonly cycle: FieldRef<"BillingSubscription", 'BillingCycle'>
    readonly status: FieldRef<"BillingSubscription", 'BillingSubscriptionStatus'>
    readonly description: FieldRef<"BillingSubscription", 'String'>
    readonly externalReference: FieldRef<"BillingSubscription", 'String'>
    readonly createdAt: FieldRef<"BillingSubscription", 'DateTime'>
    readonly updatedAt: FieldRef<"BillingSubscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingSubscription findUnique
   */
  export type BillingSubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which BillingSubscription to fetch.
     */
    where: BillingSubscriptionWhereUniqueInput
  }

  /**
   * BillingSubscription findUniqueOrThrow
   */
  export type BillingSubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which BillingSubscription to fetch.
     */
    where: BillingSubscriptionWhereUniqueInput
  }

  /**
   * BillingSubscription findFirst
   */
  export type BillingSubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which BillingSubscription to fetch.
     */
    where?: BillingSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingSubscriptions to fetch.
     */
    orderBy?: BillingSubscriptionOrderByWithRelationInput | BillingSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingSubscriptions.
     */
    cursor?: BillingSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingSubscriptions.
     */
    distinct?: BillingSubscriptionScalarFieldEnum | BillingSubscriptionScalarFieldEnum[]
  }

  /**
   * BillingSubscription findFirstOrThrow
   */
  export type BillingSubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which BillingSubscription to fetch.
     */
    where?: BillingSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingSubscriptions to fetch.
     */
    orderBy?: BillingSubscriptionOrderByWithRelationInput | BillingSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingSubscriptions.
     */
    cursor?: BillingSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingSubscriptions.
     */
    distinct?: BillingSubscriptionScalarFieldEnum | BillingSubscriptionScalarFieldEnum[]
  }

  /**
   * BillingSubscription findMany
   */
  export type BillingSubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which BillingSubscriptions to fetch.
     */
    where?: BillingSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingSubscriptions to fetch.
     */
    orderBy?: BillingSubscriptionOrderByWithRelationInput | BillingSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingSubscriptions.
     */
    cursor?: BillingSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingSubscriptions.
     */
    skip?: number
    distinct?: BillingSubscriptionScalarFieldEnum | BillingSubscriptionScalarFieldEnum[]
  }

  /**
   * BillingSubscription create
   */
  export type BillingSubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a BillingSubscription.
     */
    data: XOR<BillingSubscriptionCreateInput, BillingSubscriptionUncheckedCreateInput>
  }

  /**
   * BillingSubscription createMany
   */
  export type BillingSubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingSubscriptions.
     */
    data: BillingSubscriptionCreateManyInput | BillingSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingSubscription createManyAndReturn
   */
  export type BillingSubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BillingSubscriptions.
     */
    data: BillingSubscriptionCreateManyInput | BillingSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BillingSubscription update
   */
  export type BillingSubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a BillingSubscription.
     */
    data: XOR<BillingSubscriptionUpdateInput, BillingSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which BillingSubscription to update.
     */
    where: BillingSubscriptionWhereUniqueInput
  }

  /**
   * BillingSubscription updateMany
   */
  export type BillingSubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingSubscriptions.
     */
    data: XOR<BillingSubscriptionUpdateManyMutationInput, BillingSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which BillingSubscriptions to update
     */
    where?: BillingSubscriptionWhereInput
  }

  /**
   * BillingSubscription upsert
   */
  export type BillingSubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the BillingSubscription to update in case it exists.
     */
    where: BillingSubscriptionWhereUniqueInput
    /**
     * In case the BillingSubscription found by the `where` argument doesn't exist, create a new BillingSubscription with this data.
     */
    create: XOR<BillingSubscriptionCreateInput, BillingSubscriptionUncheckedCreateInput>
    /**
     * In case the BillingSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingSubscriptionUpdateInput, BillingSubscriptionUncheckedUpdateInput>
  }

  /**
   * BillingSubscription delete
   */
  export type BillingSubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
    /**
     * Filter which BillingSubscription to delete.
     */
    where: BillingSubscriptionWhereUniqueInput
  }

  /**
   * BillingSubscription deleteMany
   */
  export type BillingSubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingSubscriptions to delete
     */
    where?: BillingSubscriptionWhereInput
  }

  /**
   * BillingSubscription without action
   */
  export type BillingSubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingSubscription
     */
    select?: BillingSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingSubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model Invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceAvgAggregateOutputType = {
    value: Decimal | null
    netValue: Decimal | null
  }

  export type InvoiceSumAggregateOutputType = {
    value: Decimal | null
    netValue: Decimal | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: string | null
    billingCustomerId: string | null
    asaasPaymentId: string | null
    value: Decimal | null
    netValue: Decimal | null
    billingType: $Enums.BillingType | null
    status: $Enums.InvoiceStatus | null
    dueDate: Date | null
    paidAt: Date | null
    invoiceUrl: string | null
    bankSlipUrl: string | null
    pixQrCode: string | null
    pixQrCodeImage: string | null
    description: string | null
    externalReference: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: string | null
    billingCustomerId: string | null
    asaasPaymentId: string | null
    value: Decimal | null
    netValue: Decimal | null
    billingType: $Enums.BillingType | null
    status: $Enums.InvoiceStatus | null
    dueDate: Date | null
    paidAt: Date | null
    invoiceUrl: string | null
    bankSlipUrl: string | null
    pixQrCode: string | null
    pixQrCodeImage: string | null
    description: string | null
    externalReference: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    billingCustomerId: number
    asaasPaymentId: number
    value: number
    netValue: number
    billingType: number
    status: number
    dueDate: number
    paidAt: number
    invoiceUrl: number
    bankSlipUrl: number
    pixQrCode: number
    pixQrCodeImage: number
    description: number
    externalReference: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InvoiceAvgAggregateInputType = {
    value?: true
    netValue?: true
  }

  export type InvoiceSumAggregateInputType = {
    value?: true
    netValue?: true
  }

  export type InvoiceMinAggregateInputType = {
    id?: true
    billingCustomerId?: true
    asaasPaymentId?: true
    value?: true
    netValue?: true
    billingType?: true
    status?: true
    dueDate?: true
    paidAt?: true
    invoiceUrl?: true
    bankSlipUrl?: true
    pixQrCode?: true
    pixQrCodeImage?: true
    description?: true
    externalReference?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    billingCustomerId?: true
    asaasPaymentId?: true
    value?: true
    netValue?: true
    billingType?: true
    status?: true
    dueDate?: true
    paidAt?: true
    invoiceUrl?: true
    bankSlipUrl?: true
    pixQrCode?: true
    pixQrCodeImage?: true
    description?: true
    externalReference?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    billingCustomerId?: true
    asaasPaymentId?: true
    value?: true
    netValue?: true
    billingType?: true
    status?: true
    dueDate?: true
    paidAt?: true
    invoiceUrl?: true
    bankSlipUrl?: true
    pixQrCode?: true
    pixQrCodeImage?: true
    description?: true
    externalReference?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoice to aggregate.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type InvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithAggregationInput | InvoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: InvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _avg?: InvoiceAvgAggregateInputType
    _sum?: InvoiceSumAggregateInputType
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: string
    billingCustomerId: string
    asaasPaymentId: string | null
    value: Decimal
    netValue: Decimal | null
    billingType: $Enums.BillingType
    status: $Enums.InvoiceStatus
    dueDate: Date
    paidAt: Date | null
    invoiceUrl: string | null
    bankSlipUrl: string | null
    pixQrCode: string | null
    pixQrCodeImage: string | null
    description: string | null
    externalReference: string | null
    createdAt: Date
    updatedAt: Date
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends InvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    billingCustomerId?: boolean
    asaasPaymentId?: boolean
    value?: boolean
    netValue?: boolean
    billingType?: boolean
    status?: boolean
    dueDate?: boolean
    paidAt?: boolean
    invoiceUrl?: boolean
    bankSlipUrl?: boolean
    pixQrCode?: boolean
    pixQrCodeImage?: boolean
    description?: boolean
    externalReference?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    billingCustomer?: boolean | BillingCustomerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    billingCustomerId?: boolean
    asaasPaymentId?: boolean
    value?: boolean
    netValue?: boolean
    billingType?: boolean
    status?: boolean
    dueDate?: boolean
    paidAt?: boolean
    invoiceUrl?: boolean
    bankSlipUrl?: boolean
    pixQrCode?: boolean
    pixQrCodeImage?: boolean
    description?: boolean
    externalReference?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    billingCustomer?: boolean | BillingCustomerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectScalar = {
    id?: boolean
    billingCustomerId?: boolean
    asaasPaymentId?: boolean
    value?: boolean
    netValue?: boolean
    billingType?: boolean
    status?: boolean
    dueDate?: boolean
    paidAt?: boolean
    invoiceUrl?: boolean
    bankSlipUrl?: boolean
    pixQrCode?: boolean
    pixQrCodeImage?: boolean
    description?: boolean
    externalReference?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    billingCustomer?: boolean | BillingCustomerDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    billingCustomer?: boolean | BillingCustomerDefaultArgs<ExtArgs>
  }

  export type $InvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invoice"
    objects: {
      billingCustomer: Prisma.$BillingCustomerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      billingCustomerId: string
      asaasPaymentId: string | null
      value: Prisma.Decimal
      netValue: Prisma.Decimal | null
      billingType: $Enums.BillingType
      status: $Enums.InvoiceStatus
      dueDate: Date
      paidAt: Date | null
      invoiceUrl: string | null
      bankSlipUrl: string | null
      pixQrCode: string | null
      pixQrCodeImage: string | null
      description: string | null
      externalReference: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type InvoiceGetPayload<S extends boolean | null | undefined | InvoiceDefaultArgs> = $Result.GetResult<Prisma.$InvoicePayload, S>

  type InvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvoiceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface InvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invoice'], meta: { name: 'Invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {InvoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceFindUniqueArgs>(args: SelectSubset<T, InvoiceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceFindFirstArgs>(args?: SelectSubset<T, InvoiceFindFirstArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceFindManyArgs>(args?: SelectSubset<T, InvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Invoice.
     * @param {InvoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends InvoiceCreateArgs>(args: SelectSubset<T, InvoiceCreateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Invoices.
     * @param {InvoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceCreateManyArgs>(args?: SelectSubset<T, InvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invoices and returns the data saved in the database.
     * @param {InvoiceCreateManyAndReturnArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Invoice.
     * @param {InvoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends InvoiceDeleteArgs>(args: SelectSubset<T, InvoiceDeleteArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Invoice.
     * @param {InvoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceUpdateArgs>(args: SelectSubset<T, InvoiceUpdateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Invoices.
     * @param {InvoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceDeleteManyArgs>(args?: SelectSubset<T, InvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceUpdateManyArgs>(args: SelectSubset<T, InvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Invoice.
     * @param {InvoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceUpsertArgs>(args: SelectSubset<T, InvoiceUpsertArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends InvoiceCountArgs>(
      args?: Subset<T, InvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invoice model
   */
  readonly fields: InvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    billingCustomer<T extends BillingCustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BillingCustomerDefaultArgs<ExtArgs>>): Prisma__BillingCustomerClient<$Result.GetResult<Prisma.$BillingCustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invoice model
   */ 
  interface InvoiceFieldRefs {
    readonly id: FieldRef<"Invoice", 'String'>
    readonly billingCustomerId: FieldRef<"Invoice", 'String'>
    readonly asaasPaymentId: FieldRef<"Invoice", 'String'>
    readonly value: FieldRef<"Invoice", 'Decimal'>
    readonly netValue: FieldRef<"Invoice", 'Decimal'>
    readonly billingType: FieldRef<"Invoice", 'BillingType'>
    readonly status: FieldRef<"Invoice", 'InvoiceStatus'>
    readonly dueDate: FieldRef<"Invoice", 'DateTime'>
    readonly paidAt: FieldRef<"Invoice", 'DateTime'>
    readonly invoiceUrl: FieldRef<"Invoice", 'String'>
    readonly bankSlipUrl: FieldRef<"Invoice", 'String'>
    readonly pixQrCode: FieldRef<"Invoice", 'String'>
    readonly pixQrCodeImage: FieldRef<"Invoice", 'String'>
    readonly description: FieldRef<"Invoice", 'String'>
    readonly externalReference: FieldRef<"Invoice", 'String'>
    readonly createdAt: FieldRef<"Invoice", 'DateTime'>
    readonly updatedAt: FieldRef<"Invoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invoice findUnique
   */
  export type InvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findUniqueOrThrow
   */
  export type InvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findFirst
   */
  export type InvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findFirstOrThrow
   */
  export type InvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findMany
   */
  export type InvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoices to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice create
   */
  export type InvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Invoice.
     */
    data: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
  }

  /**
   * Invoice createMany
   */
  export type InvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invoice createManyAndReturn
   */
  export type InvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice update
   */
  export type InvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Invoice.
     */
    data: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
    /**
     * Choose, which Invoice to update.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice updateMany
   */
  export type InvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
  }

  /**
   * Invoice upsert
   */
  export type InvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Invoice to update in case it exists.
     */
    where: InvoiceWhereUniqueInput
    /**
     * In case the Invoice found by the `where` argument doesn't exist, create a new Invoice with this data.
     */
    create: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
    /**
     * In case the Invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
  }

  /**
   * Invoice delete
   */
  export type InvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter which Invoice to delete.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice deleteMany
   */
  export type InvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoices to delete
     */
    where?: InvoiceWhereInput
  }

  /**
   * Invoice without action
   */
  export type InvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
  }


  /**
   * Model BillingWebhookLog
   */

  export type AggregateBillingWebhookLog = {
    _count: BillingWebhookLogCountAggregateOutputType | null
    _min: BillingWebhookLogMinAggregateOutputType | null
    _max: BillingWebhookLogMaxAggregateOutputType | null
  }

  export type BillingWebhookLogMinAggregateOutputType = {
    id: string | null
    event: string | null
    processed: boolean | null
    error: string | null
    createdAt: Date | null
  }

  export type BillingWebhookLogMaxAggregateOutputType = {
    id: string | null
    event: string | null
    processed: boolean | null
    error: string | null
    createdAt: Date | null
  }

  export type BillingWebhookLogCountAggregateOutputType = {
    id: number
    event: number
    payload: number
    processed: number
    error: number
    createdAt: number
    _all: number
  }


  export type BillingWebhookLogMinAggregateInputType = {
    id?: true
    event?: true
    processed?: true
    error?: true
    createdAt?: true
  }

  export type BillingWebhookLogMaxAggregateInputType = {
    id?: true
    event?: true
    processed?: true
    error?: true
    createdAt?: true
  }

  export type BillingWebhookLogCountAggregateInputType = {
    id?: true
    event?: true
    payload?: true
    processed?: true
    error?: true
    createdAt?: true
    _all?: true
  }

  export type BillingWebhookLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingWebhookLog to aggregate.
     */
    where?: BillingWebhookLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingWebhookLogs to fetch.
     */
    orderBy?: BillingWebhookLogOrderByWithRelationInput | BillingWebhookLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingWebhookLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingWebhookLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingWebhookLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingWebhookLogs
    **/
    _count?: true | BillingWebhookLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingWebhookLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingWebhookLogMaxAggregateInputType
  }

  export type GetBillingWebhookLogAggregateType<T extends BillingWebhookLogAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingWebhookLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingWebhookLog[P]>
      : GetScalarType<T[P], AggregateBillingWebhookLog[P]>
  }




  export type BillingWebhookLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingWebhookLogWhereInput
    orderBy?: BillingWebhookLogOrderByWithAggregationInput | BillingWebhookLogOrderByWithAggregationInput[]
    by: BillingWebhookLogScalarFieldEnum[] | BillingWebhookLogScalarFieldEnum
    having?: BillingWebhookLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingWebhookLogCountAggregateInputType | true
    _min?: BillingWebhookLogMinAggregateInputType
    _max?: BillingWebhookLogMaxAggregateInputType
  }

  export type BillingWebhookLogGroupByOutputType = {
    id: string
    event: string
    payload: JsonValue
    processed: boolean
    error: string | null
    createdAt: Date
    _count: BillingWebhookLogCountAggregateOutputType | null
    _min: BillingWebhookLogMinAggregateOutputType | null
    _max: BillingWebhookLogMaxAggregateOutputType | null
  }

  type GetBillingWebhookLogGroupByPayload<T extends BillingWebhookLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingWebhookLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingWebhookLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingWebhookLogGroupByOutputType[P]>
            : GetScalarType<T[P], BillingWebhookLogGroupByOutputType[P]>
        }
      >
    >


  export type BillingWebhookLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event?: boolean
    payload?: boolean
    processed?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["billingWebhookLog"]>

  export type BillingWebhookLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event?: boolean
    payload?: boolean
    processed?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["billingWebhookLog"]>

  export type BillingWebhookLogSelectScalar = {
    id?: boolean
    event?: boolean
    payload?: boolean
    processed?: boolean
    error?: boolean
    createdAt?: boolean
  }


  export type $BillingWebhookLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingWebhookLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      event: string
      payload: Prisma.JsonValue
      processed: boolean
      error: string | null
      createdAt: Date
    }, ExtArgs["result"]["billingWebhookLog"]>
    composites: {}
  }

  type BillingWebhookLogGetPayload<S extends boolean | null | undefined | BillingWebhookLogDefaultArgs> = $Result.GetResult<Prisma.$BillingWebhookLogPayload, S>

  type BillingWebhookLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BillingWebhookLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BillingWebhookLogCountAggregateInputType | true
    }

  export interface BillingWebhookLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingWebhookLog'], meta: { name: 'BillingWebhookLog' } }
    /**
     * Find zero or one BillingWebhookLog that matches the filter.
     * @param {BillingWebhookLogFindUniqueArgs} args - Arguments to find a BillingWebhookLog
     * @example
     * // Get one BillingWebhookLog
     * const billingWebhookLog = await prisma.billingWebhookLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingWebhookLogFindUniqueArgs>(args: SelectSubset<T, BillingWebhookLogFindUniqueArgs<ExtArgs>>): Prisma__BillingWebhookLogClient<$Result.GetResult<Prisma.$BillingWebhookLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BillingWebhookLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BillingWebhookLogFindUniqueOrThrowArgs} args - Arguments to find a BillingWebhookLog
     * @example
     * // Get one BillingWebhookLog
     * const billingWebhookLog = await prisma.billingWebhookLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingWebhookLogFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingWebhookLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingWebhookLogClient<$Result.GetResult<Prisma.$BillingWebhookLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BillingWebhookLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingWebhookLogFindFirstArgs} args - Arguments to find a BillingWebhookLog
     * @example
     * // Get one BillingWebhookLog
     * const billingWebhookLog = await prisma.billingWebhookLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingWebhookLogFindFirstArgs>(args?: SelectSubset<T, BillingWebhookLogFindFirstArgs<ExtArgs>>): Prisma__BillingWebhookLogClient<$Result.GetResult<Prisma.$BillingWebhookLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BillingWebhookLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingWebhookLogFindFirstOrThrowArgs} args - Arguments to find a BillingWebhookLog
     * @example
     * // Get one BillingWebhookLog
     * const billingWebhookLog = await prisma.billingWebhookLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingWebhookLogFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingWebhookLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingWebhookLogClient<$Result.GetResult<Prisma.$BillingWebhookLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BillingWebhookLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingWebhookLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingWebhookLogs
     * const billingWebhookLogs = await prisma.billingWebhookLog.findMany()
     * 
     * // Get first 10 BillingWebhookLogs
     * const billingWebhookLogs = await prisma.billingWebhookLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingWebhookLogWithIdOnly = await prisma.billingWebhookLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingWebhookLogFindManyArgs>(args?: SelectSubset<T, BillingWebhookLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingWebhookLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BillingWebhookLog.
     * @param {BillingWebhookLogCreateArgs} args - Arguments to create a BillingWebhookLog.
     * @example
     * // Create one BillingWebhookLog
     * const BillingWebhookLog = await prisma.billingWebhookLog.create({
     *   data: {
     *     // ... data to create a BillingWebhookLog
     *   }
     * })
     * 
     */
    create<T extends BillingWebhookLogCreateArgs>(args: SelectSubset<T, BillingWebhookLogCreateArgs<ExtArgs>>): Prisma__BillingWebhookLogClient<$Result.GetResult<Prisma.$BillingWebhookLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BillingWebhookLogs.
     * @param {BillingWebhookLogCreateManyArgs} args - Arguments to create many BillingWebhookLogs.
     * @example
     * // Create many BillingWebhookLogs
     * const billingWebhookLog = await prisma.billingWebhookLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingWebhookLogCreateManyArgs>(args?: SelectSubset<T, BillingWebhookLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingWebhookLogs and returns the data saved in the database.
     * @param {BillingWebhookLogCreateManyAndReturnArgs} args - Arguments to create many BillingWebhookLogs.
     * @example
     * // Create many BillingWebhookLogs
     * const billingWebhookLog = await prisma.billingWebhookLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingWebhookLogs and only return the `id`
     * const billingWebhookLogWithIdOnly = await prisma.billingWebhookLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingWebhookLogCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingWebhookLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingWebhookLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BillingWebhookLog.
     * @param {BillingWebhookLogDeleteArgs} args - Arguments to delete one BillingWebhookLog.
     * @example
     * // Delete one BillingWebhookLog
     * const BillingWebhookLog = await prisma.billingWebhookLog.delete({
     *   where: {
     *     // ... filter to delete one BillingWebhookLog
     *   }
     * })
     * 
     */
    delete<T extends BillingWebhookLogDeleteArgs>(args: SelectSubset<T, BillingWebhookLogDeleteArgs<ExtArgs>>): Prisma__BillingWebhookLogClient<$Result.GetResult<Prisma.$BillingWebhookLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BillingWebhookLog.
     * @param {BillingWebhookLogUpdateArgs} args - Arguments to update one BillingWebhookLog.
     * @example
     * // Update one BillingWebhookLog
     * const billingWebhookLog = await prisma.billingWebhookLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingWebhookLogUpdateArgs>(args: SelectSubset<T, BillingWebhookLogUpdateArgs<ExtArgs>>): Prisma__BillingWebhookLogClient<$Result.GetResult<Prisma.$BillingWebhookLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BillingWebhookLogs.
     * @param {BillingWebhookLogDeleteManyArgs} args - Arguments to filter BillingWebhookLogs to delete.
     * @example
     * // Delete a few BillingWebhookLogs
     * const { count } = await prisma.billingWebhookLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingWebhookLogDeleteManyArgs>(args?: SelectSubset<T, BillingWebhookLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingWebhookLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingWebhookLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingWebhookLogs
     * const billingWebhookLog = await prisma.billingWebhookLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingWebhookLogUpdateManyArgs>(args: SelectSubset<T, BillingWebhookLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BillingWebhookLog.
     * @param {BillingWebhookLogUpsertArgs} args - Arguments to update or create a BillingWebhookLog.
     * @example
     * // Update or create a BillingWebhookLog
     * const billingWebhookLog = await prisma.billingWebhookLog.upsert({
     *   create: {
     *     // ... data to create a BillingWebhookLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingWebhookLog we want to update
     *   }
     * })
     */
    upsert<T extends BillingWebhookLogUpsertArgs>(args: SelectSubset<T, BillingWebhookLogUpsertArgs<ExtArgs>>): Prisma__BillingWebhookLogClient<$Result.GetResult<Prisma.$BillingWebhookLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BillingWebhookLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingWebhookLogCountArgs} args - Arguments to filter BillingWebhookLogs to count.
     * @example
     * // Count the number of BillingWebhookLogs
     * const count = await prisma.billingWebhookLog.count({
     *   where: {
     *     // ... the filter for the BillingWebhookLogs we want to count
     *   }
     * })
    **/
    count<T extends BillingWebhookLogCountArgs>(
      args?: Subset<T, BillingWebhookLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingWebhookLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingWebhookLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingWebhookLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BillingWebhookLogAggregateArgs>(args: Subset<T, BillingWebhookLogAggregateArgs>): Prisma.PrismaPromise<GetBillingWebhookLogAggregateType<T>>

    /**
     * Group by BillingWebhookLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingWebhookLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BillingWebhookLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingWebhookLogGroupByArgs['orderBy'] }
        : { orderBy?: BillingWebhookLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BillingWebhookLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingWebhookLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingWebhookLog model
   */
  readonly fields: BillingWebhookLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingWebhookLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingWebhookLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BillingWebhookLog model
   */ 
  interface BillingWebhookLogFieldRefs {
    readonly id: FieldRef<"BillingWebhookLog", 'String'>
    readonly event: FieldRef<"BillingWebhookLog", 'String'>
    readonly payload: FieldRef<"BillingWebhookLog", 'Json'>
    readonly processed: FieldRef<"BillingWebhookLog", 'Boolean'>
    readonly error: FieldRef<"BillingWebhookLog", 'String'>
    readonly createdAt: FieldRef<"BillingWebhookLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingWebhookLog findUnique
   */
  export type BillingWebhookLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingWebhookLog
     */
    select?: BillingWebhookLogSelect<ExtArgs> | null
    /**
     * Filter, which BillingWebhookLog to fetch.
     */
    where: BillingWebhookLogWhereUniqueInput
  }

  /**
   * BillingWebhookLog findUniqueOrThrow
   */
  export type BillingWebhookLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingWebhookLog
     */
    select?: BillingWebhookLogSelect<ExtArgs> | null
    /**
     * Filter, which BillingWebhookLog to fetch.
     */
    where: BillingWebhookLogWhereUniqueInput
  }

  /**
   * BillingWebhookLog findFirst
   */
  export type BillingWebhookLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingWebhookLog
     */
    select?: BillingWebhookLogSelect<ExtArgs> | null
    /**
     * Filter, which BillingWebhookLog to fetch.
     */
    where?: BillingWebhookLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingWebhookLogs to fetch.
     */
    orderBy?: BillingWebhookLogOrderByWithRelationInput | BillingWebhookLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingWebhookLogs.
     */
    cursor?: BillingWebhookLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingWebhookLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingWebhookLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingWebhookLogs.
     */
    distinct?: BillingWebhookLogScalarFieldEnum | BillingWebhookLogScalarFieldEnum[]
  }

  /**
   * BillingWebhookLog findFirstOrThrow
   */
  export type BillingWebhookLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingWebhookLog
     */
    select?: BillingWebhookLogSelect<ExtArgs> | null
    /**
     * Filter, which BillingWebhookLog to fetch.
     */
    where?: BillingWebhookLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingWebhookLogs to fetch.
     */
    orderBy?: BillingWebhookLogOrderByWithRelationInput | BillingWebhookLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingWebhookLogs.
     */
    cursor?: BillingWebhookLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingWebhookLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingWebhookLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingWebhookLogs.
     */
    distinct?: BillingWebhookLogScalarFieldEnum | BillingWebhookLogScalarFieldEnum[]
  }

  /**
   * BillingWebhookLog findMany
   */
  export type BillingWebhookLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingWebhookLog
     */
    select?: BillingWebhookLogSelect<ExtArgs> | null
    /**
     * Filter, which BillingWebhookLogs to fetch.
     */
    where?: BillingWebhookLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingWebhookLogs to fetch.
     */
    orderBy?: BillingWebhookLogOrderByWithRelationInput | BillingWebhookLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingWebhookLogs.
     */
    cursor?: BillingWebhookLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingWebhookLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingWebhookLogs.
     */
    skip?: number
    distinct?: BillingWebhookLogScalarFieldEnum | BillingWebhookLogScalarFieldEnum[]
  }

  /**
   * BillingWebhookLog create
   */
  export type BillingWebhookLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingWebhookLog
     */
    select?: BillingWebhookLogSelect<ExtArgs> | null
    /**
     * The data needed to create a BillingWebhookLog.
     */
    data: XOR<BillingWebhookLogCreateInput, BillingWebhookLogUncheckedCreateInput>
  }

  /**
   * BillingWebhookLog createMany
   */
  export type BillingWebhookLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingWebhookLogs.
     */
    data: BillingWebhookLogCreateManyInput | BillingWebhookLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingWebhookLog createManyAndReturn
   */
  export type BillingWebhookLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingWebhookLog
     */
    select?: BillingWebhookLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BillingWebhookLogs.
     */
    data: BillingWebhookLogCreateManyInput | BillingWebhookLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingWebhookLog update
   */
  export type BillingWebhookLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingWebhookLog
     */
    select?: BillingWebhookLogSelect<ExtArgs> | null
    /**
     * The data needed to update a BillingWebhookLog.
     */
    data: XOR<BillingWebhookLogUpdateInput, BillingWebhookLogUncheckedUpdateInput>
    /**
     * Choose, which BillingWebhookLog to update.
     */
    where: BillingWebhookLogWhereUniqueInput
  }

  /**
   * BillingWebhookLog updateMany
   */
  export type BillingWebhookLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingWebhookLogs.
     */
    data: XOR<BillingWebhookLogUpdateManyMutationInput, BillingWebhookLogUncheckedUpdateManyInput>
    /**
     * Filter which BillingWebhookLogs to update
     */
    where?: BillingWebhookLogWhereInput
  }

  /**
   * BillingWebhookLog upsert
   */
  export type BillingWebhookLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingWebhookLog
     */
    select?: BillingWebhookLogSelect<ExtArgs> | null
    /**
     * The filter to search for the BillingWebhookLog to update in case it exists.
     */
    where: BillingWebhookLogWhereUniqueInput
    /**
     * In case the BillingWebhookLog found by the `where` argument doesn't exist, create a new BillingWebhookLog with this data.
     */
    create: XOR<BillingWebhookLogCreateInput, BillingWebhookLogUncheckedCreateInput>
    /**
     * In case the BillingWebhookLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingWebhookLogUpdateInput, BillingWebhookLogUncheckedUpdateInput>
  }

  /**
   * BillingWebhookLog delete
   */
  export type BillingWebhookLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingWebhookLog
     */
    select?: BillingWebhookLogSelect<ExtArgs> | null
    /**
     * Filter which BillingWebhookLog to delete.
     */
    where: BillingWebhookLogWhereUniqueInput
  }

  /**
   * BillingWebhookLog deleteMany
   */
  export type BillingWebhookLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingWebhookLogs to delete
     */
    where?: BillingWebhookLogWhereInput
  }

  /**
   * BillingWebhookLog without action
   */
  export type BillingWebhookLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingWebhookLog
     */
    select?: BillingWebhookLogSelect<ExtArgs> | null
  }


  /**
   * Model AdminNotification
   */

  export type AggregateAdminNotification = {
    _count: AdminNotificationCountAggregateOutputType | null
    _min: AdminNotificationMinAggregateOutputType | null
    _max: AdminNotificationMaxAggregateOutputType | null
  }

  export type AdminNotificationMinAggregateOutputType = {
    id: string | null
    type: $Enums.AdminNotificationType | null
    title: string | null
    message: string | null
    companyId: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type AdminNotificationMaxAggregateOutputType = {
    id: string | null
    type: $Enums.AdminNotificationType | null
    title: string | null
    message: string | null
    companyId: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type AdminNotificationCountAggregateOutputType = {
    id: number
    type: number
    title: number
    message: number
    companyId: number
    metadata: number
    isRead: number
    createdAt: number
    _all: number
  }


  export type AdminNotificationMinAggregateInputType = {
    id?: true
    type?: true
    title?: true
    message?: true
    companyId?: true
    isRead?: true
    createdAt?: true
  }

  export type AdminNotificationMaxAggregateInputType = {
    id?: true
    type?: true
    title?: true
    message?: true
    companyId?: true
    isRead?: true
    createdAt?: true
  }

  export type AdminNotificationCountAggregateInputType = {
    id?: true
    type?: true
    title?: true
    message?: true
    companyId?: true
    metadata?: true
    isRead?: true
    createdAt?: true
    _all?: true
  }

  export type AdminNotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminNotification to aggregate.
     */
    where?: AdminNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminNotifications to fetch.
     */
    orderBy?: AdminNotificationOrderByWithRelationInput | AdminNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminNotifications
    **/
    _count?: true | AdminNotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminNotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminNotificationMaxAggregateInputType
  }

  export type GetAdminNotificationAggregateType<T extends AdminNotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminNotification[P]>
      : GetScalarType<T[P], AggregateAdminNotification[P]>
  }




  export type AdminNotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminNotificationWhereInput
    orderBy?: AdminNotificationOrderByWithAggregationInput | AdminNotificationOrderByWithAggregationInput[]
    by: AdminNotificationScalarFieldEnum[] | AdminNotificationScalarFieldEnum
    having?: AdminNotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminNotificationCountAggregateInputType | true
    _min?: AdminNotificationMinAggregateInputType
    _max?: AdminNotificationMaxAggregateInputType
  }

  export type AdminNotificationGroupByOutputType = {
    id: string
    type: $Enums.AdminNotificationType
    title: string
    message: string
    companyId: string | null
    metadata: JsonValue | null
    isRead: boolean
    createdAt: Date
    _count: AdminNotificationCountAggregateOutputType | null
    _min: AdminNotificationMinAggregateOutputType | null
    _max: AdminNotificationMaxAggregateOutputType | null
  }

  type GetAdminNotificationGroupByPayload<T extends AdminNotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminNotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminNotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminNotificationGroupByOutputType[P]>
            : GetScalarType<T[P], AdminNotificationGroupByOutputType[P]>
        }
      >
    >


  export type AdminNotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    companyId?: boolean
    metadata?: boolean
    isRead?: boolean
    createdAt?: boolean
    company?: boolean | AdminNotification$companyArgs<ExtArgs>
  }, ExtArgs["result"]["adminNotification"]>

  export type AdminNotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    companyId?: boolean
    metadata?: boolean
    isRead?: boolean
    createdAt?: boolean
    company?: boolean | AdminNotification$companyArgs<ExtArgs>
  }, ExtArgs["result"]["adminNotification"]>

  export type AdminNotificationSelectScalar = {
    id?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    companyId?: boolean
    metadata?: boolean
    isRead?: boolean
    createdAt?: boolean
  }

  export type AdminNotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | AdminNotification$companyArgs<ExtArgs>
  }
  export type AdminNotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | AdminNotification$companyArgs<ExtArgs>
  }

  export type $AdminNotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminNotification"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.AdminNotificationType
      title: string
      message: string
      companyId: string | null
      metadata: Prisma.JsonValue | null
      isRead: boolean
      createdAt: Date
    }, ExtArgs["result"]["adminNotification"]>
    composites: {}
  }

  type AdminNotificationGetPayload<S extends boolean | null | undefined | AdminNotificationDefaultArgs> = $Result.GetResult<Prisma.$AdminNotificationPayload, S>

  type AdminNotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AdminNotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AdminNotificationCountAggregateInputType | true
    }

  export interface AdminNotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminNotification'], meta: { name: 'AdminNotification' } }
    /**
     * Find zero or one AdminNotification that matches the filter.
     * @param {AdminNotificationFindUniqueArgs} args - Arguments to find a AdminNotification
     * @example
     * // Get one AdminNotification
     * const adminNotification = await prisma.adminNotification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminNotificationFindUniqueArgs>(args: SelectSubset<T, AdminNotificationFindUniqueArgs<ExtArgs>>): Prisma__AdminNotificationClient<$Result.GetResult<Prisma.$AdminNotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AdminNotification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AdminNotificationFindUniqueOrThrowArgs} args - Arguments to find a AdminNotification
     * @example
     * // Get one AdminNotification
     * const adminNotification = await prisma.adminNotification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminNotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminNotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminNotificationClient<$Result.GetResult<Prisma.$AdminNotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AdminNotification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminNotificationFindFirstArgs} args - Arguments to find a AdminNotification
     * @example
     * // Get one AdminNotification
     * const adminNotification = await prisma.adminNotification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminNotificationFindFirstArgs>(args?: SelectSubset<T, AdminNotificationFindFirstArgs<ExtArgs>>): Prisma__AdminNotificationClient<$Result.GetResult<Prisma.$AdminNotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AdminNotification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminNotificationFindFirstOrThrowArgs} args - Arguments to find a AdminNotification
     * @example
     * // Get one AdminNotification
     * const adminNotification = await prisma.adminNotification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminNotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminNotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminNotificationClient<$Result.GetResult<Prisma.$AdminNotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AdminNotifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminNotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminNotifications
     * const adminNotifications = await prisma.adminNotification.findMany()
     * 
     * // Get first 10 AdminNotifications
     * const adminNotifications = await prisma.adminNotification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminNotificationWithIdOnly = await prisma.adminNotification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminNotificationFindManyArgs>(args?: SelectSubset<T, AdminNotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminNotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AdminNotification.
     * @param {AdminNotificationCreateArgs} args - Arguments to create a AdminNotification.
     * @example
     * // Create one AdminNotification
     * const AdminNotification = await prisma.adminNotification.create({
     *   data: {
     *     // ... data to create a AdminNotification
     *   }
     * })
     * 
     */
    create<T extends AdminNotificationCreateArgs>(args: SelectSubset<T, AdminNotificationCreateArgs<ExtArgs>>): Prisma__AdminNotificationClient<$Result.GetResult<Prisma.$AdminNotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AdminNotifications.
     * @param {AdminNotificationCreateManyArgs} args - Arguments to create many AdminNotifications.
     * @example
     * // Create many AdminNotifications
     * const adminNotification = await prisma.adminNotification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminNotificationCreateManyArgs>(args?: SelectSubset<T, AdminNotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdminNotifications and returns the data saved in the database.
     * @param {AdminNotificationCreateManyAndReturnArgs} args - Arguments to create many AdminNotifications.
     * @example
     * // Create many AdminNotifications
     * const adminNotification = await prisma.adminNotification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdminNotifications and only return the `id`
     * const adminNotificationWithIdOnly = await prisma.adminNotification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminNotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminNotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminNotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AdminNotification.
     * @param {AdminNotificationDeleteArgs} args - Arguments to delete one AdminNotification.
     * @example
     * // Delete one AdminNotification
     * const AdminNotification = await prisma.adminNotification.delete({
     *   where: {
     *     // ... filter to delete one AdminNotification
     *   }
     * })
     * 
     */
    delete<T extends AdminNotificationDeleteArgs>(args: SelectSubset<T, AdminNotificationDeleteArgs<ExtArgs>>): Prisma__AdminNotificationClient<$Result.GetResult<Prisma.$AdminNotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AdminNotification.
     * @param {AdminNotificationUpdateArgs} args - Arguments to update one AdminNotification.
     * @example
     * // Update one AdminNotification
     * const adminNotification = await prisma.adminNotification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminNotificationUpdateArgs>(args: SelectSubset<T, AdminNotificationUpdateArgs<ExtArgs>>): Prisma__AdminNotificationClient<$Result.GetResult<Prisma.$AdminNotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AdminNotifications.
     * @param {AdminNotificationDeleteManyArgs} args - Arguments to filter AdminNotifications to delete.
     * @example
     * // Delete a few AdminNotifications
     * const { count } = await prisma.adminNotification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminNotificationDeleteManyArgs>(args?: SelectSubset<T, AdminNotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminNotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminNotifications
     * const adminNotification = await prisma.adminNotification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminNotificationUpdateManyArgs>(args: SelectSubset<T, AdminNotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AdminNotification.
     * @param {AdminNotificationUpsertArgs} args - Arguments to update or create a AdminNotification.
     * @example
     * // Update or create a AdminNotification
     * const adminNotification = await prisma.adminNotification.upsert({
     *   create: {
     *     // ... data to create a AdminNotification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminNotification we want to update
     *   }
     * })
     */
    upsert<T extends AdminNotificationUpsertArgs>(args: SelectSubset<T, AdminNotificationUpsertArgs<ExtArgs>>): Prisma__AdminNotificationClient<$Result.GetResult<Prisma.$AdminNotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AdminNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminNotificationCountArgs} args - Arguments to filter AdminNotifications to count.
     * @example
     * // Count the number of AdminNotifications
     * const count = await prisma.adminNotification.count({
     *   where: {
     *     // ... the filter for the AdminNotifications we want to count
     *   }
     * })
    **/
    count<T extends AdminNotificationCountArgs>(
      args?: Subset<T, AdminNotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminNotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminNotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminNotificationAggregateArgs>(args: Subset<T, AdminNotificationAggregateArgs>): Prisma.PrismaPromise<GetAdminNotificationAggregateType<T>>

    /**
     * Group by AdminNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminNotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminNotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminNotificationGroupByArgs['orderBy'] }
        : { orderBy?: AdminNotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminNotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminNotification model
   */
  readonly fields: AdminNotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminNotification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminNotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends AdminNotification$companyArgs<ExtArgs> = {}>(args?: Subset<T, AdminNotification$companyArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminNotification model
   */ 
  interface AdminNotificationFieldRefs {
    readonly id: FieldRef<"AdminNotification", 'String'>
    readonly type: FieldRef<"AdminNotification", 'AdminNotificationType'>
    readonly title: FieldRef<"AdminNotification", 'String'>
    readonly message: FieldRef<"AdminNotification", 'String'>
    readonly companyId: FieldRef<"AdminNotification", 'String'>
    readonly metadata: FieldRef<"AdminNotification", 'Json'>
    readonly isRead: FieldRef<"AdminNotification", 'Boolean'>
    readonly createdAt: FieldRef<"AdminNotification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminNotification findUnique
   */
  export type AdminNotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationInclude<ExtArgs> | null
    /**
     * Filter, which AdminNotification to fetch.
     */
    where: AdminNotificationWhereUniqueInput
  }

  /**
   * AdminNotification findUniqueOrThrow
   */
  export type AdminNotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationInclude<ExtArgs> | null
    /**
     * Filter, which AdminNotification to fetch.
     */
    where: AdminNotificationWhereUniqueInput
  }

  /**
   * AdminNotification findFirst
   */
  export type AdminNotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationInclude<ExtArgs> | null
    /**
     * Filter, which AdminNotification to fetch.
     */
    where?: AdminNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminNotifications to fetch.
     */
    orderBy?: AdminNotificationOrderByWithRelationInput | AdminNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminNotifications.
     */
    cursor?: AdminNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminNotifications.
     */
    distinct?: AdminNotificationScalarFieldEnum | AdminNotificationScalarFieldEnum[]
  }

  /**
   * AdminNotification findFirstOrThrow
   */
  export type AdminNotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationInclude<ExtArgs> | null
    /**
     * Filter, which AdminNotification to fetch.
     */
    where?: AdminNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminNotifications to fetch.
     */
    orderBy?: AdminNotificationOrderByWithRelationInput | AdminNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminNotifications.
     */
    cursor?: AdminNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminNotifications.
     */
    distinct?: AdminNotificationScalarFieldEnum | AdminNotificationScalarFieldEnum[]
  }

  /**
   * AdminNotification findMany
   */
  export type AdminNotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationInclude<ExtArgs> | null
    /**
     * Filter, which AdminNotifications to fetch.
     */
    where?: AdminNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminNotifications to fetch.
     */
    orderBy?: AdminNotificationOrderByWithRelationInput | AdminNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminNotifications.
     */
    cursor?: AdminNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminNotifications.
     */
    skip?: number
    distinct?: AdminNotificationScalarFieldEnum | AdminNotificationScalarFieldEnum[]
  }

  /**
   * AdminNotification create
   */
  export type AdminNotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a AdminNotification.
     */
    data: XOR<AdminNotificationCreateInput, AdminNotificationUncheckedCreateInput>
  }

  /**
   * AdminNotification createMany
   */
  export type AdminNotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminNotifications.
     */
    data: AdminNotificationCreateManyInput | AdminNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminNotification createManyAndReturn
   */
  export type AdminNotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AdminNotifications.
     */
    data: AdminNotificationCreateManyInput | AdminNotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AdminNotification update
   */
  export type AdminNotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a AdminNotification.
     */
    data: XOR<AdminNotificationUpdateInput, AdminNotificationUncheckedUpdateInput>
    /**
     * Choose, which AdminNotification to update.
     */
    where: AdminNotificationWhereUniqueInput
  }

  /**
   * AdminNotification updateMany
   */
  export type AdminNotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminNotifications.
     */
    data: XOR<AdminNotificationUpdateManyMutationInput, AdminNotificationUncheckedUpdateManyInput>
    /**
     * Filter which AdminNotifications to update
     */
    where?: AdminNotificationWhereInput
  }

  /**
   * AdminNotification upsert
   */
  export type AdminNotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the AdminNotification to update in case it exists.
     */
    where: AdminNotificationWhereUniqueInput
    /**
     * In case the AdminNotification found by the `where` argument doesn't exist, create a new AdminNotification with this data.
     */
    create: XOR<AdminNotificationCreateInput, AdminNotificationUncheckedCreateInput>
    /**
     * In case the AdminNotification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminNotificationUpdateInput, AdminNotificationUncheckedUpdateInput>
  }

  /**
   * AdminNotification delete
   */
  export type AdminNotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationInclude<ExtArgs> | null
    /**
     * Filter which AdminNotification to delete.
     */
    where: AdminNotificationWhereUniqueInput
  }

  /**
   * AdminNotification deleteMany
   */
  export type AdminNotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminNotifications to delete
     */
    where?: AdminNotificationWhereInput
  }

  /**
   * AdminNotification.company
   */
  export type AdminNotification$companyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    where?: CompanyWhereInput
  }

  /**
   * AdminNotification without action
   */
  export type AdminNotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminNotification
     */
    select?: AdminNotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminNotificationInclude<ExtArgs> | null
  }


  /**
   * Model MasterAuditLog
   */

  export type AggregateMasterAuditLog = {
    _count: MasterAuditLogCountAggregateOutputType | null
    _min: MasterAuditLogMinAggregateOutputType | null
    _max: MasterAuditLogMaxAggregateOutputType | null
  }

  export type MasterAuditLogMinAggregateOutputType = {
    id: string | null
    companyId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    userId: string | null
    userEmail: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type MasterAuditLogMaxAggregateOutputType = {
    id: string | null
    companyId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    userId: string | null
    userEmail: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type MasterAuditLogCountAggregateOutputType = {
    id: number
    companyId: number
    action: number
    entityType: number
    entityId: number
    userId: number
    userEmail: number
    ipAddress: number
    userAgent: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type MasterAuditLogMinAggregateInputType = {
    id?: true
    companyId?: true
    action?: true
    entityType?: true
    entityId?: true
    userId?: true
    userEmail?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type MasterAuditLogMaxAggregateInputType = {
    id?: true
    companyId?: true
    action?: true
    entityType?: true
    entityId?: true
    userId?: true
    userEmail?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type MasterAuditLogCountAggregateInputType = {
    id?: true
    companyId?: true
    action?: true
    entityType?: true
    entityId?: true
    userId?: true
    userEmail?: true
    ipAddress?: true
    userAgent?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type MasterAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MasterAuditLog to aggregate.
     */
    where?: MasterAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterAuditLogs to fetch.
     */
    orderBy?: MasterAuditLogOrderByWithRelationInput | MasterAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MasterAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MasterAuditLogs
    **/
    _count?: true | MasterAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MasterAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MasterAuditLogMaxAggregateInputType
  }

  export type GetMasterAuditLogAggregateType<T extends MasterAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateMasterAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMasterAuditLog[P]>
      : GetScalarType<T[P], AggregateMasterAuditLog[P]>
  }




  export type MasterAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MasterAuditLogWhereInput
    orderBy?: MasterAuditLogOrderByWithAggregationInput | MasterAuditLogOrderByWithAggregationInput[]
    by: MasterAuditLogScalarFieldEnum[] | MasterAuditLogScalarFieldEnum
    having?: MasterAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MasterAuditLogCountAggregateInputType | true
    _min?: MasterAuditLogMinAggregateInputType
    _max?: MasterAuditLogMaxAggregateInputType
  }

  export type MasterAuditLogGroupByOutputType = {
    id: string
    companyId: string | null
    action: string
    entityType: string
    entityId: string | null
    userId: string | null
    userEmail: string | null
    ipAddress: string | null
    userAgent: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: MasterAuditLogCountAggregateOutputType | null
    _min: MasterAuditLogMinAggregateOutputType | null
    _max: MasterAuditLogMaxAggregateOutputType | null
  }

  type GetMasterAuditLogGroupByPayload<T extends MasterAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MasterAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MasterAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MasterAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], MasterAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type MasterAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    userId?: boolean
    userEmail?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    metadata?: boolean
    createdAt?: boolean
    company?: boolean | MasterAuditLog$companyArgs<ExtArgs>
  }, ExtArgs["result"]["masterAuditLog"]>

  export type MasterAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    userId?: boolean
    userEmail?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    metadata?: boolean
    createdAt?: boolean
    company?: boolean | MasterAuditLog$companyArgs<ExtArgs>
  }, ExtArgs["result"]["masterAuditLog"]>

  export type MasterAuditLogSelectScalar = {
    id?: boolean
    companyId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    userId?: boolean
    userEmail?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type MasterAuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | MasterAuditLog$companyArgs<ExtArgs>
  }
  export type MasterAuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | MasterAuditLog$companyArgs<ExtArgs>
  }

  export type $MasterAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MasterAuditLog"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyId: string | null
      action: string
      entityType: string
      entityId: string | null
      userId: string | null
      userEmail: string | null
      ipAddress: string | null
      userAgent: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["masterAuditLog"]>
    composites: {}
  }

  type MasterAuditLogGetPayload<S extends boolean | null | undefined | MasterAuditLogDefaultArgs> = $Result.GetResult<Prisma.$MasterAuditLogPayload, S>

  type MasterAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MasterAuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MasterAuditLogCountAggregateInputType | true
    }

  export interface MasterAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MasterAuditLog'], meta: { name: 'MasterAuditLog' } }
    /**
     * Find zero or one MasterAuditLog that matches the filter.
     * @param {MasterAuditLogFindUniqueArgs} args - Arguments to find a MasterAuditLog
     * @example
     * // Get one MasterAuditLog
     * const masterAuditLog = await prisma.masterAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MasterAuditLogFindUniqueArgs>(args: SelectSubset<T, MasterAuditLogFindUniqueArgs<ExtArgs>>): Prisma__MasterAuditLogClient<$Result.GetResult<Prisma.$MasterAuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MasterAuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MasterAuditLogFindUniqueOrThrowArgs} args - Arguments to find a MasterAuditLog
     * @example
     * // Get one MasterAuditLog
     * const masterAuditLog = await prisma.masterAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MasterAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, MasterAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MasterAuditLogClient<$Result.GetResult<Prisma.$MasterAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MasterAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterAuditLogFindFirstArgs} args - Arguments to find a MasterAuditLog
     * @example
     * // Get one MasterAuditLog
     * const masterAuditLog = await prisma.masterAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MasterAuditLogFindFirstArgs>(args?: SelectSubset<T, MasterAuditLogFindFirstArgs<ExtArgs>>): Prisma__MasterAuditLogClient<$Result.GetResult<Prisma.$MasterAuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MasterAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterAuditLogFindFirstOrThrowArgs} args - Arguments to find a MasterAuditLog
     * @example
     * // Get one MasterAuditLog
     * const masterAuditLog = await prisma.masterAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MasterAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, MasterAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__MasterAuditLogClient<$Result.GetResult<Prisma.$MasterAuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MasterAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MasterAuditLogs
     * const masterAuditLogs = await prisma.masterAuditLog.findMany()
     * 
     * // Get first 10 MasterAuditLogs
     * const masterAuditLogs = await prisma.masterAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const masterAuditLogWithIdOnly = await prisma.masterAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MasterAuditLogFindManyArgs>(args?: SelectSubset<T, MasterAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MasterAuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MasterAuditLog.
     * @param {MasterAuditLogCreateArgs} args - Arguments to create a MasterAuditLog.
     * @example
     * // Create one MasterAuditLog
     * const MasterAuditLog = await prisma.masterAuditLog.create({
     *   data: {
     *     // ... data to create a MasterAuditLog
     *   }
     * })
     * 
     */
    create<T extends MasterAuditLogCreateArgs>(args: SelectSubset<T, MasterAuditLogCreateArgs<ExtArgs>>): Prisma__MasterAuditLogClient<$Result.GetResult<Prisma.$MasterAuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MasterAuditLogs.
     * @param {MasterAuditLogCreateManyArgs} args - Arguments to create many MasterAuditLogs.
     * @example
     * // Create many MasterAuditLogs
     * const masterAuditLog = await prisma.masterAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MasterAuditLogCreateManyArgs>(args?: SelectSubset<T, MasterAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MasterAuditLogs and returns the data saved in the database.
     * @param {MasterAuditLogCreateManyAndReturnArgs} args - Arguments to create many MasterAuditLogs.
     * @example
     * // Create many MasterAuditLogs
     * const masterAuditLog = await prisma.masterAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MasterAuditLogs and only return the `id`
     * const masterAuditLogWithIdOnly = await prisma.masterAuditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MasterAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, MasterAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MasterAuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MasterAuditLog.
     * @param {MasterAuditLogDeleteArgs} args - Arguments to delete one MasterAuditLog.
     * @example
     * // Delete one MasterAuditLog
     * const MasterAuditLog = await prisma.masterAuditLog.delete({
     *   where: {
     *     // ... filter to delete one MasterAuditLog
     *   }
     * })
     * 
     */
    delete<T extends MasterAuditLogDeleteArgs>(args: SelectSubset<T, MasterAuditLogDeleteArgs<ExtArgs>>): Prisma__MasterAuditLogClient<$Result.GetResult<Prisma.$MasterAuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MasterAuditLog.
     * @param {MasterAuditLogUpdateArgs} args - Arguments to update one MasterAuditLog.
     * @example
     * // Update one MasterAuditLog
     * const masterAuditLog = await prisma.masterAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MasterAuditLogUpdateArgs>(args: SelectSubset<T, MasterAuditLogUpdateArgs<ExtArgs>>): Prisma__MasterAuditLogClient<$Result.GetResult<Prisma.$MasterAuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MasterAuditLogs.
     * @param {MasterAuditLogDeleteManyArgs} args - Arguments to filter MasterAuditLogs to delete.
     * @example
     * // Delete a few MasterAuditLogs
     * const { count } = await prisma.masterAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MasterAuditLogDeleteManyArgs>(args?: SelectSubset<T, MasterAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MasterAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MasterAuditLogs
     * const masterAuditLog = await prisma.masterAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MasterAuditLogUpdateManyArgs>(args: SelectSubset<T, MasterAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MasterAuditLog.
     * @param {MasterAuditLogUpsertArgs} args - Arguments to update or create a MasterAuditLog.
     * @example
     * // Update or create a MasterAuditLog
     * const masterAuditLog = await prisma.masterAuditLog.upsert({
     *   create: {
     *     // ... data to create a MasterAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MasterAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends MasterAuditLogUpsertArgs>(args: SelectSubset<T, MasterAuditLogUpsertArgs<ExtArgs>>): Prisma__MasterAuditLogClient<$Result.GetResult<Prisma.$MasterAuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MasterAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterAuditLogCountArgs} args - Arguments to filter MasterAuditLogs to count.
     * @example
     * // Count the number of MasterAuditLogs
     * const count = await prisma.masterAuditLog.count({
     *   where: {
     *     // ... the filter for the MasterAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends MasterAuditLogCountArgs>(
      args?: Subset<T, MasterAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MasterAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MasterAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MasterAuditLogAggregateArgs>(args: Subset<T, MasterAuditLogAggregateArgs>): Prisma.PrismaPromise<GetMasterAuditLogAggregateType<T>>

    /**
     * Group by MasterAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterAuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MasterAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MasterAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: MasterAuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MasterAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMasterAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MasterAuditLog model
   */
  readonly fields: MasterAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MasterAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MasterAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends MasterAuditLog$companyArgs<ExtArgs> = {}>(args?: Subset<T, MasterAuditLog$companyArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MasterAuditLog model
   */ 
  interface MasterAuditLogFieldRefs {
    readonly id: FieldRef<"MasterAuditLog", 'String'>
    readonly companyId: FieldRef<"MasterAuditLog", 'String'>
    readonly action: FieldRef<"MasterAuditLog", 'String'>
    readonly entityType: FieldRef<"MasterAuditLog", 'String'>
    readonly entityId: FieldRef<"MasterAuditLog", 'String'>
    readonly userId: FieldRef<"MasterAuditLog", 'String'>
    readonly userEmail: FieldRef<"MasterAuditLog", 'String'>
    readonly ipAddress: FieldRef<"MasterAuditLog", 'String'>
    readonly userAgent: FieldRef<"MasterAuditLog", 'String'>
    readonly metadata: FieldRef<"MasterAuditLog", 'Json'>
    readonly createdAt: FieldRef<"MasterAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MasterAuditLog findUnique
   */
  export type MasterAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which MasterAuditLog to fetch.
     */
    where: MasterAuditLogWhereUniqueInput
  }

  /**
   * MasterAuditLog findUniqueOrThrow
   */
  export type MasterAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which MasterAuditLog to fetch.
     */
    where: MasterAuditLogWhereUniqueInput
  }

  /**
   * MasterAuditLog findFirst
   */
  export type MasterAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which MasterAuditLog to fetch.
     */
    where?: MasterAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterAuditLogs to fetch.
     */
    orderBy?: MasterAuditLogOrderByWithRelationInput | MasterAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MasterAuditLogs.
     */
    cursor?: MasterAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MasterAuditLogs.
     */
    distinct?: MasterAuditLogScalarFieldEnum | MasterAuditLogScalarFieldEnum[]
  }

  /**
   * MasterAuditLog findFirstOrThrow
   */
  export type MasterAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which MasterAuditLog to fetch.
     */
    where?: MasterAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterAuditLogs to fetch.
     */
    orderBy?: MasterAuditLogOrderByWithRelationInput | MasterAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MasterAuditLogs.
     */
    cursor?: MasterAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MasterAuditLogs.
     */
    distinct?: MasterAuditLogScalarFieldEnum | MasterAuditLogScalarFieldEnum[]
  }

  /**
   * MasterAuditLog findMany
   */
  export type MasterAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which MasterAuditLogs to fetch.
     */
    where?: MasterAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterAuditLogs to fetch.
     */
    orderBy?: MasterAuditLogOrderByWithRelationInput | MasterAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MasterAuditLogs.
     */
    cursor?: MasterAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterAuditLogs.
     */
    skip?: number
    distinct?: MasterAuditLogScalarFieldEnum | MasterAuditLogScalarFieldEnum[]
  }

  /**
   * MasterAuditLog create
   */
  export type MasterAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a MasterAuditLog.
     */
    data: XOR<MasterAuditLogCreateInput, MasterAuditLogUncheckedCreateInput>
  }

  /**
   * MasterAuditLog createMany
   */
  export type MasterAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MasterAuditLogs.
     */
    data: MasterAuditLogCreateManyInput | MasterAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MasterAuditLog createManyAndReturn
   */
  export type MasterAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MasterAuditLogs.
     */
    data: MasterAuditLogCreateManyInput | MasterAuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MasterAuditLog update
   */
  export type MasterAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a MasterAuditLog.
     */
    data: XOR<MasterAuditLogUpdateInput, MasterAuditLogUncheckedUpdateInput>
    /**
     * Choose, which MasterAuditLog to update.
     */
    where: MasterAuditLogWhereUniqueInput
  }

  /**
   * MasterAuditLog updateMany
   */
  export type MasterAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MasterAuditLogs.
     */
    data: XOR<MasterAuditLogUpdateManyMutationInput, MasterAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which MasterAuditLogs to update
     */
    where?: MasterAuditLogWhereInput
  }

  /**
   * MasterAuditLog upsert
   */
  export type MasterAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the MasterAuditLog to update in case it exists.
     */
    where: MasterAuditLogWhereUniqueInput
    /**
     * In case the MasterAuditLog found by the `where` argument doesn't exist, create a new MasterAuditLog with this data.
     */
    create: XOR<MasterAuditLogCreateInput, MasterAuditLogUncheckedCreateInput>
    /**
     * In case the MasterAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MasterAuditLogUpdateInput, MasterAuditLogUncheckedUpdateInput>
  }

  /**
   * MasterAuditLog delete
   */
  export type MasterAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogInclude<ExtArgs> | null
    /**
     * Filter which MasterAuditLog to delete.
     */
    where: MasterAuditLogWhereUniqueInput
  }

  /**
   * MasterAuditLog deleteMany
   */
  export type MasterAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MasterAuditLogs to delete
     */
    where?: MasterAuditLogWhereInput
  }

  /**
   * MasterAuditLog.company
   */
  export type MasterAuditLog$companyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    where?: CompanyWhereInput
  }

  /**
   * MasterAuditLog without action
   */
  export type MasterAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterAuditLog
     */
    select?: MasterAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MasterAuditLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PlanScalarFieldEnum: {
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

  export type PlanScalarFieldEnum = (typeof PlanScalarFieldEnum)[keyof typeof PlanScalarFieldEnum]


  export const PaymentGatewaySettingsScalarFieldEnum: {
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

  export type PaymentGatewaySettingsScalarFieldEnum = (typeof PaymentGatewaySettingsScalarFieldEnum)[keyof typeof PaymentGatewaySettingsScalarFieldEnum]


  export const CompanyScalarFieldEnum: {
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

  export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    companyId: 'companyId',
    planId: 'planId',
    status: 'status',
    startsAt: 'startsAt',
    endsAt: 'endsAt',
    cancelledAt: 'cancelledAt',
    createdAt: 'createdAt'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const SuperAdminScalarFieldEnum: {
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

  export type SuperAdminScalarFieldEnum = (typeof SuperAdminScalarFieldEnum)[keyof typeof SuperAdminScalarFieldEnum]


  export const BillingCustomerScalarFieldEnum: {
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

  export type BillingCustomerScalarFieldEnum = (typeof BillingCustomerScalarFieldEnum)[keyof typeof BillingCustomerScalarFieldEnum]


  export const BillingSubscriptionScalarFieldEnum: {
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

  export type BillingSubscriptionScalarFieldEnum = (typeof BillingSubscriptionScalarFieldEnum)[keyof typeof BillingSubscriptionScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
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

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const BillingWebhookLogScalarFieldEnum: {
    id: 'id',
    event: 'event',
    payload: 'payload',
    processed: 'processed',
    error: 'error',
    createdAt: 'createdAt'
  };

  export type BillingWebhookLogScalarFieldEnum = (typeof BillingWebhookLogScalarFieldEnum)[keyof typeof BillingWebhookLogScalarFieldEnum]


  export const AdminNotificationScalarFieldEnum: {
    id: 'id',
    type: 'type',
    title: 'title',
    message: 'message',
    companyId: 'companyId',
    metadata: 'metadata',
    isRead: 'isRead',
    createdAt: 'createdAt'
  };

  export type AdminNotificationScalarFieldEnum = (typeof AdminNotificationScalarFieldEnum)[keyof typeof AdminNotificationScalarFieldEnum]


  export const MasterAuditLogScalarFieldEnum: {
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

  export type MasterAuditLogScalarFieldEnum = (typeof MasterAuditLogScalarFieldEnum)[keyof typeof MasterAuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'PlanType'
   */
  export type EnumPlanTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanType'>
    


  /**
   * Reference to a field of type 'PlanType[]'
   */
  export type ListEnumPlanTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'PaymentProvider'
   */
  export type EnumPaymentProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentProvider'>
    


  /**
   * Reference to a field of type 'PaymentProvider[]'
   */
  export type ListEnumPaymentProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentProvider[]'>
    


  /**
   * Reference to a field of type 'PaymentEnvironment'
   */
  export type EnumPaymentEnvironmentFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentEnvironment'>
    


  /**
   * Reference to a field of type 'PaymentEnvironment[]'
   */
  export type ListEnumPaymentEnvironmentFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentEnvironment[]'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus'
   */
  export type EnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus[]'
   */
  export type ListEnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus[]'>
    


  /**
   * Reference to a field of type 'BillingType'
   */
  export type EnumBillingTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingType'>
    


  /**
   * Reference to a field of type 'BillingType[]'
   */
  export type ListEnumBillingTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingType[]'>
    


  /**
   * Reference to a field of type 'BillingCycle'
   */
  export type EnumBillingCycleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingCycle'>
    


  /**
   * Reference to a field of type 'BillingCycle[]'
   */
  export type ListEnumBillingCycleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingCycle[]'>
    


  /**
   * Reference to a field of type 'BillingSubscriptionStatus'
   */
  export type EnumBillingSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingSubscriptionStatus'>
    


  /**
   * Reference to a field of type 'BillingSubscriptionStatus[]'
   */
  export type ListEnumBillingSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingSubscriptionStatus[]'>
    


  /**
   * Reference to a field of type 'InvoiceStatus'
   */
  export type EnumInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvoiceStatus'>
    


  /**
   * Reference to a field of type 'InvoiceStatus[]'
   */
  export type ListEnumInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvoiceStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'AdminNotificationType'
   */
  export type EnumAdminNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AdminNotificationType'>
    


  /**
   * Reference to a field of type 'AdminNotificationType[]'
   */
  export type ListEnumAdminNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AdminNotificationType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PlanWhereInput = {
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    id?: StringFilter<"Plan"> | string
    name?: StringFilter<"Plan"> | string
    type?: EnumPlanTypeFilter<"Plan"> | $Enums.PlanType
    maxVehicles?: IntFilter<"Plan"> | number
    maxDrivers?: IntFilter<"Plan"> | number
    maxUsers?: IntFilter<"Plan"> | number
    maxBranches?: IntFilter<"Plan"> | number
    storageGb?: IntFilter<"Plan"> | number
    priceMonthly?: DecimalFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"Plan"> | boolean
    createdAt?: DateTimeFilter<"Plan"> | Date | string
    companies?: CompanyListRelationFilter
    billingSubscriptions?: BillingSubscriptionListRelationFilter
  }

  export type PlanOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    maxVehicles?: SortOrder
    maxDrivers?: SortOrder
    maxUsers?: SortOrder
    maxBranches?: SortOrder
    storageGb?: SortOrder
    priceMonthly?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    companies?: CompanyOrderByRelationAggregateInput
    billingSubscriptions?: BillingSubscriptionOrderByRelationAggregateInput
  }

  export type PlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    name?: StringFilter<"Plan"> | string
    type?: EnumPlanTypeFilter<"Plan"> | $Enums.PlanType
    maxVehicles?: IntFilter<"Plan"> | number
    maxDrivers?: IntFilter<"Plan"> | number
    maxUsers?: IntFilter<"Plan"> | number
    maxBranches?: IntFilter<"Plan"> | number
    storageGb?: IntFilter<"Plan"> | number
    priceMonthly?: DecimalFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"Plan"> | boolean
    createdAt?: DateTimeFilter<"Plan"> | Date | string
    companies?: CompanyListRelationFilter
    billingSubscriptions?: BillingSubscriptionListRelationFilter
  }, "id">

  export type PlanOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    maxVehicles?: SortOrder
    maxDrivers?: SortOrder
    maxUsers?: SortOrder
    maxBranches?: SortOrder
    storageGb?: SortOrder
    priceMonthly?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    _count?: PlanCountOrderByAggregateInput
    _avg?: PlanAvgOrderByAggregateInput
    _max?: PlanMaxOrderByAggregateInput
    _min?: PlanMinOrderByAggregateInput
    _sum?: PlanSumOrderByAggregateInput
  }

  export type PlanScalarWhereWithAggregatesInput = {
    AND?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    OR?: PlanScalarWhereWithAggregatesInput[]
    NOT?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Plan"> | string
    name?: StringWithAggregatesFilter<"Plan"> | string
    type?: EnumPlanTypeWithAggregatesFilter<"Plan"> | $Enums.PlanType
    maxVehicles?: IntWithAggregatesFilter<"Plan"> | number
    maxDrivers?: IntWithAggregatesFilter<"Plan"> | number
    maxUsers?: IntWithAggregatesFilter<"Plan"> | number
    maxBranches?: IntWithAggregatesFilter<"Plan"> | number
    storageGb?: IntWithAggregatesFilter<"Plan"> | number
    priceMonthly?: DecimalWithAggregatesFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolWithAggregatesFilter<"Plan"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Plan"> | Date | string
  }

  export type PaymentGatewaySettingsWhereInput = {
    AND?: PaymentGatewaySettingsWhereInput | PaymentGatewaySettingsWhereInput[]
    OR?: PaymentGatewaySettingsWhereInput[]
    NOT?: PaymentGatewaySettingsWhereInput | PaymentGatewaySettingsWhereInput[]
    id?: StringFilter<"PaymentGatewaySettings"> | string
    singletonKey?: StringFilter<"PaymentGatewaySettings"> | string
    provider?: EnumPaymentProviderFilter<"PaymentGatewaySettings"> | $Enums.PaymentProvider
    environment?: EnumPaymentEnvironmentFilter<"PaymentGatewaySettings"> | $Enums.PaymentEnvironment
    asaasApiKey?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    asaasWalletId?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    asaasWebhookToken?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    sicoobClientId?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    sicoobClientSecret?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    sicoobCertificateBase64?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    sicoobPixKey?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    isActive?: BoolFilter<"PaymentGatewaySettings"> | boolean
    updatedAt?: DateTimeFilter<"PaymentGatewaySettings"> | Date | string
    createdAt?: DateTimeFilter<"PaymentGatewaySettings"> | Date | string
  }

  export type PaymentGatewaySettingsOrderByWithRelationInput = {
    id?: SortOrder
    singletonKey?: SortOrder
    provider?: SortOrder
    environment?: SortOrder
    asaasApiKey?: SortOrderInput | SortOrder
    asaasWalletId?: SortOrderInput | SortOrder
    asaasWebhookToken?: SortOrderInput | SortOrder
    sicoobClientId?: SortOrderInput | SortOrder
    sicoobClientSecret?: SortOrderInput | SortOrder
    sicoobCertificateBase64?: SortOrderInput | SortOrder
    sicoobPixKey?: SortOrderInput | SortOrder
    isActive?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentGatewaySettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    singletonKey?: string
    AND?: PaymentGatewaySettingsWhereInput | PaymentGatewaySettingsWhereInput[]
    OR?: PaymentGatewaySettingsWhereInput[]
    NOT?: PaymentGatewaySettingsWhereInput | PaymentGatewaySettingsWhereInput[]
    provider?: EnumPaymentProviderFilter<"PaymentGatewaySettings"> | $Enums.PaymentProvider
    environment?: EnumPaymentEnvironmentFilter<"PaymentGatewaySettings"> | $Enums.PaymentEnvironment
    asaasApiKey?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    asaasWalletId?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    asaasWebhookToken?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    sicoobClientId?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    sicoobClientSecret?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    sicoobCertificateBase64?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    sicoobPixKey?: StringNullableFilter<"PaymentGatewaySettings"> | string | null
    isActive?: BoolFilter<"PaymentGatewaySettings"> | boolean
    updatedAt?: DateTimeFilter<"PaymentGatewaySettings"> | Date | string
    createdAt?: DateTimeFilter<"PaymentGatewaySettings"> | Date | string
  }, "id" | "singletonKey">

  export type PaymentGatewaySettingsOrderByWithAggregationInput = {
    id?: SortOrder
    singletonKey?: SortOrder
    provider?: SortOrder
    environment?: SortOrder
    asaasApiKey?: SortOrderInput | SortOrder
    asaasWalletId?: SortOrderInput | SortOrder
    asaasWebhookToken?: SortOrderInput | SortOrder
    sicoobClientId?: SortOrderInput | SortOrder
    sicoobClientSecret?: SortOrderInput | SortOrder
    sicoobCertificateBase64?: SortOrderInput | SortOrder
    sicoobPixKey?: SortOrderInput | SortOrder
    isActive?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: PaymentGatewaySettingsCountOrderByAggregateInput
    _max?: PaymentGatewaySettingsMaxOrderByAggregateInput
    _min?: PaymentGatewaySettingsMinOrderByAggregateInput
  }

  export type PaymentGatewaySettingsScalarWhereWithAggregatesInput = {
    AND?: PaymentGatewaySettingsScalarWhereWithAggregatesInput | PaymentGatewaySettingsScalarWhereWithAggregatesInput[]
    OR?: PaymentGatewaySettingsScalarWhereWithAggregatesInput[]
    NOT?: PaymentGatewaySettingsScalarWhereWithAggregatesInput | PaymentGatewaySettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentGatewaySettings"> | string
    singletonKey?: StringWithAggregatesFilter<"PaymentGatewaySettings"> | string
    provider?: EnumPaymentProviderWithAggregatesFilter<"PaymentGatewaySettings"> | $Enums.PaymentProvider
    environment?: EnumPaymentEnvironmentWithAggregatesFilter<"PaymentGatewaySettings"> | $Enums.PaymentEnvironment
    asaasApiKey?: StringNullableWithAggregatesFilter<"PaymentGatewaySettings"> | string | null
    asaasWalletId?: StringNullableWithAggregatesFilter<"PaymentGatewaySettings"> | string | null
    asaasWebhookToken?: StringNullableWithAggregatesFilter<"PaymentGatewaySettings"> | string | null
    sicoobClientId?: StringNullableWithAggregatesFilter<"PaymentGatewaySettings"> | string | null
    sicoobClientSecret?: StringNullableWithAggregatesFilter<"PaymentGatewaySettings"> | string | null
    sicoobCertificateBase64?: StringNullableWithAggregatesFilter<"PaymentGatewaySettings"> | string | null
    sicoobPixKey?: StringNullableWithAggregatesFilter<"PaymentGatewaySettings"> | string | null
    isActive?: BoolWithAggregatesFilter<"PaymentGatewaySettings"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"PaymentGatewaySettings"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"PaymentGatewaySettings"> | Date | string
  }

  export type CompanyWhereInput = {
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    id?: StringFilter<"Company"> | string
    name?: StringFilter<"Company"> | string
    cnpj?: StringFilter<"Company"> | string
    email?: StringFilter<"Company"> | string
    phone?: StringNullableFilter<"Company"> | string | null
    schemaName?: StringFilter<"Company"> | string
    planId?: StringFilter<"Company"> | string
    isActive?: BoolFilter<"Company"> | boolean
    trialEndsAt?: DateTimeNullableFilter<"Company"> | Date | string | null
    features?: StringNullableListFilter<"Company">
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    plan?: XOR<PlanRelationFilter, PlanWhereInput>
    subscriptions?: SubscriptionListRelationFilter
    auditLogs?: MasterAuditLogListRelationFilter
    billingCustomer?: XOR<BillingCustomerNullableRelationFilter, BillingCustomerWhereInput> | null
    notifications?: AdminNotificationListRelationFilter
  }

  export type CompanyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    cnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    schemaName?: SortOrder
    planId?: SortOrder
    isActive?: SortOrder
    trialEndsAt?: SortOrderInput | SortOrder
    features?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    plan?: PlanOrderByWithRelationInput
    subscriptions?: SubscriptionOrderByRelationAggregateInput
    auditLogs?: MasterAuditLogOrderByRelationAggregateInput
    billingCustomer?: BillingCustomerOrderByWithRelationInput
    notifications?: AdminNotificationOrderByRelationAggregateInput
  }

  export type CompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cnpj?: string
    schemaName?: string
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    name?: StringFilter<"Company"> | string
    email?: StringFilter<"Company"> | string
    phone?: StringNullableFilter<"Company"> | string | null
    planId?: StringFilter<"Company"> | string
    isActive?: BoolFilter<"Company"> | boolean
    trialEndsAt?: DateTimeNullableFilter<"Company"> | Date | string | null
    features?: StringNullableListFilter<"Company">
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    plan?: XOR<PlanRelationFilter, PlanWhereInput>
    subscriptions?: SubscriptionListRelationFilter
    auditLogs?: MasterAuditLogListRelationFilter
    billingCustomer?: XOR<BillingCustomerNullableRelationFilter, BillingCustomerWhereInput> | null
    notifications?: AdminNotificationListRelationFilter
  }, "id" | "cnpj" | "schemaName">

  export type CompanyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    cnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    schemaName?: SortOrder
    planId?: SortOrder
    isActive?: SortOrder
    trialEndsAt?: SortOrderInput | SortOrder
    features?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CompanyCountOrderByAggregateInput
    _max?: CompanyMaxOrderByAggregateInput
    _min?: CompanyMinOrderByAggregateInput
  }

  export type CompanyScalarWhereWithAggregatesInput = {
    AND?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    OR?: CompanyScalarWhereWithAggregatesInput[]
    NOT?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Company"> | string
    name?: StringWithAggregatesFilter<"Company"> | string
    cnpj?: StringWithAggregatesFilter<"Company"> | string
    email?: StringWithAggregatesFilter<"Company"> | string
    phone?: StringNullableWithAggregatesFilter<"Company"> | string | null
    schemaName?: StringWithAggregatesFilter<"Company"> | string
    planId?: StringWithAggregatesFilter<"Company"> | string
    isActive?: BoolWithAggregatesFilter<"Company"> | boolean
    trialEndsAt?: DateTimeNullableWithAggregatesFilter<"Company"> | Date | string | null
    features?: StringNullableListFilter<"Company">
    createdAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    companyId?: StringFilter<"Subscription"> | string
    planId?: StringFilter<"Subscription"> | string
    status?: EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus
    startsAt?: DateTimeFilter<"Subscription"> | Date | string
    endsAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    companyId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrderInput | SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    company?: CompanyOrderByWithRelationInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    companyId?: StringFilter<"Subscription"> | string
    planId?: StringFilter<"Subscription"> | string
    status?: EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus
    startsAt?: DateTimeFilter<"Subscription"> | Date | string
    endsAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
  }, "id">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    companyId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrderInput | SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    companyId?: StringWithAggregatesFilter<"Subscription"> | string
    planId?: StringWithAggregatesFilter<"Subscription"> | string
    status?: EnumSubscriptionStatusWithAggregatesFilter<"Subscription"> | $Enums.SubscriptionStatus
    startsAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    endsAt?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    cancelledAt?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
  }

  export type SuperAdminWhereInput = {
    AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
    OR?: SuperAdminWhereInput[]
    NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
    id?: StringFilter<"SuperAdmin"> | string
    name?: StringFilter<"SuperAdmin"> | string
    email?: StringFilter<"SuperAdmin"> | string
    passwordHash?: StringFilter<"SuperAdmin"> | string
    isActive?: BoolFilter<"SuperAdmin"> | boolean
    refreshTokenHash?: StringNullableFilter<"SuperAdmin"> | string | null
    lastLoginAt?: DateTimeNullableFilter<"SuperAdmin"> | Date | string | null
    createdAt?: DateTimeFilter<"SuperAdmin"> | Date | string
    updatedAt?: DateTimeFilter<"SuperAdmin"> | Date | string
  }

  export type SuperAdminOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    refreshTokenHash?: SortOrderInput | SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SuperAdminWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
    OR?: SuperAdminWhereInput[]
    NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
    name?: StringFilter<"SuperAdmin"> | string
    passwordHash?: StringFilter<"SuperAdmin"> | string
    isActive?: BoolFilter<"SuperAdmin"> | boolean
    refreshTokenHash?: StringNullableFilter<"SuperAdmin"> | string | null
    lastLoginAt?: DateTimeNullableFilter<"SuperAdmin"> | Date | string | null
    createdAt?: DateTimeFilter<"SuperAdmin"> | Date | string
    updatedAt?: DateTimeFilter<"SuperAdmin"> | Date | string
  }, "id" | "email">

  export type SuperAdminOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    refreshTokenHash?: SortOrderInput | SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SuperAdminCountOrderByAggregateInput
    _max?: SuperAdminMaxOrderByAggregateInput
    _min?: SuperAdminMinOrderByAggregateInput
  }

  export type SuperAdminScalarWhereWithAggregatesInput = {
    AND?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    OR?: SuperAdminScalarWhereWithAggregatesInput[]
    NOT?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SuperAdmin"> | string
    name?: StringWithAggregatesFilter<"SuperAdmin"> | string
    email?: StringWithAggregatesFilter<"SuperAdmin"> | string
    passwordHash?: StringWithAggregatesFilter<"SuperAdmin"> | string
    isActive?: BoolWithAggregatesFilter<"SuperAdmin"> | boolean
    refreshTokenHash?: StringNullableWithAggregatesFilter<"SuperAdmin"> | string | null
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"SuperAdmin"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SuperAdmin"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SuperAdmin"> | Date | string
  }

  export type BillingCustomerWhereInput = {
    AND?: BillingCustomerWhereInput | BillingCustomerWhereInput[]
    OR?: BillingCustomerWhereInput[]
    NOT?: BillingCustomerWhereInput | BillingCustomerWhereInput[]
    id?: StringFilter<"BillingCustomer"> | string
    companyId?: StringFilter<"BillingCustomer"> | string
    asaasCustomerId?: StringFilter<"BillingCustomer"> | string
    name?: StringFilter<"BillingCustomer"> | string
    cpfCnpj?: StringFilter<"BillingCustomer"> | string
    email?: StringFilter<"BillingCustomer"> | string
    phone?: StringNullableFilter<"BillingCustomer"> | string | null
    postalCode?: StringNullableFilter<"BillingCustomer"> | string | null
    address?: StringNullableFilter<"BillingCustomer"> | string | null
    addressNumber?: StringNullableFilter<"BillingCustomer"> | string | null
    complement?: StringNullableFilter<"BillingCustomer"> | string | null
    province?: StringNullableFilter<"BillingCustomer"> | string | null
    city?: StringNullableFilter<"BillingCustomer"> | string | null
    state?: StringNullableFilter<"BillingCustomer"> | string | null
    createdAt?: DateTimeFilter<"BillingCustomer"> | Date | string
    updatedAt?: DateTimeFilter<"BillingCustomer"> | Date | string
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
    invoices?: InvoiceListRelationFilter
    billingSubscription?: XOR<BillingSubscriptionNullableRelationFilter, BillingSubscriptionWhereInput> | null
  }

  export type BillingCustomerOrderByWithRelationInput = {
    id?: SortOrder
    companyId?: SortOrder
    asaasCustomerId?: SortOrder
    name?: SortOrder
    cpfCnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    addressNumber?: SortOrderInput | SortOrder
    complement?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    company?: CompanyOrderByWithRelationInput
    invoices?: InvoiceOrderByRelationAggregateInput
    billingSubscription?: BillingSubscriptionOrderByWithRelationInput
  }

  export type BillingCustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    companyId?: string
    asaasCustomerId?: string
    AND?: BillingCustomerWhereInput | BillingCustomerWhereInput[]
    OR?: BillingCustomerWhereInput[]
    NOT?: BillingCustomerWhereInput | BillingCustomerWhereInput[]
    name?: StringFilter<"BillingCustomer"> | string
    cpfCnpj?: StringFilter<"BillingCustomer"> | string
    email?: StringFilter<"BillingCustomer"> | string
    phone?: StringNullableFilter<"BillingCustomer"> | string | null
    postalCode?: StringNullableFilter<"BillingCustomer"> | string | null
    address?: StringNullableFilter<"BillingCustomer"> | string | null
    addressNumber?: StringNullableFilter<"BillingCustomer"> | string | null
    complement?: StringNullableFilter<"BillingCustomer"> | string | null
    province?: StringNullableFilter<"BillingCustomer"> | string | null
    city?: StringNullableFilter<"BillingCustomer"> | string | null
    state?: StringNullableFilter<"BillingCustomer"> | string | null
    createdAt?: DateTimeFilter<"BillingCustomer"> | Date | string
    updatedAt?: DateTimeFilter<"BillingCustomer"> | Date | string
    company?: XOR<CompanyRelationFilter, CompanyWhereInput>
    invoices?: InvoiceListRelationFilter
    billingSubscription?: XOR<BillingSubscriptionNullableRelationFilter, BillingSubscriptionWhereInput> | null
  }, "id" | "companyId" | "asaasCustomerId">

  export type BillingCustomerOrderByWithAggregationInput = {
    id?: SortOrder
    companyId?: SortOrder
    asaasCustomerId?: SortOrder
    name?: SortOrder
    cpfCnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    addressNumber?: SortOrderInput | SortOrder
    complement?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BillingCustomerCountOrderByAggregateInput
    _max?: BillingCustomerMaxOrderByAggregateInput
    _min?: BillingCustomerMinOrderByAggregateInput
  }

  export type BillingCustomerScalarWhereWithAggregatesInput = {
    AND?: BillingCustomerScalarWhereWithAggregatesInput | BillingCustomerScalarWhereWithAggregatesInput[]
    OR?: BillingCustomerScalarWhereWithAggregatesInput[]
    NOT?: BillingCustomerScalarWhereWithAggregatesInput | BillingCustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingCustomer"> | string
    companyId?: StringWithAggregatesFilter<"BillingCustomer"> | string
    asaasCustomerId?: StringWithAggregatesFilter<"BillingCustomer"> | string
    name?: StringWithAggregatesFilter<"BillingCustomer"> | string
    cpfCnpj?: StringWithAggregatesFilter<"BillingCustomer"> | string
    email?: StringWithAggregatesFilter<"BillingCustomer"> | string
    phone?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    address?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    addressNumber?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    complement?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    province?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    city?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    state?: StringNullableWithAggregatesFilter<"BillingCustomer"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BillingCustomer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BillingCustomer"> | Date | string
  }

  export type BillingSubscriptionWhereInput = {
    AND?: BillingSubscriptionWhereInput | BillingSubscriptionWhereInput[]
    OR?: BillingSubscriptionWhereInput[]
    NOT?: BillingSubscriptionWhereInput | BillingSubscriptionWhereInput[]
    id?: StringFilter<"BillingSubscription"> | string
    billingCustomerId?: StringFilter<"BillingSubscription"> | string
    asaasSubscriptionId?: StringFilter<"BillingSubscription"> | string
    planId?: StringFilter<"BillingSubscription"> | string
    billingType?: EnumBillingTypeFilter<"BillingSubscription"> | $Enums.BillingType
    value?: DecimalFilter<"BillingSubscription"> | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFilter<"BillingSubscription"> | Date | string
    cycle?: EnumBillingCycleFilter<"BillingSubscription"> | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFilter<"BillingSubscription"> | $Enums.BillingSubscriptionStatus
    description?: StringNullableFilter<"BillingSubscription"> | string | null
    externalReference?: StringNullableFilter<"BillingSubscription"> | string | null
    createdAt?: DateTimeFilter<"BillingSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"BillingSubscription"> | Date | string
    billingCustomer?: XOR<BillingCustomerRelationFilter, BillingCustomerWhereInput>
    plan?: XOR<PlanRelationFilter, PlanWhereInput>
  }

  export type BillingSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    billingCustomerId?: SortOrder
    asaasSubscriptionId?: SortOrder
    planId?: SortOrder
    billingType?: SortOrder
    value?: SortOrder
    nextDueDate?: SortOrder
    cycle?: SortOrder
    status?: SortOrder
    description?: SortOrderInput | SortOrder
    externalReference?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    billingCustomer?: BillingCustomerOrderByWithRelationInput
    plan?: PlanOrderByWithRelationInput
  }

  export type BillingSubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    billingCustomerId?: string
    asaasSubscriptionId?: string
    AND?: BillingSubscriptionWhereInput | BillingSubscriptionWhereInput[]
    OR?: BillingSubscriptionWhereInput[]
    NOT?: BillingSubscriptionWhereInput | BillingSubscriptionWhereInput[]
    planId?: StringFilter<"BillingSubscription"> | string
    billingType?: EnumBillingTypeFilter<"BillingSubscription"> | $Enums.BillingType
    value?: DecimalFilter<"BillingSubscription"> | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFilter<"BillingSubscription"> | Date | string
    cycle?: EnumBillingCycleFilter<"BillingSubscription"> | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFilter<"BillingSubscription"> | $Enums.BillingSubscriptionStatus
    description?: StringNullableFilter<"BillingSubscription"> | string | null
    externalReference?: StringNullableFilter<"BillingSubscription"> | string | null
    createdAt?: DateTimeFilter<"BillingSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"BillingSubscription"> | Date | string
    billingCustomer?: XOR<BillingCustomerRelationFilter, BillingCustomerWhereInput>
    plan?: XOR<PlanRelationFilter, PlanWhereInput>
  }, "id" | "billingCustomerId" | "asaasSubscriptionId">

  export type BillingSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    billingCustomerId?: SortOrder
    asaasSubscriptionId?: SortOrder
    planId?: SortOrder
    billingType?: SortOrder
    value?: SortOrder
    nextDueDate?: SortOrder
    cycle?: SortOrder
    status?: SortOrder
    description?: SortOrderInput | SortOrder
    externalReference?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BillingSubscriptionCountOrderByAggregateInput
    _avg?: BillingSubscriptionAvgOrderByAggregateInput
    _max?: BillingSubscriptionMaxOrderByAggregateInput
    _min?: BillingSubscriptionMinOrderByAggregateInput
    _sum?: BillingSubscriptionSumOrderByAggregateInput
  }

  export type BillingSubscriptionScalarWhereWithAggregatesInput = {
    AND?: BillingSubscriptionScalarWhereWithAggregatesInput | BillingSubscriptionScalarWhereWithAggregatesInput[]
    OR?: BillingSubscriptionScalarWhereWithAggregatesInput[]
    NOT?: BillingSubscriptionScalarWhereWithAggregatesInput | BillingSubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingSubscription"> | string
    billingCustomerId?: StringWithAggregatesFilter<"BillingSubscription"> | string
    asaasSubscriptionId?: StringWithAggregatesFilter<"BillingSubscription"> | string
    planId?: StringWithAggregatesFilter<"BillingSubscription"> | string
    billingType?: EnumBillingTypeWithAggregatesFilter<"BillingSubscription"> | $Enums.BillingType
    value?: DecimalWithAggregatesFilter<"BillingSubscription"> | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeWithAggregatesFilter<"BillingSubscription"> | Date | string
    cycle?: EnumBillingCycleWithAggregatesFilter<"BillingSubscription"> | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusWithAggregatesFilter<"BillingSubscription"> | $Enums.BillingSubscriptionStatus
    description?: StringNullableWithAggregatesFilter<"BillingSubscription"> | string | null
    externalReference?: StringNullableWithAggregatesFilter<"BillingSubscription"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BillingSubscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BillingSubscription"> | Date | string
  }

  export type InvoiceWhereInput = {
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    id?: StringFilter<"Invoice"> | string
    billingCustomerId?: StringFilter<"Invoice"> | string
    asaasPaymentId?: StringNullableFilter<"Invoice"> | string | null
    value?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    netValue?: DecimalNullableFilter<"Invoice"> | Decimal | DecimalJsLike | number | string | null
    billingType?: EnumBillingTypeFilter<"Invoice"> | $Enums.BillingType
    status?: EnumInvoiceStatusFilter<"Invoice"> | $Enums.InvoiceStatus
    dueDate?: DateTimeFilter<"Invoice"> | Date | string
    paidAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    invoiceUrl?: StringNullableFilter<"Invoice"> | string | null
    bankSlipUrl?: StringNullableFilter<"Invoice"> | string | null
    pixQrCode?: StringNullableFilter<"Invoice"> | string | null
    pixQrCodeImage?: StringNullableFilter<"Invoice"> | string | null
    description?: StringNullableFilter<"Invoice"> | string | null
    externalReference?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    billingCustomer?: XOR<BillingCustomerRelationFilter, BillingCustomerWhereInput>
  }

  export type InvoiceOrderByWithRelationInput = {
    id?: SortOrder
    billingCustomerId?: SortOrder
    asaasPaymentId?: SortOrderInput | SortOrder
    value?: SortOrder
    netValue?: SortOrderInput | SortOrder
    billingType?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    invoiceUrl?: SortOrderInput | SortOrder
    bankSlipUrl?: SortOrderInput | SortOrder
    pixQrCode?: SortOrderInput | SortOrder
    pixQrCodeImage?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    externalReference?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    billingCustomer?: BillingCustomerOrderByWithRelationInput
  }

  export type InvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    asaasPaymentId?: string
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    billingCustomerId?: StringFilter<"Invoice"> | string
    value?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    netValue?: DecimalNullableFilter<"Invoice"> | Decimal | DecimalJsLike | number | string | null
    billingType?: EnumBillingTypeFilter<"Invoice"> | $Enums.BillingType
    status?: EnumInvoiceStatusFilter<"Invoice"> | $Enums.InvoiceStatus
    dueDate?: DateTimeFilter<"Invoice"> | Date | string
    paidAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    invoiceUrl?: StringNullableFilter<"Invoice"> | string | null
    bankSlipUrl?: StringNullableFilter<"Invoice"> | string | null
    pixQrCode?: StringNullableFilter<"Invoice"> | string | null
    pixQrCodeImage?: StringNullableFilter<"Invoice"> | string | null
    description?: StringNullableFilter<"Invoice"> | string | null
    externalReference?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    billingCustomer?: XOR<BillingCustomerRelationFilter, BillingCustomerWhereInput>
  }, "id" | "asaasPaymentId">

  export type InvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    billingCustomerId?: SortOrder
    asaasPaymentId?: SortOrderInput | SortOrder
    value?: SortOrder
    netValue?: SortOrderInput | SortOrder
    billingType?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    invoiceUrl?: SortOrderInput | SortOrder
    bankSlipUrl?: SortOrderInput | SortOrder
    pixQrCode?: SortOrderInput | SortOrder
    pixQrCodeImage?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    externalReference?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InvoiceCountOrderByAggregateInput
    _avg?: InvoiceAvgOrderByAggregateInput
    _max?: InvoiceMaxOrderByAggregateInput
    _min?: InvoiceMinOrderByAggregateInput
    _sum?: InvoiceSumOrderByAggregateInput
  }

  export type InvoiceScalarWhereWithAggregatesInput = {
    AND?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    OR?: InvoiceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invoice"> | string
    billingCustomerId?: StringWithAggregatesFilter<"Invoice"> | string
    asaasPaymentId?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    value?: DecimalWithAggregatesFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    netValue?: DecimalNullableWithAggregatesFilter<"Invoice"> | Decimal | DecimalJsLike | number | string | null
    billingType?: EnumBillingTypeWithAggregatesFilter<"Invoice"> | $Enums.BillingType
    status?: EnumInvoiceStatusWithAggregatesFilter<"Invoice"> | $Enums.InvoiceStatus
    dueDate?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    paidAt?: DateTimeNullableWithAggregatesFilter<"Invoice"> | Date | string | null
    invoiceUrl?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    bankSlipUrl?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    pixQrCode?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    pixQrCodeImage?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    description?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    externalReference?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
  }

  export type BillingWebhookLogWhereInput = {
    AND?: BillingWebhookLogWhereInput | BillingWebhookLogWhereInput[]
    OR?: BillingWebhookLogWhereInput[]
    NOT?: BillingWebhookLogWhereInput | BillingWebhookLogWhereInput[]
    id?: StringFilter<"BillingWebhookLog"> | string
    event?: StringFilter<"BillingWebhookLog"> | string
    payload?: JsonFilter<"BillingWebhookLog">
    processed?: BoolFilter<"BillingWebhookLog"> | boolean
    error?: StringNullableFilter<"BillingWebhookLog"> | string | null
    createdAt?: DateTimeFilter<"BillingWebhookLog"> | Date | string
  }

  export type BillingWebhookLogOrderByWithRelationInput = {
    id?: SortOrder
    event?: SortOrder
    payload?: SortOrder
    processed?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type BillingWebhookLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BillingWebhookLogWhereInput | BillingWebhookLogWhereInput[]
    OR?: BillingWebhookLogWhereInput[]
    NOT?: BillingWebhookLogWhereInput | BillingWebhookLogWhereInput[]
    event?: StringFilter<"BillingWebhookLog"> | string
    payload?: JsonFilter<"BillingWebhookLog">
    processed?: BoolFilter<"BillingWebhookLog"> | boolean
    error?: StringNullableFilter<"BillingWebhookLog"> | string | null
    createdAt?: DateTimeFilter<"BillingWebhookLog"> | Date | string
  }, "id">

  export type BillingWebhookLogOrderByWithAggregationInput = {
    id?: SortOrder
    event?: SortOrder
    payload?: SortOrder
    processed?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: BillingWebhookLogCountOrderByAggregateInput
    _max?: BillingWebhookLogMaxOrderByAggregateInput
    _min?: BillingWebhookLogMinOrderByAggregateInput
  }

  export type BillingWebhookLogScalarWhereWithAggregatesInput = {
    AND?: BillingWebhookLogScalarWhereWithAggregatesInput | BillingWebhookLogScalarWhereWithAggregatesInput[]
    OR?: BillingWebhookLogScalarWhereWithAggregatesInput[]
    NOT?: BillingWebhookLogScalarWhereWithAggregatesInput | BillingWebhookLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingWebhookLog"> | string
    event?: StringWithAggregatesFilter<"BillingWebhookLog"> | string
    payload?: JsonWithAggregatesFilter<"BillingWebhookLog">
    processed?: BoolWithAggregatesFilter<"BillingWebhookLog"> | boolean
    error?: StringNullableWithAggregatesFilter<"BillingWebhookLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BillingWebhookLog"> | Date | string
  }

  export type AdminNotificationWhereInput = {
    AND?: AdminNotificationWhereInput | AdminNotificationWhereInput[]
    OR?: AdminNotificationWhereInput[]
    NOT?: AdminNotificationWhereInput | AdminNotificationWhereInput[]
    id?: StringFilter<"AdminNotification"> | string
    type?: EnumAdminNotificationTypeFilter<"AdminNotification"> | $Enums.AdminNotificationType
    title?: StringFilter<"AdminNotification"> | string
    message?: StringFilter<"AdminNotification"> | string
    companyId?: StringNullableFilter<"AdminNotification"> | string | null
    metadata?: JsonNullableFilter<"AdminNotification">
    isRead?: BoolFilter<"AdminNotification"> | boolean
    createdAt?: DateTimeFilter<"AdminNotification"> | Date | string
    company?: XOR<CompanyNullableRelationFilter, CompanyWhereInput> | null
  }

  export type AdminNotificationOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    companyId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    company?: CompanyOrderByWithRelationInput
  }

  export type AdminNotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AdminNotificationWhereInput | AdminNotificationWhereInput[]
    OR?: AdminNotificationWhereInput[]
    NOT?: AdminNotificationWhereInput | AdminNotificationWhereInput[]
    type?: EnumAdminNotificationTypeFilter<"AdminNotification"> | $Enums.AdminNotificationType
    title?: StringFilter<"AdminNotification"> | string
    message?: StringFilter<"AdminNotification"> | string
    companyId?: StringNullableFilter<"AdminNotification"> | string | null
    metadata?: JsonNullableFilter<"AdminNotification">
    isRead?: BoolFilter<"AdminNotification"> | boolean
    createdAt?: DateTimeFilter<"AdminNotification"> | Date | string
    company?: XOR<CompanyNullableRelationFilter, CompanyWhereInput> | null
  }, "id">

  export type AdminNotificationOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    companyId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    _count?: AdminNotificationCountOrderByAggregateInput
    _max?: AdminNotificationMaxOrderByAggregateInput
    _min?: AdminNotificationMinOrderByAggregateInput
  }

  export type AdminNotificationScalarWhereWithAggregatesInput = {
    AND?: AdminNotificationScalarWhereWithAggregatesInput | AdminNotificationScalarWhereWithAggregatesInput[]
    OR?: AdminNotificationScalarWhereWithAggregatesInput[]
    NOT?: AdminNotificationScalarWhereWithAggregatesInput | AdminNotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminNotification"> | string
    type?: EnumAdminNotificationTypeWithAggregatesFilter<"AdminNotification"> | $Enums.AdminNotificationType
    title?: StringWithAggregatesFilter<"AdminNotification"> | string
    message?: StringWithAggregatesFilter<"AdminNotification"> | string
    companyId?: StringNullableWithAggregatesFilter<"AdminNotification"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AdminNotification">
    isRead?: BoolWithAggregatesFilter<"AdminNotification"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AdminNotification"> | Date | string
  }

  export type MasterAuditLogWhereInput = {
    AND?: MasterAuditLogWhereInput | MasterAuditLogWhereInput[]
    OR?: MasterAuditLogWhereInput[]
    NOT?: MasterAuditLogWhereInput | MasterAuditLogWhereInput[]
    id?: StringFilter<"MasterAuditLog"> | string
    companyId?: StringNullableFilter<"MasterAuditLog"> | string | null
    action?: StringFilter<"MasterAuditLog"> | string
    entityType?: StringFilter<"MasterAuditLog"> | string
    entityId?: StringNullableFilter<"MasterAuditLog"> | string | null
    userId?: StringNullableFilter<"MasterAuditLog"> | string | null
    userEmail?: StringNullableFilter<"MasterAuditLog"> | string | null
    ipAddress?: StringNullableFilter<"MasterAuditLog"> | string | null
    userAgent?: StringNullableFilter<"MasterAuditLog"> | string | null
    metadata?: JsonNullableFilter<"MasterAuditLog">
    createdAt?: DateTimeFilter<"MasterAuditLog"> | Date | string
    company?: XOR<CompanyNullableRelationFilter, CompanyWhereInput> | null
  }

  export type MasterAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    companyId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    userEmail?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    company?: CompanyOrderByWithRelationInput
  }

  export type MasterAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MasterAuditLogWhereInput | MasterAuditLogWhereInput[]
    OR?: MasterAuditLogWhereInput[]
    NOT?: MasterAuditLogWhereInput | MasterAuditLogWhereInput[]
    companyId?: StringNullableFilter<"MasterAuditLog"> | string | null
    action?: StringFilter<"MasterAuditLog"> | string
    entityType?: StringFilter<"MasterAuditLog"> | string
    entityId?: StringNullableFilter<"MasterAuditLog"> | string | null
    userId?: StringNullableFilter<"MasterAuditLog"> | string | null
    userEmail?: StringNullableFilter<"MasterAuditLog"> | string | null
    ipAddress?: StringNullableFilter<"MasterAuditLog"> | string | null
    userAgent?: StringNullableFilter<"MasterAuditLog"> | string | null
    metadata?: JsonNullableFilter<"MasterAuditLog">
    createdAt?: DateTimeFilter<"MasterAuditLog"> | Date | string
    company?: XOR<CompanyNullableRelationFilter, CompanyWhereInput> | null
  }, "id">

  export type MasterAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    companyId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    userEmail?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MasterAuditLogCountOrderByAggregateInput
    _max?: MasterAuditLogMaxOrderByAggregateInput
    _min?: MasterAuditLogMinOrderByAggregateInput
  }

  export type MasterAuditLogScalarWhereWithAggregatesInput = {
    AND?: MasterAuditLogScalarWhereWithAggregatesInput | MasterAuditLogScalarWhereWithAggregatesInput[]
    OR?: MasterAuditLogScalarWhereWithAggregatesInput[]
    NOT?: MasterAuditLogScalarWhereWithAggregatesInput | MasterAuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MasterAuditLog"> | string
    companyId?: StringNullableWithAggregatesFilter<"MasterAuditLog"> | string | null
    action?: StringWithAggregatesFilter<"MasterAuditLog"> | string
    entityType?: StringWithAggregatesFilter<"MasterAuditLog"> | string
    entityId?: StringNullableWithAggregatesFilter<"MasterAuditLog"> | string | null
    userId?: StringNullableWithAggregatesFilter<"MasterAuditLog"> | string | null
    userEmail?: StringNullableWithAggregatesFilter<"MasterAuditLog"> | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"MasterAuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"MasterAuditLog"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"MasterAuditLog">
    createdAt?: DateTimeWithAggregatesFilter<"MasterAuditLog"> | Date | string
  }

  export type PlanCreateInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    maxVehicles: number
    maxDrivers: number
    maxUsers: number
    maxBranches: number
    storageGb: number
    priceMonthly: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    createdAt?: Date | string
    companies?: CompanyCreateNestedManyWithoutPlanInput
    billingSubscriptions?: BillingSubscriptionCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    maxVehicles: number
    maxDrivers: number
    maxUsers: number
    maxBranches: number
    storageGb: number
    priceMonthly: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    createdAt?: Date | string
    companies?: CompanyUncheckedCreateNestedManyWithoutPlanInput
    billingSubscriptions?: BillingSubscriptionUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    maxVehicles?: IntFieldUpdateOperationsInput | number
    maxDrivers?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxBranches?: IntFieldUpdateOperationsInput | number
    storageGb?: IntFieldUpdateOperationsInput | number
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companies?: CompanyUpdateManyWithoutPlanNestedInput
    billingSubscriptions?: BillingSubscriptionUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    maxVehicles?: IntFieldUpdateOperationsInput | number
    maxDrivers?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxBranches?: IntFieldUpdateOperationsInput | number
    storageGb?: IntFieldUpdateOperationsInput | number
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companies?: CompanyUncheckedUpdateManyWithoutPlanNestedInput
    billingSubscriptions?: BillingSubscriptionUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PlanCreateManyInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    maxVehicles: number
    maxDrivers: number
    maxUsers: number
    maxBranches: number
    storageGb: number
    priceMonthly: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    createdAt?: Date | string
  }

  export type PlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    maxVehicles?: IntFieldUpdateOperationsInput | number
    maxDrivers?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxBranches?: IntFieldUpdateOperationsInput | number
    storageGb?: IntFieldUpdateOperationsInput | number
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    maxVehicles?: IntFieldUpdateOperationsInput | number
    maxDrivers?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxBranches?: IntFieldUpdateOperationsInput | number
    storageGb?: IntFieldUpdateOperationsInput | number
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentGatewaySettingsCreateInput = {
    id?: string
    singletonKey?: string
    provider?: $Enums.PaymentProvider
    environment?: $Enums.PaymentEnvironment
    asaasApiKey?: string | null
    asaasWalletId?: string | null
    asaasWebhookToken?: string | null
    sicoobClientId?: string | null
    sicoobClientSecret?: string | null
    sicoobCertificateBase64?: string | null
    sicoobPixKey?: string | null
    isActive?: boolean
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PaymentGatewaySettingsUncheckedCreateInput = {
    id?: string
    singletonKey?: string
    provider?: $Enums.PaymentProvider
    environment?: $Enums.PaymentEnvironment
    asaasApiKey?: string | null
    asaasWalletId?: string | null
    asaasWebhookToken?: string | null
    sicoobClientId?: string | null
    sicoobClientSecret?: string | null
    sicoobCertificateBase64?: string | null
    sicoobPixKey?: string | null
    isActive?: boolean
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PaymentGatewaySettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    singletonKey?: StringFieldUpdateOperationsInput | string
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    environment?: EnumPaymentEnvironmentFieldUpdateOperationsInput | $Enums.PaymentEnvironment
    asaasApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    asaasWalletId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasWebhookToken?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobClientId?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobCertificateBase64?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobPixKey?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentGatewaySettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    singletonKey?: StringFieldUpdateOperationsInput | string
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    environment?: EnumPaymentEnvironmentFieldUpdateOperationsInput | $Enums.PaymentEnvironment
    asaasApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    asaasWalletId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasWebhookToken?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobClientId?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobCertificateBase64?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobPixKey?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentGatewaySettingsCreateManyInput = {
    id?: string
    singletonKey?: string
    provider?: $Enums.PaymentProvider
    environment?: $Enums.PaymentEnvironment
    asaasApiKey?: string | null
    asaasWalletId?: string | null
    asaasWebhookToken?: string | null
    sicoobClientId?: string | null
    sicoobClientSecret?: string | null
    sicoobCertificateBase64?: string | null
    sicoobPixKey?: string | null
    isActive?: boolean
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type PaymentGatewaySettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    singletonKey?: StringFieldUpdateOperationsInput | string
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    environment?: EnumPaymentEnvironmentFieldUpdateOperationsInput | $Enums.PaymentEnvironment
    asaasApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    asaasWalletId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasWebhookToken?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobClientId?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobCertificateBase64?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobPixKey?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentGatewaySettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    singletonKey?: StringFieldUpdateOperationsInput | string
    provider?: EnumPaymentProviderFieldUpdateOperationsInput | $Enums.PaymentProvider
    environment?: EnumPaymentEnvironmentFieldUpdateOperationsInput | $Enums.PaymentEnvironment
    asaasApiKey?: NullableStringFieldUpdateOperationsInput | string | null
    asaasWalletId?: NullableStringFieldUpdateOperationsInput | string | null
    asaasWebhookToken?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobClientId?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobCertificateBase64?: NullableStringFieldUpdateOperationsInput | string | null
    sicoobPixKey?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyCreateInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: PlanCreateNestedOneWithoutCompaniesInput
    subscriptions?: SubscriptionCreateNestedManyWithoutCompanyInput
    auditLogs?: MasterAuditLogCreateNestedManyWithoutCompanyInput
    billingCustomer?: BillingCustomerCreateNestedOneWithoutCompanyInput
    notifications?: AdminNotificationCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    planId: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutCompanyInput
    auditLogs?: MasterAuditLogUncheckedCreateNestedManyWithoutCompanyInput
    billingCustomer?: BillingCustomerUncheckedCreateNestedOneWithoutCompanyInput
    notifications?: AdminNotificationUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneRequiredWithoutCompaniesNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutCompanyNestedInput
    auditLogs?: MasterAuditLogUpdateManyWithoutCompanyNestedInput
    billingCustomer?: BillingCustomerUpdateOneWithoutCompanyNestedInput
    notifications?: AdminNotificationUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutCompanyNestedInput
    auditLogs?: MasterAuditLogUncheckedUpdateManyWithoutCompanyNestedInput
    billingCustomer?: BillingCustomerUncheckedUpdateOneWithoutCompanyNestedInput
    notifications?: AdminNotificationUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateManyInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    planId: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompanyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateInput = {
    id?: string
    planId: string
    status: $Enums.SubscriptionStatus
    startsAt: Date | string
    endsAt?: Date | string | null
    cancelledAt?: Date | string | null
    createdAt?: Date | string
    company: CompanyCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    companyId: string
    planId: string
    status: $Enums.SubscriptionStatus
    startsAt: Date | string
    endsAt?: Date | string | null
    cancelledAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    companyId: string
    planId: string
    status: $Enums.SubscriptionStatus
    startsAt: Date | string
    endsAt?: Date | string | null
    cancelledAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    isActive?: boolean
    refreshTokenHash?: string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SuperAdminUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    isActive?: boolean
    refreshTokenHash?: string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SuperAdminUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminCreateManyInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    isActive?: boolean
    refreshTokenHash?: string | null
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SuperAdminUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    refreshTokenHash?: NullableStringFieldUpdateOperationsInput | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingCustomerCreateInput = {
    id?: string
    asaasCustomerId: string
    name: string
    cpfCnpj: string
    email: string
    phone?: string | null
    postalCode?: string | null
    address?: string | null
    addressNumber?: string | null
    complement?: string | null
    province?: string | null
    city?: string | null
    state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutBillingCustomerInput
    invoices?: InvoiceCreateNestedManyWithoutBillingCustomerInput
    billingSubscription?: BillingSubscriptionCreateNestedOneWithoutBillingCustomerInput
  }

  export type BillingCustomerUncheckedCreateInput = {
    id?: string
    companyId: string
    asaasCustomerId: string
    name: string
    cpfCnpj: string
    email: string
    phone?: string | null
    postalCode?: string | null
    address?: string | null
    addressNumber?: string | null
    complement?: string | null
    province?: string | null
    city?: string | null
    state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutBillingCustomerInput
    billingSubscription?: BillingSubscriptionUncheckedCreateNestedOneWithoutBillingCustomerInput
  }

  export type BillingCustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasCustomerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cpfCnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    addressNumber?: NullableStringFieldUpdateOperationsInput | string | null
    complement?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutBillingCustomerNestedInput
    invoices?: InvoiceUpdateManyWithoutBillingCustomerNestedInput
    billingSubscription?: BillingSubscriptionUpdateOneWithoutBillingCustomerNestedInput
  }

  export type BillingCustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    asaasCustomerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cpfCnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    addressNumber?: NullableStringFieldUpdateOperationsInput | string | null
    complement?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUncheckedUpdateManyWithoutBillingCustomerNestedInput
    billingSubscription?: BillingSubscriptionUncheckedUpdateOneWithoutBillingCustomerNestedInput
  }

  export type BillingCustomerCreateManyInput = {
    id?: string
    companyId: string
    asaasCustomerId: string
    name: string
    cpfCnpj: string
    email: string
    phone?: string | null
    postalCode?: string | null
    address?: string | null
    addressNumber?: string | null
    complement?: string | null
    province?: string | null
    city?: string | null
    state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingCustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasCustomerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cpfCnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    addressNumber?: NullableStringFieldUpdateOperationsInput | string | null
    complement?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingCustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    asaasCustomerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cpfCnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    addressNumber?: NullableStringFieldUpdateOperationsInput | string | null
    complement?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingSubscriptionCreateInput = {
    id?: string
    asaasSubscriptionId: string
    billingType: $Enums.BillingType
    value: Decimal | DecimalJsLike | number | string
    nextDueDate: Date | string
    cycle?: $Enums.BillingCycle
    status?: $Enums.BillingSubscriptionStatus
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    billingCustomer: BillingCustomerCreateNestedOneWithoutBillingSubscriptionInput
    plan: PlanCreateNestedOneWithoutBillingSubscriptionsInput
  }

  export type BillingSubscriptionUncheckedCreateInput = {
    id?: string
    billingCustomerId: string
    asaasSubscriptionId: string
    planId: string
    billingType: $Enums.BillingType
    value: Decimal | DecimalJsLike | number | string
    nextDueDate: Date | string
    cycle?: $Enums.BillingCycle
    status?: $Enums.BillingSubscriptionStatus
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingSubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasSubscriptionId?: StringFieldUpdateOperationsInput | string
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    cycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFieldUpdateOperationsInput | $Enums.BillingSubscriptionStatus
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingCustomer?: BillingCustomerUpdateOneRequiredWithoutBillingSubscriptionNestedInput
    plan?: PlanUpdateOneRequiredWithoutBillingSubscriptionsNestedInput
  }

  export type BillingSubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    billingCustomerId?: StringFieldUpdateOperationsInput | string
    asaasSubscriptionId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    cycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFieldUpdateOperationsInput | $Enums.BillingSubscriptionStatus
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingSubscriptionCreateManyInput = {
    id?: string
    billingCustomerId: string
    asaasSubscriptionId: string
    planId: string
    billingType: $Enums.BillingType
    value: Decimal | DecimalJsLike | number | string
    nextDueDate: Date | string
    cycle?: $Enums.BillingCycle
    status?: $Enums.BillingSubscriptionStatus
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingSubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasSubscriptionId?: StringFieldUpdateOperationsInput | string
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    cycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFieldUpdateOperationsInput | $Enums.BillingSubscriptionStatus
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingSubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    billingCustomerId?: StringFieldUpdateOperationsInput | string
    asaasSubscriptionId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    cycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFieldUpdateOperationsInput | $Enums.BillingSubscriptionStatus
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateInput = {
    id?: string
    asaasPaymentId?: string | null
    value: Decimal | DecimalJsLike | number | string
    netValue?: Decimal | DecimalJsLike | number | string | null
    billingType: $Enums.BillingType
    status?: $Enums.InvoiceStatus
    dueDate: Date | string
    paidAt?: Date | string | null
    invoiceUrl?: string | null
    bankSlipUrl?: string | null
    pixQrCode?: string | null
    pixQrCodeImage?: string | null
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    billingCustomer: BillingCustomerCreateNestedOneWithoutInvoicesInput
  }

  export type InvoiceUncheckedCreateInput = {
    id?: string
    billingCustomerId: string
    asaasPaymentId?: string | null
    value: Decimal | DecimalJsLike | number | string
    netValue?: Decimal | DecimalJsLike | number | string | null
    billingType: $Enums.BillingType
    status?: $Enums.InvoiceStatus
    dueDate: Date | string
    paidAt?: Date | string | null
    invoiceUrl?: string | null
    bankSlipUrl?: string | null
    pixQrCode?: string | null
    pixQrCodeImage?: string | null
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankSlipUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCode?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCodeImage?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingCustomer?: BillingCustomerUpdateOneRequiredWithoutInvoicesNestedInput
  }

  export type InvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    billingCustomerId?: StringFieldUpdateOperationsInput | string
    asaasPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankSlipUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCode?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCodeImage?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateManyInput = {
    id?: string
    billingCustomerId: string
    asaasPaymentId?: string | null
    value: Decimal | DecimalJsLike | number | string
    netValue?: Decimal | DecimalJsLike | number | string | null
    billingType: $Enums.BillingType
    status?: $Enums.InvoiceStatus
    dueDate: Date | string
    paidAt?: Date | string | null
    invoiceUrl?: string | null
    bankSlipUrl?: string | null
    pixQrCode?: string | null
    pixQrCodeImage?: string | null
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankSlipUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCode?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCodeImage?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    billingCustomerId?: StringFieldUpdateOperationsInput | string
    asaasPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankSlipUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCode?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCodeImage?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingWebhookLogCreateInput = {
    id?: string
    event: string
    payload: JsonNullValueInput | InputJsonValue
    processed?: boolean
    error?: string | null
    createdAt?: Date | string
  }

  export type BillingWebhookLogUncheckedCreateInput = {
    id?: string
    event: string
    payload: JsonNullValueInput | InputJsonValue
    processed?: boolean
    error?: string | null
    createdAt?: Date | string
  }

  export type BillingWebhookLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingWebhookLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingWebhookLogCreateManyInput = {
    id?: string
    event: string
    payload: JsonNullValueInput | InputJsonValue
    processed?: boolean
    error?: string | null
    createdAt?: Date | string
  }

  export type BillingWebhookLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingWebhookLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminNotificationCreateInput = {
    id?: string
    type: $Enums.AdminNotificationType
    title: string
    message: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    createdAt?: Date | string
    company?: CompanyCreateNestedOneWithoutNotificationsInput
  }

  export type AdminNotificationUncheckedCreateInput = {
    id?: string
    type: $Enums.AdminNotificationType
    title: string
    message: string
    companyId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    createdAt?: Date | string
  }

  export type AdminNotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAdminNotificationTypeFieldUpdateOperationsInput | $Enums.AdminNotificationType
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutNotificationsNestedInput
  }

  export type AdminNotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAdminNotificationTypeFieldUpdateOperationsInput | $Enums.AdminNotificationType
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminNotificationCreateManyInput = {
    id?: string
    type: $Enums.AdminNotificationType
    title: string
    message: string
    companyId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    createdAt?: Date | string
  }

  export type AdminNotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAdminNotificationTypeFieldUpdateOperationsInput | $Enums.AdminNotificationType
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminNotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAdminNotificationTypeFieldUpdateOperationsInput | $Enums.AdminNotificationType
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterAuditLogCreateInput = {
    id?: string
    action: string
    entityType: string
    entityId?: string | null
    userId?: string | null
    userEmail?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    company?: CompanyCreateNestedOneWithoutAuditLogsInput
  }

  export type MasterAuditLogUncheckedCreateInput = {
    id?: string
    companyId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    userId?: string | null
    userEmail?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MasterAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutAuditLogsNestedInput
  }

  export type MasterAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterAuditLogCreateManyInput = {
    id?: string
    companyId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    userId?: string | null
    userEmail?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MasterAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumPlanTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeFilter<$PrismaModel> | $Enums.PlanType
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CompanyListRelationFilter = {
    every?: CompanyWhereInput
    some?: CompanyWhereInput
    none?: CompanyWhereInput
  }

  export type BillingSubscriptionListRelationFilter = {
    every?: BillingSubscriptionWhereInput
    some?: BillingSubscriptionWhereInput
    none?: BillingSubscriptionWhereInput
  }

  export type CompanyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BillingSubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlanCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    maxVehicles?: SortOrder
    maxDrivers?: SortOrder
    maxUsers?: SortOrder
    maxBranches?: SortOrder
    storageGb?: SortOrder
    priceMonthly?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type PlanAvgOrderByAggregateInput = {
    maxVehicles?: SortOrder
    maxDrivers?: SortOrder
    maxUsers?: SortOrder
    maxBranches?: SortOrder
    storageGb?: SortOrder
    priceMonthly?: SortOrder
  }

  export type PlanMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    maxVehicles?: SortOrder
    maxDrivers?: SortOrder
    maxUsers?: SortOrder
    maxBranches?: SortOrder
    storageGb?: SortOrder
    priceMonthly?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type PlanMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    maxVehicles?: SortOrder
    maxDrivers?: SortOrder
    maxUsers?: SortOrder
    maxBranches?: SortOrder
    storageGb?: SortOrder
    priceMonthly?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type PlanSumOrderByAggregateInput = {
    maxVehicles?: SortOrder
    maxDrivers?: SortOrder
    maxUsers?: SortOrder
    maxBranches?: SortOrder
    storageGb?: SortOrder
    priceMonthly?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumPlanTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel> | $Enums.PlanType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanTypeFilter<$PrismaModel>
    _max?: NestedEnumPlanTypeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumPaymentProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderFilter<$PrismaModel> | $Enums.PaymentProvider
  }

  export type EnumPaymentEnvironmentFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentEnvironment | EnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentEnvironment[] | ListEnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentEnvironment[] | ListEnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentEnvironmentFilter<$PrismaModel> | $Enums.PaymentEnvironment
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PaymentGatewaySettingsCountOrderByAggregateInput = {
    id?: SortOrder
    singletonKey?: SortOrder
    provider?: SortOrder
    environment?: SortOrder
    asaasApiKey?: SortOrder
    asaasWalletId?: SortOrder
    asaasWebhookToken?: SortOrder
    sicoobClientId?: SortOrder
    sicoobClientSecret?: SortOrder
    sicoobCertificateBase64?: SortOrder
    sicoobPixKey?: SortOrder
    isActive?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentGatewaySettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    singletonKey?: SortOrder
    provider?: SortOrder
    environment?: SortOrder
    asaasApiKey?: SortOrder
    asaasWalletId?: SortOrder
    asaasWebhookToken?: SortOrder
    sicoobClientId?: SortOrder
    sicoobClientSecret?: SortOrder
    sicoobCertificateBase64?: SortOrder
    sicoobPixKey?: SortOrder
    isActive?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentGatewaySettingsMinOrderByAggregateInput = {
    id?: SortOrder
    singletonKey?: SortOrder
    provider?: SortOrder
    environment?: SortOrder
    asaasApiKey?: SortOrder
    asaasWalletId?: SortOrder
    asaasWebhookToken?: SortOrder
    sicoobClientId?: SortOrder
    sicoobClientSecret?: SortOrder
    sicoobCertificateBase64?: SortOrder
    sicoobPixKey?: SortOrder
    isActive?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumPaymentProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderWithAggregatesFilter<$PrismaModel> | $Enums.PaymentProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentProviderFilter<$PrismaModel>
    _max?: NestedEnumPaymentProviderFilter<$PrismaModel>
  }

  export type EnumPaymentEnvironmentWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentEnvironment | EnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentEnvironment[] | ListEnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentEnvironment[] | ListEnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentEnvironmentWithAggregatesFilter<$PrismaModel> | $Enums.PaymentEnvironment
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentEnvironmentFilter<$PrismaModel>
    _max?: NestedEnumPaymentEnvironmentFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type PlanRelationFilter = {
    is?: PlanWhereInput
    isNot?: PlanWhereInput
  }

  export type SubscriptionListRelationFilter = {
    every?: SubscriptionWhereInput
    some?: SubscriptionWhereInput
    none?: SubscriptionWhereInput
  }

  export type MasterAuditLogListRelationFilter = {
    every?: MasterAuditLogWhereInput
    some?: MasterAuditLogWhereInput
    none?: MasterAuditLogWhereInput
  }

  export type BillingCustomerNullableRelationFilter = {
    is?: BillingCustomerWhereInput | null
    isNot?: BillingCustomerWhereInput | null
  }

  export type AdminNotificationListRelationFilter = {
    every?: AdminNotificationWhereInput
    some?: AdminNotificationWhereInput
    none?: AdminNotificationWhereInput
  }

  export type SubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MasterAuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AdminNotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    cnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    schemaName?: SortOrder
    planId?: SortOrder
    isActive?: SortOrder
    trialEndsAt?: SortOrder
    features?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    cnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    schemaName?: SortOrder
    planId?: SortOrder
    isActive?: SortOrder
    trialEndsAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    cnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    schemaName?: SortOrder
    planId?: SortOrder
    isActive?: SortOrder
    trialEndsAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type CompanyRelationFilter = {
    is?: CompanyWhereInput
    isNot?: CompanyWhereInput
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    cancelledAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    cancelledAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    cancelledAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type SuperAdminCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    refreshTokenHash?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SuperAdminMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    refreshTokenHash?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SuperAdminMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    refreshTokenHash?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceListRelationFilter = {
    every?: InvoiceWhereInput
    some?: InvoiceWhereInput
    none?: InvoiceWhereInput
  }

  export type BillingSubscriptionNullableRelationFilter = {
    is?: BillingSubscriptionWhereInput | null
    isNot?: BillingSubscriptionWhereInput | null
  }

  export type InvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BillingCustomerCountOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    asaasCustomerId?: SortOrder
    name?: SortOrder
    cpfCnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    postalCode?: SortOrder
    address?: SortOrder
    addressNumber?: SortOrder
    complement?: SortOrder
    province?: SortOrder
    city?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingCustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    asaasCustomerId?: SortOrder
    name?: SortOrder
    cpfCnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    postalCode?: SortOrder
    address?: SortOrder
    addressNumber?: SortOrder
    complement?: SortOrder
    province?: SortOrder
    city?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingCustomerMinOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    asaasCustomerId?: SortOrder
    name?: SortOrder
    cpfCnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    postalCode?: SortOrder
    address?: SortOrder
    addressNumber?: SortOrder
    complement?: SortOrder
    province?: SortOrder
    city?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumBillingTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingType | EnumBillingTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BillingType[] | ListEnumBillingTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingType[] | ListEnumBillingTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingTypeFilter<$PrismaModel> | $Enums.BillingType
  }

  export type EnumBillingCycleFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingCycle | EnumBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingCycleFilter<$PrismaModel> | $Enums.BillingCycle
  }

  export type EnumBillingSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingSubscriptionStatus | EnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingSubscriptionStatus[] | ListEnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingSubscriptionStatus[] | ListEnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingSubscriptionStatusFilter<$PrismaModel> | $Enums.BillingSubscriptionStatus
  }

  export type BillingCustomerRelationFilter = {
    is?: BillingCustomerWhereInput
    isNot?: BillingCustomerWhereInput
  }

  export type BillingSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    billingCustomerId?: SortOrder
    asaasSubscriptionId?: SortOrder
    planId?: SortOrder
    billingType?: SortOrder
    value?: SortOrder
    nextDueDate?: SortOrder
    cycle?: SortOrder
    status?: SortOrder
    description?: SortOrder
    externalReference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingSubscriptionAvgOrderByAggregateInput = {
    value?: SortOrder
  }

  export type BillingSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    billingCustomerId?: SortOrder
    asaasSubscriptionId?: SortOrder
    planId?: SortOrder
    billingType?: SortOrder
    value?: SortOrder
    nextDueDate?: SortOrder
    cycle?: SortOrder
    status?: SortOrder
    description?: SortOrder
    externalReference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    billingCustomerId?: SortOrder
    asaasSubscriptionId?: SortOrder
    planId?: SortOrder
    billingType?: SortOrder
    value?: SortOrder
    nextDueDate?: SortOrder
    cycle?: SortOrder
    status?: SortOrder
    description?: SortOrder
    externalReference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingSubscriptionSumOrderByAggregateInput = {
    value?: SortOrder
  }

  export type EnumBillingTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingType | EnumBillingTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BillingType[] | ListEnumBillingTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingType[] | ListEnumBillingTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingTypeWithAggregatesFilter<$PrismaModel> | $Enums.BillingType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingTypeFilter<$PrismaModel>
    _max?: NestedEnumBillingTypeFilter<$PrismaModel>
  }

  export type EnumBillingCycleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingCycle | EnumBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingCycleWithAggregatesFilter<$PrismaModel> | $Enums.BillingCycle
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingCycleFilter<$PrismaModel>
    _max?: NestedEnumBillingCycleFilter<$PrismaModel>
  }

  export type EnumBillingSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingSubscriptionStatus | EnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingSubscriptionStatus[] | ListEnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingSubscriptionStatus[] | ListEnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.BillingSubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumBillingSubscriptionStatusFilter<$PrismaModel>
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusFilter<$PrismaModel> | $Enums.InvoiceStatus
  }

  export type InvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    billingCustomerId?: SortOrder
    asaasPaymentId?: SortOrder
    value?: SortOrder
    netValue?: SortOrder
    billingType?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    paidAt?: SortOrder
    invoiceUrl?: SortOrder
    bankSlipUrl?: SortOrder
    pixQrCode?: SortOrder
    pixQrCodeImage?: SortOrder
    description?: SortOrder
    externalReference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceAvgOrderByAggregateInput = {
    value?: SortOrder
    netValue?: SortOrder
  }

  export type InvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    billingCustomerId?: SortOrder
    asaasPaymentId?: SortOrder
    value?: SortOrder
    netValue?: SortOrder
    billingType?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    paidAt?: SortOrder
    invoiceUrl?: SortOrder
    bankSlipUrl?: SortOrder
    pixQrCode?: SortOrder
    pixQrCodeImage?: SortOrder
    description?: SortOrder
    externalReference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    billingCustomerId?: SortOrder
    asaasPaymentId?: SortOrder
    value?: SortOrder
    netValue?: SortOrder
    billingType?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    paidAt?: SortOrder
    invoiceUrl?: SortOrder
    bankSlipUrl?: SortOrder
    pixQrCode?: SortOrder
    pixQrCodeImage?: SortOrder
    description?: SortOrder
    externalReference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceSumOrderByAggregateInput = {
    value?: SortOrder
    netValue?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumInvoiceStatusFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BillingWebhookLogCountOrderByAggregateInput = {
    id?: SortOrder
    event?: SortOrder
    payload?: SortOrder
    processed?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingWebhookLogMaxOrderByAggregateInput = {
    id?: SortOrder
    event?: SortOrder
    processed?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type BillingWebhookLogMinOrderByAggregateInput = {
    id?: SortOrder
    event?: SortOrder
    processed?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumAdminNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminNotificationType | EnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AdminNotificationType[] | ListEnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminNotificationType[] | ListEnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminNotificationTypeFilter<$PrismaModel> | $Enums.AdminNotificationType
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type CompanyNullableRelationFilter = {
    is?: CompanyWhereInput | null
    isNot?: CompanyWhereInput | null
  }

  export type AdminNotificationCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    companyId?: SortOrder
    metadata?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminNotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    companyId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminNotificationMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    companyId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumAdminNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminNotificationType | EnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AdminNotificationType[] | ListEnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminNotificationType[] | ListEnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.AdminNotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAdminNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumAdminNotificationTypeFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type MasterAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type MasterAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type MasterAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    userId?: SortOrder
    userEmail?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type CompanyCreateNestedManyWithoutPlanInput = {
    create?: XOR<CompanyCreateWithoutPlanInput, CompanyUncheckedCreateWithoutPlanInput> | CompanyCreateWithoutPlanInput[] | CompanyUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: CompanyCreateOrConnectWithoutPlanInput | CompanyCreateOrConnectWithoutPlanInput[]
    createMany?: CompanyCreateManyPlanInputEnvelope
    connect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
  }

  export type BillingSubscriptionCreateNestedManyWithoutPlanInput = {
    create?: XOR<BillingSubscriptionCreateWithoutPlanInput, BillingSubscriptionUncheckedCreateWithoutPlanInput> | BillingSubscriptionCreateWithoutPlanInput[] | BillingSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BillingSubscriptionCreateOrConnectWithoutPlanInput | BillingSubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: BillingSubscriptionCreateManyPlanInputEnvelope
    connect?: BillingSubscriptionWhereUniqueInput | BillingSubscriptionWhereUniqueInput[]
  }

  export type CompanyUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<CompanyCreateWithoutPlanInput, CompanyUncheckedCreateWithoutPlanInput> | CompanyCreateWithoutPlanInput[] | CompanyUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: CompanyCreateOrConnectWithoutPlanInput | CompanyCreateOrConnectWithoutPlanInput[]
    createMany?: CompanyCreateManyPlanInputEnvelope
    connect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
  }

  export type BillingSubscriptionUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<BillingSubscriptionCreateWithoutPlanInput, BillingSubscriptionUncheckedCreateWithoutPlanInput> | BillingSubscriptionCreateWithoutPlanInput[] | BillingSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BillingSubscriptionCreateOrConnectWithoutPlanInput | BillingSubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: BillingSubscriptionCreateManyPlanInputEnvelope
    connect?: BillingSubscriptionWhereUniqueInput | BillingSubscriptionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumPlanTypeFieldUpdateOperationsInput = {
    set?: $Enums.PlanType
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CompanyUpdateManyWithoutPlanNestedInput = {
    create?: XOR<CompanyCreateWithoutPlanInput, CompanyUncheckedCreateWithoutPlanInput> | CompanyCreateWithoutPlanInput[] | CompanyUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: CompanyCreateOrConnectWithoutPlanInput | CompanyCreateOrConnectWithoutPlanInput[]
    upsert?: CompanyUpsertWithWhereUniqueWithoutPlanInput | CompanyUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: CompanyCreateManyPlanInputEnvelope
    set?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    disconnect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    delete?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    connect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    update?: CompanyUpdateWithWhereUniqueWithoutPlanInput | CompanyUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: CompanyUpdateManyWithWhereWithoutPlanInput | CompanyUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: CompanyScalarWhereInput | CompanyScalarWhereInput[]
  }

  export type BillingSubscriptionUpdateManyWithoutPlanNestedInput = {
    create?: XOR<BillingSubscriptionCreateWithoutPlanInput, BillingSubscriptionUncheckedCreateWithoutPlanInput> | BillingSubscriptionCreateWithoutPlanInput[] | BillingSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BillingSubscriptionCreateOrConnectWithoutPlanInput | BillingSubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: BillingSubscriptionUpsertWithWhereUniqueWithoutPlanInput | BillingSubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: BillingSubscriptionCreateManyPlanInputEnvelope
    set?: BillingSubscriptionWhereUniqueInput | BillingSubscriptionWhereUniqueInput[]
    disconnect?: BillingSubscriptionWhereUniqueInput | BillingSubscriptionWhereUniqueInput[]
    delete?: BillingSubscriptionWhereUniqueInput | BillingSubscriptionWhereUniqueInput[]
    connect?: BillingSubscriptionWhereUniqueInput | BillingSubscriptionWhereUniqueInput[]
    update?: BillingSubscriptionUpdateWithWhereUniqueWithoutPlanInput | BillingSubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: BillingSubscriptionUpdateManyWithWhereWithoutPlanInput | BillingSubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: BillingSubscriptionScalarWhereInput | BillingSubscriptionScalarWhereInput[]
  }

  export type CompanyUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<CompanyCreateWithoutPlanInput, CompanyUncheckedCreateWithoutPlanInput> | CompanyCreateWithoutPlanInput[] | CompanyUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: CompanyCreateOrConnectWithoutPlanInput | CompanyCreateOrConnectWithoutPlanInput[]
    upsert?: CompanyUpsertWithWhereUniqueWithoutPlanInput | CompanyUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: CompanyCreateManyPlanInputEnvelope
    set?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    disconnect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    delete?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    connect?: CompanyWhereUniqueInput | CompanyWhereUniqueInput[]
    update?: CompanyUpdateWithWhereUniqueWithoutPlanInput | CompanyUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: CompanyUpdateManyWithWhereWithoutPlanInput | CompanyUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: CompanyScalarWhereInput | CompanyScalarWhereInput[]
  }

  export type BillingSubscriptionUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<BillingSubscriptionCreateWithoutPlanInput, BillingSubscriptionUncheckedCreateWithoutPlanInput> | BillingSubscriptionCreateWithoutPlanInput[] | BillingSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: BillingSubscriptionCreateOrConnectWithoutPlanInput | BillingSubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: BillingSubscriptionUpsertWithWhereUniqueWithoutPlanInput | BillingSubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: BillingSubscriptionCreateManyPlanInputEnvelope
    set?: BillingSubscriptionWhereUniqueInput | BillingSubscriptionWhereUniqueInput[]
    disconnect?: BillingSubscriptionWhereUniqueInput | BillingSubscriptionWhereUniqueInput[]
    delete?: BillingSubscriptionWhereUniqueInput | BillingSubscriptionWhereUniqueInput[]
    connect?: BillingSubscriptionWhereUniqueInput | BillingSubscriptionWhereUniqueInput[]
    update?: BillingSubscriptionUpdateWithWhereUniqueWithoutPlanInput | BillingSubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: BillingSubscriptionUpdateManyWithWhereWithoutPlanInput | BillingSubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: BillingSubscriptionScalarWhereInput | BillingSubscriptionScalarWhereInput[]
  }

  export type EnumPaymentProviderFieldUpdateOperationsInput = {
    set?: $Enums.PaymentProvider
  }

  export type EnumPaymentEnvironmentFieldUpdateOperationsInput = {
    set?: $Enums.PaymentEnvironment
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type CompanyCreatefeaturesInput = {
    set: string[]
  }

  export type PlanCreateNestedOneWithoutCompaniesInput = {
    create?: XOR<PlanCreateWithoutCompaniesInput, PlanUncheckedCreateWithoutCompaniesInput>
    connectOrCreate?: PlanCreateOrConnectWithoutCompaniesInput
    connect?: PlanWhereUniqueInput
  }

  export type SubscriptionCreateNestedManyWithoutCompanyInput = {
    create?: XOR<SubscriptionCreateWithoutCompanyInput, SubscriptionUncheckedCreateWithoutCompanyInput> | SubscriptionCreateWithoutCompanyInput[] | SubscriptionUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutCompanyInput | SubscriptionCreateOrConnectWithoutCompanyInput[]
    createMany?: SubscriptionCreateManyCompanyInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type MasterAuditLogCreateNestedManyWithoutCompanyInput = {
    create?: XOR<MasterAuditLogCreateWithoutCompanyInput, MasterAuditLogUncheckedCreateWithoutCompanyInput> | MasterAuditLogCreateWithoutCompanyInput[] | MasterAuditLogUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: MasterAuditLogCreateOrConnectWithoutCompanyInput | MasterAuditLogCreateOrConnectWithoutCompanyInput[]
    createMany?: MasterAuditLogCreateManyCompanyInputEnvelope
    connect?: MasterAuditLogWhereUniqueInput | MasterAuditLogWhereUniqueInput[]
  }

  export type BillingCustomerCreateNestedOneWithoutCompanyInput = {
    create?: XOR<BillingCustomerCreateWithoutCompanyInput, BillingCustomerUncheckedCreateWithoutCompanyInput>
    connectOrCreate?: BillingCustomerCreateOrConnectWithoutCompanyInput
    connect?: BillingCustomerWhereUniqueInput
  }

  export type AdminNotificationCreateNestedManyWithoutCompanyInput = {
    create?: XOR<AdminNotificationCreateWithoutCompanyInput, AdminNotificationUncheckedCreateWithoutCompanyInput> | AdminNotificationCreateWithoutCompanyInput[] | AdminNotificationUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: AdminNotificationCreateOrConnectWithoutCompanyInput | AdminNotificationCreateOrConnectWithoutCompanyInput[]
    createMany?: AdminNotificationCreateManyCompanyInputEnvelope
    connect?: AdminNotificationWhereUniqueInput | AdminNotificationWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<SubscriptionCreateWithoutCompanyInput, SubscriptionUncheckedCreateWithoutCompanyInput> | SubscriptionCreateWithoutCompanyInput[] | SubscriptionUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutCompanyInput | SubscriptionCreateOrConnectWithoutCompanyInput[]
    createMany?: SubscriptionCreateManyCompanyInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type MasterAuditLogUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<MasterAuditLogCreateWithoutCompanyInput, MasterAuditLogUncheckedCreateWithoutCompanyInput> | MasterAuditLogCreateWithoutCompanyInput[] | MasterAuditLogUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: MasterAuditLogCreateOrConnectWithoutCompanyInput | MasterAuditLogCreateOrConnectWithoutCompanyInput[]
    createMany?: MasterAuditLogCreateManyCompanyInputEnvelope
    connect?: MasterAuditLogWhereUniqueInput | MasterAuditLogWhereUniqueInput[]
  }

  export type BillingCustomerUncheckedCreateNestedOneWithoutCompanyInput = {
    create?: XOR<BillingCustomerCreateWithoutCompanyInput, BillingCustomerUncheckedCreateWithoutCompanyInput>
    connectOrCreate?: BillingCustomerCreateOrConnectWithoutCompanyInput
    connect?: BillingCustomerWhereUniqueInput
  }

  export type AdminNotificationUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<AdminNotificationCreateWithoutCompanyInput, AdminNotificationUncheckedCreateWithoutCompanyInput> | AdminNotificationCreateWithoutCompanyInput[] | AdminNotificationUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: AdminNotificationCreateOrConnectWithoutCompanyInput | AdminNotificationCreateOrConnectWithoutCompanyInput[]
    createMany?: AdminNotificationCreateManyCompanyInputEnvelope
    connect?: AdminNotificationWhereUniqueInput | AdminNotificationWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type CompanyUpdatefeaturesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PlanUpdateOneRequiredWithoutCompaniesNestedInput = {
    create?: XOR<PlanCreateWithoutCompaniesInput, PlanUncheckedCreateWithoutCompaniesInput>
    connectOrCreate?: PlanCreateOrConnectWithoutCompaniesInput
    upsert?: PlanUpsertWithoutCompaniesInput
    connect?: PlanWhereUniqueInput
    update?: XOR<XOR<PlanUpdateToOneWithWhereWithoutCompaniesInput, PlanUpdateWithoutCompaniesInput>, PlanUncheckedUpdateWithoutCompaniesInput>
  }

  export type SubscriptionUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<SubscriptionCreateWithoutCompanyInput, SubscriptionUncheckedCreateWithoutCompanyInput> | SubscriptionCreateWithoutCompanyInput[] | SubscriptionUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutCompanyInput | SubscriptionCreateOrConnectWithoutCompanyInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutCompanyInput | SubscriptionUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: SubscriptionCreateManyCompanyInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutCompanyInput | SubscriptionUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutCompanyInput | SubscriptionUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type MasterAuditLogUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<MasterAuditLogCreateWithoutCompanyInput, MasterAuditLogUncheckedCreateWithoutCompanyInput> | MasterAuditLogCreateWithoutCompanyInput[] | MasterAuditLogUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: MasterAuditLogCreateOrConnectWithoutCompanyInput | MasterAuditLogCreateOrConnectWithoutCompanyInput[]
    upsert?: MasterAuditLogUpsertWithWhereUniqueWithoutCompanyInput | MasterAuditLogUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: MasterAuditLogCreateManyCompanyInputEnvelope
    set?: MasterAuditLogWhereUniqueInput | MasterAuditLogWhereUniqueInput[]
    disconnect?: MasterAuditLogWhereUniqueInput | MasterAuditLogWhereUniqueInput[]
    delete?: MasterAuditLogWhereUniqueInput | MasterAuditLogWhereUniqueInput[]
    connect?: MasterAuditLogWhereUniqueInput | MasterAuditLogWhereUniqueInput[]
    update?: MasterAuditLogUpdateWithWhereUniqueWithoutCompanyInput | MasterAuditLogUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: MasterAuditLogUpdateManyWithWhereWithoutCompanyInput | MasterAuditLogUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: MasterAuditLogScalarWhereInput | MasterAuditLogScalarWhereInput[]
  }

  export type BillingCustomerUpdateOneWithoutCompanyNestedInput = {
    create?: XOR<BillingCustomerCreateWithoutCompanyInput, BillingCustomerUncheckedCreateWithoutCompanyInput>
    connectOrCreate?: BillingCustomerCreateOrConnectWithoutCompanyInput
    upsert?: BillingCustomerUpsertWithoutCompanyInput
    disconnect?: BillingCustomerWhereInput | boolean
    delete?: BillingCustomerWhereInput | boolean
    connect?: BillingCustomerWhereUniqueInput
    update?: XOR<XOR<BillingCustomerUpdateToOneWithWhereWithoutCompanyInput, BillingCustomerUpdateWithoutCompanyInput>, BillingCustomerUncheckedUpdateWithoutCompanyInput>
  }

  export type AdminNotificationUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<AdminNotificationCreateWithoutCompanyInput, AdminNotificationUncheckedCreateWithoutCompanyInput> | AdminNotificationCreateWithoutCompanyInput[] | AdminNotificationUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: AdminNotificationCreateOrConnectWithoutCompanyInput | AdminNotificationCreateOrConnectWithoutCompanyInput[]
    upsert?: AdminNotificationUpsertWithWhereUniqueWithoutCompanyInput | AdminNotificationUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: AdminNotificationCreateManyCompanyInputEnvelope
    set?: AdminNotificationWhereUniqueInput | AdminNotificationWhereUniqueInput[]
    disconnect?: AdminNotificationWhereUniqueInput | AdminNotificationWhereUniqueInput[]
    delete?: AdminNotificationWhereUniqueInput | AdminNotificationWhereUniqueInput[]
    connect?: AdminNotificationWhereUniqueInput | AdminNotificationWhereUniqueInput[]
    update?: AdminNotificationUpdateWithWhereUniqueWithoutCompanyInput | AdminNotificationUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: AdminNotificationUpdateManyWithWhereWithoutCompanyInput | AdminNotificationUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: AdminNotificationScalarWhereInput | AdminNotificationScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<SubscriptionCreateWithoutCompanyInput, SubscriptionUncheckedCreateWithoutCompanyInput> | SubscriptionCreateWithoutCompanyInput[] | SubscriptionUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutCompanyInput | SubscriptionCreateOrConnectWithoutCompanyInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutCompanyInput | SubscriptionUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: SubscriptionCreateManyCompanyInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutCompanyInput | SubscriptionUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutCompanyInput | SubscriptionUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type MasterAuditLogUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<MasterAuditLogCreateWithoutCompanyInput, MasterAuditLogUncheckedCreateWithoutCompanyInput> | MasterAuditLogCreateWithoutCompanyInput[] | MasterAuditLogUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: MasterAuditLogCreateOrConnectWithoutCompanyInput | MasterAuditLogCreateOrConnectWithoutCompanyInput[]
    upsert?: MasterAuditLogUpsertWithWhereUniqueWithoutCompanyInput | MasterAuditLogUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: MasterAuditLogCreateManyCompanyInputEnvelope
    set?: MasterAuditLogWhereUniqueInput | MasterAuditLogWhereUniqueInput[]
    disconnect?: MasterAuditLogWhereUniqueInput | MasterAuditLogWhereUniqueInput[]
    delete?: MasterAuditLogWhereUniqueInput | MasterAuditLogWhereUniqueInput[]
    connect?: MasterAuditLogWhereUniqueInput | MasterAuditLogWhereUniqueInput[]
    update?: MasterAuditLogUpdateWithWhereUniqueWithoutCompanyInput | MasterAuditLogUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: MasterAuditLogUpdateManyWithWhereWithoutCompanyInput | MasterAuditLogUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: MasterAuditLogScalarWhereInput | MasterAuditLogScalarWhereInput[]
  }

  export type BillingCustomerUncheckedUpdateOneWithoutCompanyNestedInput = {
    create?: XOR<BillingCustomerCreateWithoutCompanyInput, BillingCustomerUncheckedCreateWithoutCompanyInput>
    connectOrCreate?: BillingCustomerCreateOrConnectWithoutCompanyInput
    upsert?: BillingCustomerUpsertWithoutCompanyInput
    disconnect?: BillingCustomerWhereInput | boolean
    delete?: BillingCustomerWhereInput | boolean
    connect?: BillingCustomerWhereUniqueInput
    update?: XOR<XOR<BillingCustomerUpdateToOneWithWhereWithoutCompanyInput, BillingCustomerUpdateWithoutCompanyInput>, BillingCustomerUncheckedUpdateWithoutCompanyInput>
  }

  export type AdminNotificationUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<AdminNotificationCreateWithoutCompanyInput, AdminNotificationUncheckedCreateWithoutCompanyInput> | AdminNotificationCreateWithoutCompanyInput[] | AdminNotificationUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: AdminNotificationCreateOrConnectWithoutCompanyInput | AdminNotificationCreateOrConnectWithoutCompanyInput[]
    upsert?: AdminNotificationUpsertWithWhereUniqueWithoutCompanyInput | AdminNotificationUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: AdminNotificationCreateManyCompanyInputEnvelope
    set?: AdminNotificationWhereUniqueInput | AdminNotificationWhereUniqueInput[]
    disconnect?: AdminNotificationWhereUniqueInput | AdminNotificationWhereUniqueInput[]
    delete?: AdminNotificationWhereUniqueInput | AdminNotificationWhereUniqueInput[]
    connect?: AdminNotificationWhereUniqueInput | AdminNotificationWhereUniqueInput[]
    update?: AdminNotificationUpdateWithWhereUniqueWithoutCompanyInput | AdminNotificationUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: AdminNotificationUpdateManyWithWhereWithoutCompanyInput | AdminNotificationUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: AdminNotificationScalarWhereInput | AdminNotificationScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<CompanyCreateWithoutSubscriptionsInput, CompanyUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutSubscriptionsInput
    connect?: CompanyWhereUniqueInput
  }

  export type EnumSubscriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionStatus
  }

  export type CompanyUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<CompanyCreateWithoutSubscriptionsInput, CompanyUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutSubscriptionsInput
    upsert?: CompanyUpsertWithoutSubscriptionsInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutSubscriptionsInput, CompanyUpdateWithoutSubscriptionsInput>, CompanyUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type CompanyCreateNestedOneWithoutBillingCustomerInput = {
    create?: XOR<CompanyCreateWithoutBillingCustomerInput, CompanyUncheckedCreateWithoutBillingCustomerInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutBillingCustomerInput
    connect?: CompanyWhereUniqueInput
  }

  export type InvoiceCreateNestedManyWithoutBillingCustomerInput = {
    create?: XOR<InvoiceCreateWithoutBillingCustomerInput, InvoiceUncheckedCreateWithoutBillingCustomerInput> | InvoiceCreateWithoutBillingCustomerInput[] | InvoiceUncheckedCreateWithoutBillingCustomerInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutBillingCustomerInput | InvoiceCreateOrConnectWithoutBillingCustomerInput[]
    createMany?: InvoiceCreateManyBillingCustomerInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type BillingSubscriptionCreateNestedOneWithoutBillingCustomerInput = {
    create?: XOR<BillingSubscriptionCreateWithoutBillingCustomerInput, BillingSubscriptionUncheckedCreateWithoutBillingCustomerInput>
    connectOrCreate?: BillingSubscriptionCreateOrConnectWithoutBillingCustomerInput
    connect?: BillingSubscriptionWhereUniqueInput
  }

  export type InvoiceUncheckedCreateNestedManyWithoutBillingCustomerInput = {
    create?: XOR<InvoiceCreateWithoutBillingCustomerInput, InvoiceUncheckedCreateWithoutBillingCustomerInput> | InvoiceCreateWithoutBillingCustomerInput[] | InvoiceUncheckedCreateWithoutBillingCustomerInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutBillingCustomerInput | InvoiceCreateOrConnectWithoutBillingCustomerInput[]
    createMany?: InvoiceCreateManyBillingCustomerInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type BillingSubscriptionUncheckedCreateNestedOneWithoutBillingCustomerInput = {
    create?: XOR<BillingSubscriptionCreateWithoutBillingCustomerInput, BillingSubscriptionUncheckedCreateWithoutBillingCustomerInput>
    connectOrCreate?: BillingSubscriptionCreateOrConnectWithoutBillingCustomerInput
    connect?: BillingSubscriptionWhereUniqueInput
  }

  export type CompanyUpdateOneRequiredWithoutBillingCustomerNestedInput = {
    create?: XOR<CompanyCreateWithoutBillingCustomerInput, CompanyUncheckedCreateWithoutBillingCustomerInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutBillingCustomerInput
    upsert?: CompanyUpsertWithoutBillingCustomerInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutBillingCustomerInput, CompanyUpdateWithoutBillingCustomerInput>, CompanyUncheckedUpdateWithoutBillingCustomerInput>
  }

  export type InvoiceUpdateManyWithoutBillingCustomerNestedInput = {
    create?: XOR<InvoiceCreateWithoutBillingCustomerInput, InvoiceUncheckedCreateWithoutBillingCustomerInput> | InvoiceCreateWithoutBillingCustomerInput[] | InvoiceUncheckedCreateWithoutBillingCustomerInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutBillingCustomerInput | InvoiceCreateOrConnectWithoutBillingCustomerInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutBillingCustomerInput | InvoiceUpsertWithWhereUniqueWithoutBillingCustomerInput[]
    createMany?: InvoiceCreateManyBillingCustomerInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutBillingCustomerInput | InvoiceUpdateWithWhereUniqueWithoutBillingCustomerInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutBillingCustomerInput | InvoiceUpdateManyWithWhereWithoutBillingCustomerInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type BillingSubscriptionUpdateOneWithoutBillingCustomerNestedInput = {
    create?: XOR<BillingSubscriptionCreateWithoutBillingCustomerInput, BillingSubscriptionUncheckedCreateWithoutBillingCustomerInput>
    connectOrCreate?: BillingSubscriptionCreateOrConnectWithoutBillingCustomerInput
    upsert?: BillingSubscriptionUpsertWithoutBillingCustomerInput
    disconnect?: BillingSubscriptionWhereInput | boolean
    delete?: BillingSubscriptionWhereInput | boolean
    connect?: BillingSubscriptionWhereUniqueInput
    update?: XOR<XOR<BillingSubscriptionUpdateToOneWithWhereWithoutBillingCustomerInput, BillingSubscriptionUpdateWithoutBillingCustomerInput>, BillingSubscriptionUncheckedUpdateWithoutBillingCustomerInput>
  }

  export type InvoiceUncheckedUpdateManyWithoutBillingCustomerNestedInput = {
    create?: XOR<InvoiceCreateWithoutBillingCustomerInput, InvoiceUncheckedCreateWithoutBillingCustomerInput> | InvoiceCreateWithoutBillingCustomerInput[] | InvoiceUncheckedCreateWithoutBillingCustomerInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutBillingCustomerInput | InvoiceCreateOrConnectWithoutBillingCustomerInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutBillingCustomerInput | InvoiceUpsertWithWhereUniqueWithoutBillingCustomerInput[]
    createMany?: InvoiceCreateManyBillingCustomerInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutBillingCustomerInput | InvoiceUpdateWithWhereUniqueWithoutBillingCustomerInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutBillingCustomerInput | InvoiceUpdateManyWithWhereWithoutBillingCustomerInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type BillingSubscriptionUncheckedUpdateOneWithoutBillingCustomerNestedInput = {
    create?: XOR<BillingSubscriptionCreateWithoutBillingCustomerInput, BillingSubscriptionUncheckedCreateWithoutBillingCustomerInput>
    connectOrCreate?: BillingSubscriptionCreateOrConnectWithoutBillingCustomerInput
    upsert?: BillingSubscriptionUpsertWithoutBillingCustomerInput
    disconnect?: BillingSubscriptionWhereInput | boolean
    delete?: BillingSubscriptionWhereInput | boolean
    connect?: BillingSubscriptionWhereUniqueInput
    update?: XOR<XOR<BillingSubscriptionUpdateToOneWithWhereWithoutBillingCustomerInput, BillingSubscriptionUpdateWithoutBillingCustomerInput>, BillingSubscriptionUncheckedUpdateWithoutBillingCustomerInput>
  }

  export type BillingCustomerCreateNestedOneWithoutBillingSubscriptionInput = {
    create?: XOR<BillingCustomerCreateWithoutBillingSubscriptionInput, BillingCustomerUncheckedCreateWithoutBillingSubscriptionInput>
    connectOrCreate?: BillingCustomerCreateOrConnectWithoutBillingSubscriptionInput
    connect?: BillingCustomerWhereUniqueInput
  }

  export type PlanCreateNestedOneWithoutBillingSubscriptionsInput = {
    create?: XOR<PlanCreateWithoutBillingSubscriptionsInput, PlanUncheckedCreateWithoutBillingSubscriptionsInput>
    connectOrCreate?: PlanCreateOrConnectWithoutBillingSubscriptionsInput
    connect?: PlanWhereUniqueInput
  }

  export type EnumBillingTypeFieldUpdateOperationsInput = {
    set?: $Enums.BillingType
  }

  export type EnumBillingCycleFieldUpdateOperationsInput = {
    set?: $Enums.BillingCycle
  }

  export type EnumBillingSubscriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.BillingSubscriptionStatus
  }

  export type BillingCustomerUpdateOneRequiredWithoutBillingSubscriptionNestedInput = {
    create?: XOR<BillingCustomerCreateWithoutBillingSubscriptionInput, BillingCustomerUncheckedCreateWithoutBillingSubscriptionInput>
    connectOrCreate?: BillingCustomerCreateOrConnectWithoutBillingSubscriptionInput
    upsert?: BillingCustomerUpsertWithoutBillingSubscriptionInput
    connect?: BillingCustomerWhereUniqueInput
    update?: XOR<XOR<BillingCustomerUpdateToOneWithWhereWithoutBillingSubscriptionInput, BillingCustomerUpdateWithoutBillingSubscriptionInput>, BillingCustomerUncheckedUpdateWithoutBillingSubscriptionInput>
  }

  export type PlanUpdateOneRequiredWithoutBillingSubscriptionsNestedInput = {
    create?: XOR<PlanCreateWithoutBillingSubscriptionsInput, PlanUncheckedCreateWithoutBillingSubscriptionsInput>
    connectOrCreate?: PlanCreateOrConnectWithoutBillingSubscriptionsInput
    upsert?: PlanUpsertWithoutBillingSubscriptionsInput
    connect?: PlanWhereUniqueInput
    update?: XOR<XOR<PlanUpdateToOneWithWhereWithoutBillingSubscriptionsInput, PlanUpdateWithoutBillingSubscriptionsInput>, PlanUncheckedUpdateWithoutBillingSubscriptionsInput>
  }

  export type BillingCustomerCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<BillingCustomerCreateWithoutInvoicesInput, BillingCustomerUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: BillingCustomerCreateOrConnectWithoutInvoicesInput
    connect?: BillingCustomerWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumInvoiceStatusFieldUpdateOperationsInput = {
    set?: $Enums.InvoiceStatus
  }

  export type BillingCustomerUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<BillingCustomerCreateWithoutInvoicesInput, BillingCustomerUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: BillingCustomerCreateOrConnectWithoutInvoicesInput
    upsert?: BillingCustomerUpsertWithoutInvoicesInput
    connect?: BillingCustomerWhereUniqueInput
    update?: XOR<XOR<BillingCustomerUpdateToOneWithWhereWithoutInvoicesInput, BillingCustomerUpdateWithoutInvoicesInput>, BillingCustomerUncheckedUpdateWithoutInvoicesInput>
  }

  export type CompanyCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<CompanyCreateWithoutNotificationsInput, CompanyUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutNotificationsInput
    connect?: CompanyWhereUniqueInput
  }

  export type EnumAdminNotificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.AdminNotificationType
  }

  export type CompanyUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<CompanyCreateWithoutNotificationsInput, CompanyUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutNotificationsInput
    upsert?: CompanyUpsertWithoutNotificationsInput
    disconnect?: CompanyWhereInput | boolean
    delete?: CompanyWhereInput | boolean
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutNotificationsInput, CompanyUpdateWithoutNotificationsInput>, CompanyUncheckedUpdateWithoutNotificationsInput>
  }

  export type CompanyCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<CompanyCreateWithoutAuditLogsInput, CompanyUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutAuditLogsInput
    connect?: CompanyWhereUniqueInput
  }

  export type CompanyUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<CompanyCreateWithoutAuditLogsInput, CompanyUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutAuditLogsInput
    upsert?: CompanyUpsertWithoutAuditLogsInput
    disconnect?: CompanyWhereInput | boolean
    delete?: CompanyWhereInput | boolean
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutAuditLogsInput, CompanyUpdateWithoutAuditLogsInput>, CompanyUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumPlanTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeFilter<$PrismaModel> | $Enums.PlanType
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel> | $Enums.PlanType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanTypeFilter<$PrismaModel>
    _max?: NestedEnumPlanTypeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumPaymentProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderFilter<$PrismaModel> | $Enums.PaymentProvider
  }

  export type NestedEnumPaymentEnvironmentFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentEnvironment | EnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentEnvironment[] | ListEnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentEnvironment[] | ListEnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentEnvironmentFilter<$PrismaModel> | $Enums.PaymentEnvironment
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumPaymentProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentProvider | EnumPaymentProviderFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentProvider[] | ListEnumPaymentProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentProviderWithAggregatesFilter<$PrismaModel> | $Enums.PaymentProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentProviderFilter<$PrismaModel>
    _max?: NestedEnumPaymentProviderFilter<$PrismaModel>
  }

  export type NestedEnumPaymentEnvironmentWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentEnvironment | EnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentEnvironment[] | ListEnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentEnvironment[] | ListEnumPaymentEnvironmentFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentEnvironmentWithAggregatesFilter<$PrismaModel> | $Enums.PaymentEnvironment
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentEnvironmentFilter<$PrismaModel>
    _max?: NestedEnumPaymentEnvironmentFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type NestedEnumBillingTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingType | EnumBillingTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BillingType[] | ListEnumBillingTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingType[] | ListEnumBillingTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingTypeFilter<$PrismaModel> | $Enums.BillingType
  }

  export type NestedEnumBillingCycleFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingCycle | EnumBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingCycleFilter<$PrismaModel> | $Enums.BillingCycle
  }

  export type NestedEnumBillingSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingSubscriptionStatus | EnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingSubscriptionStatus[] | ListEnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingSubscriptionStatus[] | ListEnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingSubscriptionStatusFilter<$PrismaModel> | $Enums.BillingSubscriptionStatus
  }

  export type NestedEnumBillingTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingType | EnumBillingTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BillingType[] | ListEnumBillingTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingType[] | ListEnumBillingTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingTypeWithAggregatesFilter<$PrismaModel> | $Enums.BillingType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingTypeFilter<$PrismaModel>
    _max?: NestedEnumBillingTypeFilter<$PrismaModel>
  }

  export type NestedEnumBillingCycleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingCycle | EnumBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingCycle[] | ListEnumBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingCycleWithAggregatesFilter<$PrismaModel> | $Enums.BillingCycle
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingCycleFilter<$PrismaModel>
    _max?: NestedEnumBillingCycleFilter<$PrismaModel>
  }

  export type NestedEnumBillingSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingSubscriptionStatus | EnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BillingSubscriptionStatus[] | ListEnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingSubscriptionStatus[] | ListEnumBillingSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.BillingSubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumBillingSubscriptionStatusFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusFilter<$PrismaModel> | $Enums.InvoiceStatus
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumInvoiceStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumAdminNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminNotificationType | EnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AdminNotificationType[] | ListEnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminNotificationType[] | ListEnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminNotificationTypeFilter<$PrismaModel> | $Enums.AdminNotificationType
  }

  export type NestedEnumAdminNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminNotificationType | EnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AdminNotificationType[] | ListEnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminNotificationType[] | ListEnumAdminNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.AdminNotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAdminNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumAdminNotificationTypeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type CompanyCreateWithoutPlanInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionCreateNestedManyWithoutCompanyInput
    auditLogs?: MasterAuditLogCreateNestedManyWithoutCompanyInput
    billingCustomer?: BillingCustomerCreateNestedOneWithoutCompanyInput
    notifications?: AdminNotificationCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutPlanInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutCompanyInput
    auditLogs?: MasterAuditLogUncheckedCreateNestedManyWithoutCompanyInput
    billingCustomer?: BillingCustomerUncheckedCreateNestedOneWithoutCompanyInput
    notifications?: AdminNotificationUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutPlanInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutPlanInput, CompanyUncheckedCreateWithoutPlanInput>
  }

  export type CompanyCreateManyPlanInputEnvelope = {
    data: CompanyCreateManyPlanInput | CompanyCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type BillingSubscriptionCreateWithoutPlanInput = {
    id?: string
    asaasSubscriptionId: string
    billingType: $Enums.BillingType
    value: Decimal | DecimalJsLike | number | string
    nextDueDate: Date | string
    cycle?: $Enums.BillingCycle
    status?: $Enums.BillingSubscriptionStatus
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    billingCustomer: BillingCustomerCreateNestedOneWithoutBillingSubscriptionInput
  }

  export type BillingSubscriptionUncheckedCreateWithoutPlanInput = {
    id?: string
    billingCustomerId: string
    asaasSubscriptionId: string
    billingType: $Enums.BillingType
    value: Decimal | DecimalJsLike | number | string
    nextDueDate: Date | string
    cycle?: $Enums.BillingCycle
    status?: $Enums.BillingSubscriptionStatus
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingSubscriptionCreateOrConnectWithoutPlanInput = {
    where: BillingSubscriptionWhereUniqueInput
    create: XOR<BillingSubscriptionCreateWithoutPlanInput, BillingSubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type BillingSubscriptionCreateManyPlanInputEnvelope = {
    data: BillingSubscriptionCreateManyPlanInput | BillingSubscriptionCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type CompanyUpsertWithWhereUniqueWithoutPlanInput = {
    where: CompanyWhereUniqueInput
    update: XOR<CompanyUpdateWithoutPlanInput, CompanyUncheckedUpdateWithoutPlanInput>
    create: XOR<CompanyCreateWithoutPlanInput, CompanyUncheckedCreateWithoutPlanInput>
  }

  export type CompanyUpdateWithWhereUniqueWithoutPlanInput = {
    where: CompanyWhereUniqueInput
    data: XOR<CompanyUpdateWithoutPlanInput, CompanyUncheckedUpdateWithoutPlanInput>
  }

  export type CompanyUpdateManyWithWhereWithoutPlanInput = {
    where: CompanyScalarWhereInput
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyWithoutPlanInput>
  }

  export type CompanyScalarWhereInput = {
    AND?: CompanyScalarWhereInput | CompanyScalarWhereInput[]
    OR?: CompanyScalarWhereInput[]
    NOT?: CompanyScalarWhereInput | CompanyScalarWhereInput[]
    id?: StringFilter<"Company"> | string
    name?: StringFilter<"Company"> | string
    cnpj?: StringFilter<"Company"> | string
    email?: StringFilter<"Company"> | string
    phone?: StringNullableFilter<"Company"> | string | null
    schemaName?: StringFilter<"Company"> | string
    planId?: StringFilter<"Company"> | string
    isActive?: BoolFilter<"Company"> | boolean
    trialEndsAt?: DateTimeNullableFilter<"Company"> | Date | string | null
    features?: StringNullableListFilter<"Company">
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
  }

  export type BillingSubscriptionUpsertWithWhereUniqueWithoutPlanInput = {
    where: BillingSubscriptionWhereUniqueInput
    update: XOR<BillingSubscriptionUpdateWithoutPlanInput, BillingSubscriptionUncheckedUpdateWithoutPlanInput>
    create: XOR<BillingSubscriptionCreateWithoutPlanInput, BillingSubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type BillingSubscriptionUpdateWithWhereUniqueWithoutPlanInput = {
    where: BillingSubscriptionWhereUniqueInput
    data: XOR<BillingSubscriptionUpdateWithoutPlanInput, BillingSubscriptionUncheckedUpdateWithoutPlanInput>
  }

  export type BillingSubscriptionUpdateManyWithWhereWithoutPlanInput = {
    where: BillingSubscriptionScalarWhereInput
    data: XOR<BillingSubscriptionUpdateManyMutationInput, BillingSubscriptionUncheckedUpdateManyWithoutPlanInput>
  }

  export type BillingSubscriptionScalarWhereInput = {
    AND?: BillingSubscriptionScalarWhereInput | BillingSubscriptionScalarWhereInput[]
    OR?: BillingSubscriptionScalarWhereInput[]
    NOT?: BillingSubscriptionScalarWhereInput | BillingSubscriptionScalarWhereInput[]
    id?: StringFilter<"BillingSubscription"> | string
    billingCustomerId?: StringFilter<"BillingSubscription"> | string
    asaasSubscriptionId?: StringFilter<"BillingSubscription"> | string
    planId?: StringFilter<"BillingSubscription"> | string
    billingType?: EnumBillingTypeFilter<"BillingSubscription"> | $Enums.BillingType
    value?: DecimalFilter<"BillingSubscription"> | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFilter<"BillingSubscription"> | Date | string
    cycle?: EnumBillingCycleFilter<"BillingSubscription"> | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFilter<"BillingSubscription"> | $Enums.BillingSubscriptionStatus
    description?: StringNullableFilter<"BillingSubscription"> | string | null
    externalReference?: StringNullableFilter<"BillingSubscription"> | string | null
    createdAt?: DateTimeFilter<"BillingSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"BillingSubscription"> | Date | string
  }

  export type PlanCreateWithoutCompaniesInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    maxVehicles: number
    maxDrivers: number
    maxUsers: number
    maxBranches: number
    storageGb: number
    priceMonthly: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    createdAt?: Date | string
    billingSubscriptions?: BillingSubscriptionCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateWithoutCompaniesInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    maxVehicles: number
    maxDrivers: number
    maxUsers: number
    maxBranches: number
    storageGb: number
    priceMonthly: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    createdAt?: Date | string
    billingSubscriptions?: BillingSubscriptionUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanCreateOrConnectWithoutCompaniesInput = {
    where: PlanWhereUniqueInput
    create: XOR<PlanCreateWithoutCompaniesInput, PlanUncheckedCreateWithoutCompaniesInput>
  }

  export type SubscriptionCreateWithoutCompanyInput = {
    id?: string
    planId: string
    status: $Enums.SubscriptionStatus
    startsAt: Date | string
    endsAt?: Date | string | null
    cancelledAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionUncheckedCreateWithoutCompanyInput = {
    id?: string
    planId: string
    status: $Enums.SubscriptionStatus
    startsAt: Date | string
    endsAt?: Date | string | null
    cancelledAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutCompanyInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutCompanyInput, SubscriptionUncheckedCreateWithoutCompanyInput>
  }

  export type SubscriptionCreateManyCompanyInputEnvelope = {
    data: SubscriptionCreateManyCompanyInput | SubscriptionCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type MasterAuditLogCreateWithoutCompanyInput = {
    id?: string
    action: string
    entityType: string
    entityId?: string | null
    userId?: string | null
    userEmail?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MasterAuditLogUncheckedCreateWithoutCompanyInput = {
    id?: string
    action: string
    entityType: string
    entityId?: string | null
    userId?: string | null
    userEmail?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MasterAuditLogCreateOrConnectWithoutCompanyInput = {
    where: MasterAuditLogWhereUniqueInput
    create: XOR<MasterAuditLogCreateWithoutCompanyInput, MasterAuditLogUncheckedCreateWithoutCompanyInput>
  }

  export type MasterAuditLogCreateManyCompanyInputEnvelope = {
    data: MasterAuditLogCreateManyCompanyInput | MasterAuditLogCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type BillingCustomerCreateWithoutCompanyInput = {
    id?: string
    asaasCustomerId: string
    name: string
    cpfCnpj: string
    email: string
    phone?: string | null
    postalCode?: string | null
    address?: string | null
    addressNumber?: string | null
    complement?: string | null
    province?: string | null
    city?: string | null
    state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceCreateNestedManyWithoutBillingCustomerInput
    billingSubscription?: BillingSubscriptionCreateNestedOneWithoutBillingCustomerInput
  }

  export type BillingCustomerUncheckedCreateWithoutCompanyInput = {
    id?: string
    asaasCustomerId: string
    name: string
    cpfCnpj: string
    email: string
    phone?: string | null
    postalCode?: string | null
    address?: string | null
    addressNumber?: string | null
    complement?: string | null
    province?: string | null
    city?: string | null
    state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutBillingCustomerInput
    billingSubscription?: BillingSubscriptionUncheckedCreateNestedOneWithoutBillingCustomerInput
  }

  export type BillingCustomerCreateOrConnectWithoutCompanyInput = {
    where: BillingCustomerWhereUniqueInput
    create: XOR<BillingCustomerCreateWithoutCompanyInput, BillingCustomerUncheckedCreateWithoutCompanyInput>
  }

  export type AdminNotificationCreateWithoutCompanyInput = {
    id?: string
    type: $Enums.AdminNotificationType
    title: string
    message: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    createdAt?: Date | string
  }

  export type AdminNotificationUncheckedCreateWithoutCompanyInput = {
    id?: string
    type: $Enums.AdminNotificationType
    title: string
    message: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    createdAt?: Date | string
  }

  export type AdminNotificationCreateOrConnectWithoutCompanyInput = {
    where: AdminNotificationWhereUniqueInput
    create: XOR<AdminNotificationCreateWithoutCompanyInput, AdminNotificationUncheckedCreateWithoutCompanyInput>
  }

  export type AdminNotificationCreateManyCompanyInputEnvelope = {
    data: AdminNotificationCreateManyCompanyInput | AdminNotificationCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type PlanUpsertWithoutCompaniesInput = {
    update: XOR<PlanUpdateWithoutCompaniesInput, PlanUncheckedUpdateWithoutCompaniesInput>
    create: XOR<PlanCreateWithoutCompaniesInput, PlanUncheckedCreateWithoutCompaniesInput>
    where?: PlanWhereInput
  }

  export type PlanUpdateToOneWithWhereWithoutCompaniesInput = {
    where?: PlanWhereInput
    data: XOR<PlanUpdateWithoutCompaniesInput, PlanUncheckedUpdateWithoutCompaniesInput>
  }

  export type PlanUpdateWithoutCompaniesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    maxVehicles?: IntFieldUpdateOperationsInput | number
    maxDrivers?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxBranches?: IntFieldUpdateOperationsInput | number
    storageGb?: IntFieldUpdateOperationsInput | number
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingSubscriptions?: BillingSubscriptionUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateWithoutCompaniesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    maxVehicles?: IntFieldUpdateOperationsInput | number
    maxDrivers?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxBranches?: IntFieldUpdateOperationsInput | number
    storageGb?: IntFieldUpdateOperationsInput | number
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingSubscriptions?: BillingSubscriptionUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutCompanyInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutCompanyInput, SubscriptionUncheckedUpdateWithoutCompanyInput>
    create: XOR<SubscriptionCreateWithoutCompanyInput, SubscriptionUncheckedCreateWithoutCompanyInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutCompanyInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutCompanyInput, SubscriptionUncheckedUpdateWithoutCompanyInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutCompanyInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutCompanyInput>
  }

  export type SubscriptionScalarWhereInput = {
    AND?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    OR?: SubscriptionScalarWhereInput[]
    NOT?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    id?: StringFilter<"Subscription"> | string
    companyId?: StringFilter<"Subscription"> | string
    planId?: StringFilter<"Subscription"> | string
    status?: EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus
    startsAt?: DateTimeFilter<"Subscription"> | Date | string
    endsAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
  }

  export type MasterAuditLogUpsertWithWhereUniqueWithoutCompanyInput = {
    where: MasterAuditLogWhereUniqueInput
    update: XOR<MasterAuditLogUpdateWithoutCompanyInput, MasterAuditLogUncheckedUpdateWithoutCompanyInput>
    create: XOR<MasterAuditLogCreateWithoutCompanyInput, MasterAuditLogUncheckedCreateWithoutCompanyInput>
  }

  export type MasterAuditLogUpdateWithWhereUniqueWithoutCompanyInput = {
    where: MasterAuditLogWhereUniqueInput
    data: XOR<MasterAuditLogUpdateWithoutCompanyInput, MasterAuditLogUncheckedUpdateWithoutCompanyInput>
  }

  export type MasterAuditLogUpdateManyWithWhereWithoutCompanyInput = {
    where: MasterAuditLogScalarWhereInput
    data: XOR<MasterAuditLogUpdateManyMutationInput, MasterAuditLogUncheckedUpdateManyWithoutCompanyInput>
  }

  export type MasterAuditLogScalarWhereInput = {
    AND?: MasterAuditLogScalarWhereInput | MasterAuditLogScalarWhereInput[]
    OR?: MasterAuditLogScalarWhereInput[]
    NOT?: MasterAuditLogScalarWhereInput | MasterAuditLogScalarWhereInput[]
    id?: StringFilter<"MasterAuditLog"> | string
    companyId?: StringNullableFilter<"MasterAuditLog"> | string | null
    action?: StringFilter<"MasterAuditLog"> | string
    entityType?: StringFilter<"MasterAuditLog"> | string
    entityId?: StringNullableFilter<"MasterAuditLog"> | string | null
    userId?: StringNullableFilter<"MasterAuditLog"> | string | null
    userEmail?: StringNullableFilter<"MasterAuditLog"> | string | null
    ipAddress?: StringNullableFilter<"MasterAuditLog"> | string | null
    userAgent?: StringNullableFilter<"MasterAuditLog"> | string | null
    metadata?: JsonNullableFilter<"MasterAuditLog">
    createdAt?: DateTimeFilter<"MasterAuditLog"> | Date | string
  }

  export type BillingCustomerUpsertWithoutCompanyInput = {
    update: XOR<BillingCustomerUpdateWithoutCompanyInput, BillingCustomerUncheckedUpdateWithoutCompanyInput>
    create: XOR<BillingCustomerCreateWithoutCompanyInput, BillingCustomerUncheckedCreateWithoutCompanyInput>
    where?: BillingCustomerWhereInput
  }

  export type BillingCustomerUpdateToOneWithWhereWithoutCompanyInput = {
    where?: BillingCustomerWhereInput
    data: XOR<BillingCustomerUpdateWithoutCompanyInput, BillingCustomerUncheckedUpdateWithoutCompanyInput>
  }

  export type BillingCustomerUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasCustomerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cpfCnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    addressNumber?: NullableStringFieldUpdateOperationsInput | string | null
    complement?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUpdateManyWithoutBillingCustomerNestedInput
    billingSubscription?: BillingSubscriptionUpdateOneWithoutBillingCustomerNestedInput
  }

  export type BillingCustomerUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasCustomerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cpfCnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    addressNumber?: NullableStringFieldUpdateOperationsInput | string | null
    complement?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUncheckedUpdateManyWithoutBillingCustomerNestedInput
    billingSubscription?: BillingSubscriptionUncheckedUpdateOneWithoutBillingCustomerNestedInput
  }

  export type AdminNotificationUpsertWithWhereUniqueWithoutCompanyInput = {
    where: AdminNotificationWhereUniqueInput
    update: XOR<AdminNotificationUpdateWithoutCompanyInput, AdminNotificationUncheckedUpdateWithoutCompanyInput>
    create: XOR<AdminNotificationCreateWithoutCompanyInput, AdminNotificationUncheckedCreateWithoutCompanyInput>
  }

  export type AdminNotificationUpdateWithWhereUniqueWithoutCompanyInput = {
    where: AdminNotificationWhereUniqueInput
    data: XOR<AdminNotificationUpdateWithoutCompanyInput, AdminNotificationUncheckedUpdateWithoutCompanyInput>
  }

  export type AdminNotificationUpdateManyWithWhereWithoutCompanyInput = {
    where: AdminNotificationScalarWhereInput
    data: XOR<AdminNotificationUpdateManyMutationInput, AdminNotificationUncheckedUpdateManyWithoutCompanyInput>
  }

  export type AdminNotificationScalarWhereInput = {
    AND?: AdminNotificationScalarWhereInput | AdminNotificationScalarWhereInput[]
    OR?: AdminNotificationScalarWhereInput[]
    NOT?: AdminNotificationScalarWhereInput | AdminNotificationScalarWhereInput[]
    id?: StringFilter<"AdminNotification"> | string
    type?: EnumAdminNotificationTypeFilter<"AdminNotification"> | $Enums.AdminNotificationType
    title?: StringFilter<"AdminNotification"> | string
    message?: StringFilter<"AdminNotification"> | string
    companyId?: StringNullableFilter<"AdminNotification"> | string | null
    metadata?: JsonNullableFilter<"AdminNotification">
    isRead?: BoolFilter<"AdminNotification"> | boolean
    createdAt?: DateTimeFilter<"AdminNotification"> | Date | string
  }

  export type CompanyCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: PlanCreateNestedOneWithoutCompaniesInput
    auditLogs?: MasterAuditLogCreateNestedManyWithoutCompanyInput
    billingCustomer?: BillingCustomerCreateNestedOneWithoutCompanyInput
    notifications?: AdminNotificationCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    planId: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: MasterAuditLogUncheckedCreateNestedManyWithoutCompanyInput
    billingCustomer?: BillingCustomerUncheckedCreateNestedOneWithoutCompanyInput
    notifications?: AdminNotificationUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutSubscriptionsInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutSubscriptionsInput, CompanyUncheckedCreateWithoutSubscriptionsInput>
  }

  export type CompanyUpsertWithoutSubscriptionsInput = {
    update: XOR<CompanyUpdateWithoutSubscriptionsInput, CompanyUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<CompanyCreateWithoutSubscriptionsInput, CompanyUncheckedCreateWithoutSubscriptionsInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutSubscriptionsInput, CompanyUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type CompanyUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneRequiredWithoutCompaniesNestedInput
    auditLogs?: MasterAuditLogUpdateManyWithoutCompanyNestedInput
    billingCustomer?: BillingCustomerUpdateOneWithoutCompanyNestedInput
    notifications?: AdminNotificationUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: MasterAuditLogUncheckedUpdateManyWithoutCompanyNestedInput
    billingCustomer?: BillingCustomerUncheckedUpdateOneWithoutCompanyNestedInput
    notifications?: AdminNotificationUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateWithoutBillingCustomerInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: PlanCreateNestedOneWithoutCompaniesInput
    subscriptions?: SubscriptionCreateNestedManyWithoutCompanyInput
    auditLogs?: MasterAuditLogCreateNestedManyWithoutCompanyInput
    notifications?: AdminNotificationCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutBillingCustomerInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    planId: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutCompanyInput
    auditLogs?: MasterAuditLogUncheckedCreateNestedManyWithoutCompanyInput
    notifications?: AdminNotificationUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutBillingCustomerInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutBillingCustomerInput, CompanyUncheckedCreateWithoutBillingCustomerInput>
  }

  export type InvoiceCreateWithoutBillingCustomerInput = {
    id?: string
    asaasPaymentId?: string | null
    value: Decimal | DecimalJsLike | number | string
    netValue?: Decimal | DecimalJsLike | number | string | null
    billingType: $Enums.BillingType
    status?: $Enums.InvoiceStatus
    dueDate: Date | string
    paidAt?: Date | string | null
    invoiceUrl?: string | null
    bankSlipUrl?: string | null
    pixQrCode?: string | null
    pixQrCodeImage?: string | null
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceUncheckedCreateWithoutBillingCustomerInput = {
    id?: string
    asaasPaymentId?: string | null
    value: Decimal | DecimalJsLike | number | string
    netValue?: Decimal | DecimalJsLike | number | string | null
    billingType: $Enums.BillingType
    status?: $Enums.InvoiceStatus
    dueDate: Date | string
    paidAt?: Date | string | null
    invoiceUrl?: string | null
    bankSlipUrl?: string | null
    pixQrCode?: string | null
    pixQrCodeImage?: string | null
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceCreateOrConnectWithoutBillingCustomerInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutBillingCustomerInput, InvoiceUncheckedCreateWithoutBillingCustomerInput>
  }

  export type InvoiceCreateManyBillingCustomerInputEnvelope = {
    data: InvoiceCreateManyBillingCustomerInput | InvoiceCreateManyBillingCustomerInput[]
    skipDuplicates?: boolean
  }

  export type BillingSubscriptionCreateWithoutBillingCustomerInput = {
    id?: string
    asaasSubscriptionId: string
    billingType: $Enums.BillingType
    value: Decimal | DecimalJsLike | number | string
    nextDueDate: Date | string
    cycle?: $Enums.BillingCycle
    status?: $Enums.BillingSubscriptionStatus
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: PlanCreateNestedOneWithoutBillingSubscriptionsInput
  }

  export type BillingSubscriptionUncheckedCreateWithoutBillingCustomerInput = {
    id?: string
    asaasSubscriptionId: string
    planId: string
    billingType: $Enums.BillingType
    value: Decimal | DecimalJsLike | number | string
    nextDueDate: Date | string
    cycle?: $Enums.BillingCycle
    status?: $Enums.BillingSubscriptionStatus
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingSubscriptionCreateOrConnectWithoutBillingCustomerInput = {
    where: BillingSubscriptionWhereUniqueInput
    create: XOR<BillingSubscriptionCreateWithoutBillingCustomerInput, BillingSubscriptionUncheckedCreateWithoutBillingCustomerInput>
  }

  export type CompanyUpsertWithoutBillingCustomerInput = {
    update: XOR<CompanyUpdateWithoutBillingCustomerInput, CompanyUncheckedUpdateWithoutBillingCustomerInput>
    create: XOR<CompanyCreateWithoutBillingCustomerInput, CompanyUncheckedCreateWithoutBillingCustomerInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutBillingCustomerInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutBillingCustomerInput, CompanyUncheckedUpdateWithoutBillingCustomerInput>
  }

  export type CompanyUpdateWithoutBillingCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneRequiredWithoutCompaniesNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutCompanyNestedInput
    auditLogs?: MasterAuditLogUpdateManyWithoutCompanyNestedInput
    notifications?: AdminNotificationUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutBillingCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutCompanyNestedInput
    auditLogs?: MasterAuditLogUncheckedUpdateManyWithoutCompanyNestedInput
    notifications?: AdminNotificationUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type InvoiceUpsertWithWhereUniqueWithoutBillingCustomerInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutBillingCustomerInput, InvoiceUncheckedUpdateWithoutBillingCustomerInput>
    create: XOR<InvoiceCreateWithoutBillingCustomerInput, InvoiceUncheckedCreateWithoutBillingCustomerInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutBillingCustomerInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutBillingCustomerInput, InvoiceUncheckedUpdateWithoutBillingCustomerInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutBillingCustomerInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutBillingCustomerInput>
  }

  export type InvoiceScalarWhereInput = {
    AND?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    OR?: InvoiceScalarWhereInput[]
    NOT?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    id?: StringFilter<"Invoice"> | string
    billingCustomerId?: StringFilter<"Invoice"> | string
    asaasPaymentId?: StringNullableFilter<"Invoice"> | string | null
    value?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    netValue?: DecimalNullableFilter<"Invoice"> | Decimal | DecimalJsLike | number | string | null
    billingType?: EnumBillingTypeFilter<"Invoice"> | $Enums.BillingType
    status?: EnumInvoiceStatusFilter<"Invoice"> | $Enums.InvoiceStatus
    dueDate?: DateTimeFilter<"Invoice"> | Date | string
    paidAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    invoiceUrl?: StringNullableFilter<"Invoice"> | string | null
    bankSlipUrl?: StringNullableFilter<"Invoice"> | string | null
    pixQrCode?: StringNullableFilter<"Invoice"> | string | null
    pixQrCodeImage?: StringNullableFilter<"Invoice"> | string | null
    description?: StringNullableFilter<"Invoice"> | string | null
    externalReference?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
  }

  export type BillingSubscriptionUpsertWithoutBillingCustomerInput = {
    update: XOR<BillingSubscriptionUpdateWithoutBillingCustomerInput, BillingSubscriptionUncheckedUpdateWithoutBillingCustomerInput>
    create: XOR<BillingSubscriptionCreateWithoutBillingCustomerInput, BillingSubscriptionUncheckedCreateWithoutBillingCustomerInput>
    where?: BillingSubscriptionWhereInput
  }

  export type BillingSubscriptionUpdateToOneWithWhereWithoutBillingCustomerInput = {
    where?: BillingSubscriptionWhereInput
    data: XOR<BillingSubscriptionUpdateWithoutBillingCustomerInput, BillingSubscriptionUncheckedUpdateWithoutBillingCustomerInput>
  }

  export type BillingSubscriptionUpdateWithoutBillingCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasSubscriptionId?: StringFieldUpdateOperationsInput | string
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    cycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFieldUpdateOperationsInput | $Enums.BillingSubscriptionStatus
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneRequiredWithoutBillingSubscriptionsNestedInput
  }

  export type BillingSubscriptionUncheckedUpdateWithoutBillingCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasSubscriptionId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    cycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFieldUpdateOperationsInput | $Enums.BillingSubscriptionStatus
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingCustomerCreateWithoutBillingSubscriptionInput = {
    id?: string
    asaasCustomerId: string
    name: string
    cpfCnpj: string
    email: string
    phone?: string | null
    postalCode?: string | null
    address?: string | null
    addressNumber?: string | null
    complement?: string | null
    province?: string | null
    city?: string | null
    state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutBillingCustomerInput
    invoices?: InvoiceCreateNestedManyWithoutBillingCustomerInput
  }

  export type BillingCustomerUncheckedCreateWithoutBillingSubscriptionInput = {
    id?: string
    companyId: string
    asaasCustomerId: string
    name: string
    cpfCnpj: string
    email: string
    phone?: string | null
    postalCode?: string | null
    address?: string | null
    addressNumber?: string | null
    complement?: string | null
    province?: string | null
    city?: string | null
    state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoices?: InvoiceUncheckedCreateNestedManyWithoutBillingCustomerInput
  }

  export type BillingCustomerCreateOrConnectWithoutBillingSubscriptionInput = {
    where: BillingCustomerWhereUniqueInput
    create: XOR<BillingCustomerCreateWithoutBillingSubscriptionInput, BillingCustomerUncheckedCreateWithoutBillingSubscriptionInput>
  }

  export type PlanCreateWithoutBillingSubscriptionsInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    maxVehicles: number
    maxDrivers: number
    maxUsers: number
    maxBranches: number
    storageGb: number
    priceMonthly: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    createdAt?: Date | string
    companies?: CompanyCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateWithoutBillingSubscriptionsInput = {
    id?: string
    name: string
    type: $Enums.PlanType
    maxVehicles: number
    maxDrivers: number
    maxUsers: number
    maxBranches: number
    storageGb: number
    priceMonthly: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    createdAt?: Date | string
    companies?: CompanyUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanCreateOrConnectWithoutBillingSubscriptionsInput = {
    where: PlanWhereUniqueInput
    create: XOR<PlanCreateWithoutBillingSubscriptionsInput, PlanUncheckedCreateWithoutBillingSubscriptionsInput>
  }

  export type BillingCustomerUpsertWithoutBillingSubscriptionInput = {
    update: XOR<BillingCustomerUpdateWithoutBillingSubscriptionInput, BillingCustomerUncheckedUpdateWithoutBillingSubscriptionInput>
    create: XOR<BillingCustomerCreateWithoutBillingSubscriptionInput, BillingCustomerUncheckedCreateWithoutBillingSubscriptionInput>
    where?: BillingCustomerWhereInput
  }

  export type BillingCustomerUpdateToOneWithWhereWithoutBillingSubscriptionInput = {
    where?: BillingCustomerWhereInput
    data: XOR<BillingCustomerUpdateWithoutBillingSubscriptionInput, BillingCustomerUncheckedUpdateWithoutBillingSubscriptionInput>
  }

  export type BillingCustomerUpdateWithoutBillingSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasCustomerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cpfCnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    addressNumber?: NullableStringFieldUpdateOperationsInput | string | null
    complement?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutBillingCustomerNestedInput
    invoices?: InvoiceUpdateManyWithoutBillingCustomerNestedInput
  }

  export type BillingCustomerUncheckedUpdateWithoutBillingSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    asaasCustomerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cpfCnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    addressNumber?: NullableStringFieldUpdateOperationsInput | string | null
    complement?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoices?: InvoiceUncheckedUpdateManyWithoutBillingCustomerNestedInput
  }

  export type PlanUpsertWithoutBillingSubscriptionsInput = {
    update: XOR<PlanUpdateWithoutBillingSubscriptionsInput, PlanUncheckedUpdateWithoutBillingSubscriptionsInput>
    create: XOR<PlanCreateWithoutBillingSubscriptionsInput, PlanUncheckedCreateWithoutBillingSubscriptionsInput>
    where?: PlanWhereInput
  }

  export type PlanUpdateToOneWithWhereWithoutBillingSubscriptionsInput = {
    where?: PlanWhereInput
    data: XOR<PlanUpdateWithoutBillingSubscriptionsInput, PlanUncheckedUpdateWithoutBillingSubscriptionsInput>
  }

  export type PlanUpdateWithoutBillingSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    maxVehicles?: IntFieldUpdateOperationsInput | number
    maxDrivers?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxBranches?: IntFieldUpdateOperationsInput | number
    storageGb?: IntFieldUpdateOperationsInput | number
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companies?: CompanyUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateWithoutBillingSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    maxVehicles?: IntFieldUpdateOperationsInput | number
    maxDrivers?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxBranches?: IntFieldUpdateOperationsInput | number
    storageGb?: IntFieldUpdateOperationsInput | number
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companies?: CompanyUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type BillingCustomerCreateWithoutInvoicesInput = {
    id?: string
    asaasCustomerId: string
    name: string
    cpfCnpj: string
    email: string
    phone?: string | null
    postalCode?: string | null
    address?: string | null
    addressNumber?: string | null
    complement?: string | null
    province?: string | null
    city?: string | null
    state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutBillingCustomerInput
    billingSubscription?: BillingSubscriptionCreateNestedOneWithoutBillingCustomerInput
  }

  export type BillingCustomerUncheckedCreateWithoutInvoicesInput = {
    id?: string
    companyId: string
    asaasCustomerId: string
    name: string
    cpfCnpj: string
    email: string
    phone?: string | null
    postalCode?: string | null
    address?: string | null
    addressNumber?: string | null
    complement?: string | null
    province?: string | null
    city?: string | null
    state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    billingSubscription?: BillingSubscriptionUncheckedCreateNestedOneWithoutBillingCustomerInput
  }

  export type BillingCustomerCreateOrConnectWithoutInvoicesInput = {
    where: BillingCustomerWhereUniqueInput
    create: XOR<BillingCustomerCreateWithoutInvoicesInput, BillingCustomerUncheckedCreateWithoutInvoicesInput>
  }

  export type BillingCustomerUpsertWithoutInvoicesInput = {
    update: XOR<BillingCustomerUpdateWithoutInvoicesInput, BillingCustomerUncheckedUpdateWithoutInvoicesInput>
    create: XOR<BillingCustomerCreateWithoutInvoicesInput, BillingCustomerUncheckedCreateWithoutInvoicesInput>
    where?: BillingCustomerWhereInput
  }

  export type BillingCustomerUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: BillingCustomerWhereInput
    data: XOR<BillingCustomerUpdateWithoutInvoicesInput, BillingCustomerUncheckedUpdateWithoutInvoicesInput>
  }

  export type BillingCustomerUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasCustomerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cpfCnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    addressNumber?: NullableStringFieldUpdateOperationsInput | string | null
    complement?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutBillingCustomerNestedInput
    billingSubscription?: BillingSubscriptionUpdateOneWithoutBillingCustomerNestedInput
  }

  export type BillingCustomerUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    asaasCustomerId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cpfCnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    addressNumber?: NullableStringFieldUpdateOperationsInput | string | null
    complement?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingSubscription?: BillingSubscriptionUncheckedUpdateOneWithoutBillingCustomerNestedInput
  }

  export type CompanyCreateWithoutNotificationsInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: PlanCreateNestedOneWithoutCompaniesInput
    subscriptions?: SubscriptionCreateNestedManyWithoutCompanyInput
    auditLogs?: MasterAuditLogCreateNestedManyWithoutCompanyInput
    billingCustomer?: BillingCustomerCreateNestedOneWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutNotificationsInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    planId: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutCompanyInput
    auditLogs?: MasterAuditLogUncheckedCreateNestedManyWithoutCompanyInput
    billingCustomer?: BillingCustomerUncheckedCreateNestedOneWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutNotificationsInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutNotificationsInput, CompanyUncheckedCreateWithoutNotificationsInput>
  }

  export type CompanyUpsertWithoutNotificationsInput = {
    update: XOR<CompanyUpdateWithoutNotificationsInput, CompanyUncheckedUpdateWithoutNotificationsInput>
    create: XOR<CompanyCreateWithoutNotificationsInput, CompanyUncheckedCreateWithoutNotificationsInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutNotificationsInput, CompanyUncheckedUpdateWithoutNotificationsInput>
  }

  export type CompanyUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneRequiredWithoutCompaniesNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutCompanyNestedInput
    auditLogs?: MasterAuditLogUpdateManyWithoutCompanyNestedInput
    billingCustomer?: BillingCustomerUpdateOneWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutCompanyNestedInput
    auditLogs?: MasterAuditLogUncheckedUpdateManyWithoutCompanyNestedInput
    billingCustomer?: BillingCustomerUncheckedUpdateOneWithoutCompanyNestedInput
  }

  export type CompanyCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: PlanCreateNestedOneWithoutCompaniesInput
    subscriptions?: SubscriptionCreateNestedManyWithoutCompanyInput
    billingCustomer?: BillingCustomerCreateNestedOneWithoutCompanyInput
    notifications?: AdminNotificationCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    planId: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutCompanyInput
    billingCustomer?: BillingCustomerUncheckedCreateNestedOneWithoutCompanyInput
    notifications?: AdminNotificationUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutAuditLogsInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutAuditLogsInput, CompanyUncheckedCreateWithoutAuditLogsInput>
  }

  export type CompanyUpsertWithoutAuditLogsInput = {
    update: XOR<CompanyUpdateWithoutAuditLogsInput, CompanyUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<CompanyCreateWithoutAuditLogsInput, CompanyUncheckedCreateWithoutAuditLogsInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutAuditLogsInput, CompanyUncheckedUpdateWithoutAuditLogsInput>
  }

  export type CompanyUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneRequiredWithoutCompaniesNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutCompanyNestedInput
    billingCustomer?: BillingCustomerUpdateOneWithoutCompanyNestedInput
    notifications?: AdminNotificationUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutCompanyNestedInput
    billingCustomer?: BillingCustomerUncheckedUpdateOneWithoutCompanyNestedInput
    notifications?: AdminNotificationUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateManyPlanInput = {
    id?: string
    name: string
    cnpj: string
    email: string
    phone?: string | null
    schemaName: string
    isActive?: boolean
    trialEndsAt?: Date | string | null
    features?: CompanyCreatefeaturesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingSubscriptionCreateManyPlanInput = {
    id?: string
    billingCustomerId: string
    asaasSubscriptionId: string
    billingType: $Enums.BillingType
    value: Decimal | DecimalJsLike | number | string
    nextDueDate: Date | string
    cycle?: $Enums.BillingCycle
    status?: $Enums.BillingSubscriptionStatus
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompanyUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUpdateManyWithoutCompanyNestedInput
    auditLogs?: MasterAuditLogUpdateManyWithoutCompanyNestedInput
    billingCustomer?: BillingCustomerUpdateOneWithoutCompanyNestedInput
    notifications?: AdminNotificationUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutCompanyNestedInput
    auditLogs?: MasterAuditLogUncheckedUpdateManyWithoutCompanyNestedInput
    billingCustomer?: BillingCustomerUncheckedUpdateOneWithoutCompanyNestedInput
    notifications?: AdminNotificationUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    schemaName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: CompanyUpdatefeaturesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingSubscriptionUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasSubscriptionId?: StringFieldUpdateOperationsInput | string
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    cycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFieldUpdateOperationsInput | $Enums.BillingSubscriptionStatus
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingCustomer?: BillingCustomerUpdateOneRequiredWithoutBillingSubscriptionNestedInput
  }

  export type BillingSubscriptionUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    billingCustomerId?: StringFieldUpdateOperationsInput | string
    asaasSubscriptionId?: StringFieldUpdateOperationsInput | string
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    cycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFieldUpdateOperationsInput | $Enums.BillingSubscriptionStatus
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingSubscriptionUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    billingCustomerId?: StringFieldUpdateOperationsInput | string
    asaasSubscriptionId?: StringFieldUpdateOperationsInput | string
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    nextDueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    cycle?: EnumBillingCycleFieldUpdateOperationsInput | $Enums.BillingCycle
    status?: EnumBillingSubscriptionStatusFieldUpdateOperationsInput | $Enums.BillingSubscriptionStatus
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateManyCompanyInput = {
    id?: string
    planId: string
    status: $Enums.SubscriptionStatus
    startsAt: Date | string
    endsAt?: Date | string | null
    cancelledAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MasterAuditLogCreateManyCompanyInput = {
    id?: string
    action: string
    entityType: string
    entityId?: string | null
    userId?: string | null
    userEmail?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AdminNotificationCreateManyCompanyInput = {
    id?: string
    type: $Enums.AdminNotificationType
    title: string
    message: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    createdAt?: Date | string
  }

  export type SubscriptionUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterAuditLogUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterAuditLogUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterAuditLogUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminNotificationUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAdminNotificationTypeFieldUpdateOperationsInput | $Enums.AdminNotificationType
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminNotificationUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAdminNotificationTypeFieldUpdateOperationsInput | $Enums.AdminNotificationType
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminNotificationUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumAdminNotificationTypeFieldUpdateOperationsInput | $Enums.AdminNotificationType
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateManyBillingCustomerInput = {
    id?: string
    asaasPaymentId?: string | null
    value: Decimal | DecimalJsLike | number | string
    netValue?: Decimal | DecimalJsLike | number | string | null
    billingType: $Enums.BillingType
    status?: $Enums.InvoiceStatus
    dueDate: Date | string
    paidAt?: Date | string | null
    invoiceUrl?: string | null
    bankSlipUrl?: string | null
    pixQrCode?: string | null
    pixQrCodeImage?: string | null
    description?: string | null
    externalReference?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceUpdateWithoutBillingCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankSlipUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCode?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCodeImage?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateWithoutBillingCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankSlipUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCode?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCodeImage?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateManyWithoutBillingCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    asaasPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    value?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    billingType?: EnumBillingTypeFieldUpdateOperationsInput | $Enums.BillingType
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bankSlipUrl?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCode?: NullableStringFieldUpdateOperationsInput | string | null
    pixQrCodeImage?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PlanCountOutputTypeDefaultArgs instead
     */
    export type PlanCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PlanCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompanyCountOutputTypeDefaultArgs instead
     */
    export type CompanyCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompanyCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BillingCustomerCountOutputTypeDefaultArgs instead
     */
    export type BillingCustomerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BillingCustomerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PlanDefaultArgs instead
     */
    export type PlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PlanDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentGatewaySettingsDefaultArgs instead
     */
    export type PaymentGatewaySettingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentGatewaySettingsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompanyDefaultArgs instead
     */
    export type CompanyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompanyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubscriptionDefaultArgs instead
     */
    export type SubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubscriptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SuperAdminDefaultArgs instead
     */
    export type SuperAdminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SuperAdminDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BillingCustomerDefaultArgs instead
     */
    export type BillingCustomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BillingCustomerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BillingSubscriptionDefaultArgs instead
     */
    export type BillingSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BillingSubscriptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceDefaultArgs instead
     */
    export type InvoiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BillingWebhookLogDefaultArgs instead
     */
    export type BillingWebhookLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BillingWebhookLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AdminNotificationDefaultArgs instead
     */
    export type AdminNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AdminNotificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MasterAuditLogDefaultArgs instead
     */
    export type MasterAuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MasterAuditLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}