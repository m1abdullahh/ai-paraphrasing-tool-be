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
const auth_dto_1 = require("../dto/auth.dto");
const auth_service_1 = require("../services/auth.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt_1 = require("bcrypt");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../guards/auth.guard");
const Public_1 = require("../../shared/decorators/Public");
const email_service_1 = require("../services/email.service");
let AuthController = class AuthController {
    constructor(authService, jwtService, configService, emailService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async handleRegister(signUpData) {
        const availability = await this.authService.checkAvailability({
            username: signUpData.username,
            email: signUpData.email,
        });
        if (!availability.available) {
            throw new common_1.BadRequestException(availability.error);
        }
        const createdUser = await this.authService.createUser(signUpData);
        await this.emailService.sendVerificationEmail(createdUser);
        return { message: 'User created, check your email inbox.' };
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
            if (!user.active) {
                throw new common_1.UnauthorizedException('Your account is not active,\n contact Administrator for account activation.');
            }
            if (!user.emailVerified) {
                throw new common_1.UnauthorizedException('Your email address is not verfied. Please check your inbox. ');
            }
            return {
                accessToken: token,
                expiresIn: expiry,
                user: user,
            };
        }
        throw new common_1.BadRequestException('Invalid Password.');
    }
    async handleGetProfile(req) {
        return {
            ...req.user['_doc'],
            promptCredits: Math.max(req.user.promptCredits, 0),
        };
    }
    handleGetAuthUrl(res) {
        return res.redirect(this.authService.getGoogleAuthURL());
    }
    async confirmCode(code, res) {
        const userId = await this.emailService.verifyCode(code);
        if (userId) {
            await this.authService.setEmailVerifiedStatus(userId, true);
            return res.redirect(`${this.configService.get('CLIENT_URL')}/login?emailVerified=true`);
        }
        throw new common_1.BadRequestException('Invalid code.');
    }
    async handleAccountRecovery(data) {
        const email = data.email;
        const account = await this.authService.findOne(email);
        if (!account) {
            throw new common_1.BadRequestException('No account is registered with this email.');
        }
        try {
            await this.emailService.sendAccountRecoveryEmail(email, account.fullName);
            return { message: 'OTP sent for email verification.' };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message || 'Something went wrong.');
        }
    }
    async confirmAccountRecoveryToken(data) {
        const { email, token } = data;
        try {
            const tokenValidity = await this.emailService.confirmRecoveryCode(email, token);
            if (tokenValidity.match) {
                return { message: 'OTP matched.', code: tokenValidity.code };
            }
            throw new common_1.BadRequestException('OTP mismatch.');
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message || 'Something went wrong.');
        }
    }
    async resetPassword(data) {
        const { code, newPassword } = data;
        try {
            const payload = await this.jwtService.verifyAsync(code, { secret: this.configService.get('JWT_SECRET') });
            await this.emailService.expireRecoveryCode(payload.email, code);
            await this.authService.changePassword(payload.email, newPassword);
            return { message: 'Password changed successfully.' };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message || 'Something went wrong.');
        }
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
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Callback URL for email verification.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email Verified Successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Code Is Invalid.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error.' }),
    (0, swagger_1.ApiQuery)({ name: 'code', type: String, required: true }),
    (0, Public_1.Public)(),
    (0, common_1.Get)('confirm-code'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmCode", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Account Recovery',
        description: 'Request for OTP in case of account recovery.',
    }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.AccountRecoveryDTO, required: true }),
    (0, Public_1.Public)(),
    (0, common_1.Post)('account-recovery'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AccountRecoveryDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleAccountRecovery", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Account Recovery Step 2',
        description: 'Confirm the OTP with the email.',
    }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.ConfirmAccountRecoveryTokenDTO, required: true }),
    (0, Public_1.Public)(),
    (0, common_1.Post)('account-recovery/confirm'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ConfirmAccountRecoveryTokenDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmAccountRecoveryToken", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Account Recovery Step 3',
        description: 'Final Step: Send new Password with Code recieved from Step 2.',
    }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.NewPasswordDTO, required: true }),
    (0, Public_1.Public)(),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.NewPasswordDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiTags)('User Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map