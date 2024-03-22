import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private reflector;
    private readonly authService;
    private configService;
    constructor(jwtService: JwtService, reflector: Reflector, authService: AuthService, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean | any>;
    private extractTokenFromHeader;
}
