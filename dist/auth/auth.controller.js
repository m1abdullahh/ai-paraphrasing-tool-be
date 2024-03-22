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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_dto_1 = require("./dto/auth.dto");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt_1 = require("bcrypt");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("./guards/auth.guard");
const Public_1 = require("../shared/decorators/Public");
let AuthController = class AuthController {
    constructor(authService, jwtService, configService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async handleRegister(signUpData) {
        const availability = await this.authService.checkAvailability({
            username: signUpData.username,
            email: signUpData.email,
        });
        if (!availability.available) {
            throw new common_1.BadRequestException(availability.error);
        }
        await this.authService.createUser(signUpData);
        return { message: 'User created, you can sign in now.' };
    }
    async handleLogin(signInData) {
        const user = await this.authService.findOne(signInData.email);
        if (!user) {
            throw new common_1.NotFoundException('No account found with this email.');
        }
        const passwordMatch = (0, bcrypt_1.compareSync)(signInData.password, user.password);
        const expiry = this.configService.get('JWT_EXPIRES_IN');
        const secret = this.configService.get('JWT_SECRET');
        if (passwordMatch) {
            const token = await this.jwtService.signAsync({
                email: user.email,
                userId: user.id,
            }, {
                expiresIn: expiry,
                secret,
            });
            return {
                accessToken: token,
                expiresIn: expiry,
                user: user,
            };
        }
        throw new common_1.BadRequestException('Invalid Password.');
    }
    async handleGetProfile(req) {
        return req.user;
    }
    handleGetAuthUrl(res) {
        return res.redirect(this.authService.getGoogleAuthURL());
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, Public_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'User Signup' }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.RegisterDTO }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleRegister", null);
__decorate([
    (0, Public_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'User Login' }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignInDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'User profile', description: 'Fetch user profile.' }),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleGetProfile", null);
__decorate([
    (0, common_1.Get)('google-auth'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleGetAuthUrl", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiTags)('User Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map