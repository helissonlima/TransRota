import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { TokenPayload } from '@transrota/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(
    tenantPrisma: TenantPrismaService,
    email: string,
    password: string,
  ) {
    const user = await tenantPrisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    return user;
  }

  async login(
    tenantPrisma: TenantPrismaService,
    tenantId: string,
    schemaName: string,
    user: { id: string; role: string; email: string },
  ) {
    const payload: TokenPayload = {
      sub: user.id,
      tenantId,
      schemaName,
      role: user.role as any,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await tenantPrisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: refreshHash, lastLoginAt: new Date() },
    });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  async refreshTokens(
    tenantPrisma: TenantPrismaService,
    tenantId: string,
    schemaName: string,
    userId: string,
    refreshToken: string,
  ) {
    const user = await tenantPrisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshTokenHash) throw new ForbiddenException('Acesso negado');

    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) throw new ForbiddenException('Refresh token inválido');

    return this.login(tenantPrisma, tenantId, schemaName, user);
  }

  async logout(tenantPrisma: TenantPrismaService, userId: string) {
    await tenantPrisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }
}
