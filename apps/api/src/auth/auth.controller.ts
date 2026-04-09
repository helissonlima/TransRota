import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TenantRequest } from '../tenant/tenant.middleware';
import { CurrentUser } from './decorators/current-user.decorator';
import { TokenPayload } from '@transrota/shared';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login — retorna access e refresh token' })
  async login(@Request() req: TenantRequest, @Body() dto: LoginDto) {
    const user = await this.authService.validateUser(
      req.tenantPrisma,
      dto.email,
      dto.password,
    );
    return this.authService.login(
      req.tenantPrisma,
      req.tenantId,
      req.schemaName,
      user,
    );
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar access token com refresh token' })
  async refresh(@Request() req: TenantRequest, @Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(
      req.tenantPrisma,
      req.tenantId,
      req.schemaName,
      dto.userId,
      dto.refreshToken,
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout — revoga refresh token' })
  async logout(@Request() req: TenantRequest, @CurrentUser() user: TokenPayload) {
    await this.authService.logout(req.tenantPrisma, user.sub);
    return { message: 'Logout realizado com sucesso' };
  }
}
