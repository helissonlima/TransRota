export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    OPERATOR = "OPERATOR",
    DRIVER = "DRIVER",
    VIEWER = "VIEWER"
}
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    branchId?: string;
    isActive: boolean;
    createdAt: Date;
}
export interface TokenPayload {
    sub: string;
    tenantId: string;
    schemaName: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}
