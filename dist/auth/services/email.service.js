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
exports.EmailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const utils_1 = require("../../shared/utils");
const types_1 = require("../../types");
let EmailService = class EmailService {
    constructor(mailerService, configService, JWTService) {
        this.mailerService = mailerService;
        this.configService = configService;
        this.JWTService = JWTService;
    }
    async sendVerificationEmail(user) {
        const expiry = this.configService.get('JWT_EXPIRES_IN');
        try {
            const emailToken = this.JWTService.sign({ email: user.email, id: user.id }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: expiry,
            });
            await this.mailerService.sendMail({
                from: 'Abdullah K. <akjee204@gmail.com>',
                sender: 'Email Verification for Proposal Generator',
                to: user.email,
                subject: 'ABServes - Verify your email address',
                html: (0, utils_1.getEmailTemplate)(user.fullName, emailToken, expiry, types_1.EmailType.VERIFICATION),
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async verifyCode(code) {
        try {
            const payload = await this.JWTService.verifyAsync(code, {
                secret: this.configService.get('JWT_SECRET'),
            });
            return payload.id;
        }
        catch (e) {
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService,
        jwt_1.JwtService])
], EmailService);
//# sourceMappingURL=email.service.js.map