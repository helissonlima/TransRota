export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN', // acesso ao master
  ADMIN = 'ADMIN',             // admin do tenant
  MANAGER = 'MANAGER',         // gerente de filial
  OPERATOR = 'OPERATOR',       // operador de rota
  DRIVER = 'DRIVER',           // motorista (app)
  VIEWER = 'VIEWER',           // somente leitura
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
  sub: string;         // user id
  tenantId: string;    // company id
  schemaName: string;  // schema do tenant
  role: UserRole;
  iat?: number;
  exp?: number;
}
