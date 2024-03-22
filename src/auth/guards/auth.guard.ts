import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../../shared/decorators/Public';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean | any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const data = await this.jwtService.verifyAsync<{
        userId: string;
        email: string;
      }>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      if (data) {
        const user = await this.authService.findOne(data.email);
        if (user === null) {
          throw new UnauthorizedException('Invalid token');
        }
        if (!user.active) {
          throw new UnauthorizedException(
            'Your account is not active,\n Contact Administrator for Account Activation.',
          );
        }
        if (!user.emailVerified) {
          throw new UnauthorizedException(
            'Your email address is not verfied. Please check your inbox. ',
          );
        }
        request['user'] = user;
      }
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): any | undefined {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return undefined;
    }
    return authHeader.split(' ')[1];
  }
}
