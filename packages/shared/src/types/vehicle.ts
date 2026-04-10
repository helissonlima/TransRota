export enum VehicleType {
  TRUCK = 'TRUCK',
  VAN = 'VAN',
  MOTORCYCLE = 'MOTORCYCLE',
  CAR = 'CAR',
  UTILITY = 'UTILITY',
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

export enum FuelType {
  GASOLINE = 'GASOLINE',
  ETHANOL = 'ETHANOL',
  DIESEL = 'DIESEL',
  GNV = 'GNV',
  ELECTRIC = 'ELECTRIC',
  FLEX = 'FLEX',
}

export enum OilChangeStatus {
  UP_TO_DATE = 'UP_TO_DATE',
  DUE_SOON = 'DUE_SOON',
  OVERDUE = 'OVERDUE',
}

export enum DailyKmStatus {
  OK = 'OK',
  NOK = 'NOK',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum TaxType {
  IPVA = 'IPVA',
  LICENSING = 'LICENSING',
  INSURANCE = 'INSURANCE',
  FINE = 'FINE',
  OTHER = 'OTHER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  EXEMPT = 'EXEMPT',
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  type: VehicleType;
  fuelType: FuelType;
  status: VehicleStatus;
  currentKm: number;
  nextMaintenanceKm?: number;
  nextMaintenanceDate?: Date;
  branchId: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  km: number;
  performedAt: Date;
  nextDueKm?: number;
  nextDueDate?: Date;
  provider: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  km: number;
  fuelType: FuelType;
  isFullTank: boolean;
  performedAt: Date;
  driverId?: string;
}
