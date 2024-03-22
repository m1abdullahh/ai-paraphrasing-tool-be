"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const Public_1 = require("../../shared/decorators/Public");
const core_1 = require("@nestjs/core");
const auth_service_1 = require("../services/auth.service");
const config_1 = require("@nestjs/config");
let AuthGuard = class AuthGuard {
    constructor(jwtService, reflector, authService, configService) {
        this.jwtService = jwtService;
        this.reflector = reflector;
        this.authService = authService;
        this.configService = configService;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(Public_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException();
        }
        try {
            const data = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            if (data) {
                const user = await this.authService.findOne(data.email);
                if (user === null) {
                    throw new common_1.UnauthorizedException('Invalid token');
                }
                if (!user.active) {
                    throw new common_1.UnauthorizedException('Your account is not active,\n Contact Administrator for Account Activation.');
                }
                if (!user.emailVerified) {
                    throw new common_1.UnauthorizedException('Your email address is not verfied. Please check your inbox. ');
                }
                request['user'] = user;
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException(e.message);
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            return undefined;
        }
        return authHeader.split(' ')[1];
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector,
        auth_service_1.AuthService,
        config_1.ConfigService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map