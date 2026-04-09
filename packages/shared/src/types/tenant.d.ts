export interface Company {
    id: string;
    name: string;
    cnpj: string;
    schemaName: string;
    planId: string;
    isActive: boolean;
    createdAt: Date;
}
export interface Branch {
    id: string;
    companyId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    isActive: boolean;
}
export declare enum PlanType {
    STARTER = "STARTER",
    PROFESSIONAL = "PROFESSIONAL",
    ENTERPRISE = "ENTERPRISE"
}
