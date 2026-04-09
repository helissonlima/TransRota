export declare enum ChecklistType {
    PRE_TRIP = "PRE_TRIP",
    POST_TRIP = "POST_TRIP",
    MAINTENANCE = "MAINTENANCE"
}
export declare enum ChecklistItemStatus {
    OK = "OK",
    NOK = "NOK",
    NA = "NA"
}
export interface Checklist {
    id: string;
    name: string;
    type: ChecklistType;
    branchId?: string;
    isActive: boolean;
    items: ChecklistItem[];
}
export interface ChecklistItem {
    id: string;
    checklistId: string;
    description: string;
    isRequired: boolean;
    order: number;
    allowPhoto: boolean;
    allowNotes: boolean;
}
export interface ChecklistExecution {
    id: string;
    checklistId: string;
    vehicleId: string;
    driverId: string;
    routeId?: string;
    executedAt: Date;
    hasIssues: boolean;
    responses: ChecklistResponse[];
}
export interface ChecklistResponse {
    id: string;
    executionId: string;
    itemId: string;
    status: ChecklistItemStatus;
    notes?: string;
    photoUrl?: string;
}
