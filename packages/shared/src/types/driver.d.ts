export declare enum LicenseCategory {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    AB = "AB",
    AC = "AC",
    AD = "AD",
    AE = "AE"
}
export declare enum DriverStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    ON_LEAVE = "ON_LEAVE"
}
export interface Driver {
    id: string;
    userId?: string;
    name: string;
    cpf: string;
    phone: string;
    licenseNumber: string;
    licenseCategory: LicenseCategory;
    licenseExpiry: Date;
    status: DriverStatus;
    branchId: string;
    createdAt: Date;
}
export interface DriverDocument {
    id: string;
    driverId: string;
    type: string;
    description: string;
    fileUrl: string;
    expiresAt?: Date;
    createdAt: Date;
}
