import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@transrota/shared';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as { role?: string } | undefined;

    if (!user) {
      throw new UnauthorizedException('Autenticação obrigatória');
    }

    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Acesso restrito a super admins');
    }

    return true;
  }
}