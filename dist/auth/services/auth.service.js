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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt_1 = require("bcrypt");
const User_1 = require("../models/User");
const mongoose_2 = require("mongoose");
let AuthService = class AuthService {
    constructor(userModel, configService) {
        this.userModel = userModel;
        this.configService = configService;
    }
    async checkAvailability({ username, email, }) {
        if (await this.userModel.exists({ username })) {
            return { available: false, error: 'This username is taken.' };
        }
        if (await this.userModel.exists({ email })) {
            return { available: false, error: 'This email address is taken.' };
        }
        return { available: true };
    }
    async createUser(data) {
        const passwordHash = (0, bcrypt_1.hashSync)(data.password, 10);
        try {
            return await this.userModel.create({
                ...data,
                fullName: `${data.firstName} ${data.lastName}`,
                password: passwordHash,
            });
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async findOne(email) {
        return await this.userModel
            .findOne({
            $or: [{ email: email }, { email: email }],
        })
            .exec();
    }
    async changeCredits(userId, change) {
        return await this.userModel.findByIdAndUpdate(userId, {
            $inc: {
                promptCredits: change,
            },
        });
    }
    getGoogleAuthURL() {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.configService.get('GOOGLE_AUTH_CLIENT_ID')}&redirect_uri=${this.configService.get('GOOGLE_AUTH_REDIRECT_URI')}&response_type=code&scope=profile email`;
        return url;
    }
    async setEmailVerifiedStatus(id, status) {
        await this.userModel.findByIdAndUpdate(id, {
            emailVerified: status,
        });
    }
    async changePassword(email, newPassword) {
        const hashedPassword = (0, bcrypt_1.hashSync)(newPassword, 10);
        await this.userModel.findOneAndUpdate({ email }, { password: hashedPassword });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(User_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map