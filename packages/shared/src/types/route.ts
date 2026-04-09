export enum RouteStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum StopStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  PARTIAL_DELIVERY = 'PARTIAL_DELIVERY',
  NOT_DELIVERED = 'NOT_DELIVERED',
  RESCHEDULED = 'RESCHEDULED',
}

export enum NonDeliveryReason {
  ABSENT_RECIPIENT = 'ABSENT_RECIPIENT',
  REFUSED = 'REFUSED',
  WRONG_ADDRESS = 'WRONG_ADDRESS',
  DAMAGED_GOODS = 'DAMAGED_GOODS',
  SECURITY = 'SECURITY',
  OTHER = 'OTHER',
}

export interface Route {
  id: string;
  name: string;
  vehicleId: string;
  driverId: string;
  branchId: string;
  status: RouteStatus;
  scheduledDate: Date;
  startedAt?: Date;
  completedAt?: Date;
  totalStops: number;
  completedStops: number;
  totalDistance?: number; // km
  createdAt: Date;
}

export interface RouteStop {
  id: string;
  routeId: string;
  sequence: number;
  clientName: string;
  clientDocument?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat?: number;
  lng?: number;
  timeWindowStart?: Date;
  timeWindowEnd?: Date;
  status: StopStatus;
  nonDeliveryReason?: NonDeliveryReason;
  notes?: string;
  arrivedAt?: Date;
  completedAt?: Date;
}

export interface DeliveryItem {
  id: string;
  stopId: string;
  description: string;
  quantity: number;
  deliveredQuantity: number;
  weight?: number;
  nfeNumber?: string;
  barcode?: string;
}

export interface DeliveryProof {
  id: string;
  stopId: string;
  photoUrl?: string;
  signatureUrl?: string;
  lat?: number;
  lng?: number;
  receiverName?: string;
  receiverDocument?: string;
  createdAt: Date;
}
