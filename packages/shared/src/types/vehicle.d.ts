export declare enum VehicleType {
    TRUCK = "TRUCK",
    VAN = "VAN",
    MOTORCYCLE = "MOTORCYCLE",
    CAR = "CAR",
    UTILITY = "UTILITY"
}
export declare enum VehicleStatus {
    ACTIVE = "ACTIVE",
    MAINTENANCE = "MAINTENANCE",
    INACTIVE = "INACTIVE"
}
export declare enum FuelType {
    GASOLINE = "GASOLINE",
    ETHANOL = "ETHANOL",
    DIESEL = "DIESEL",
    GNV = "GNV",
    ELECTRIC = "ELECTRIC",
    FLEX = "FLEX"
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
