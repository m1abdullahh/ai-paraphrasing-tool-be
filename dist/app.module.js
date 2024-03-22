"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const generator_module_1 = require("./generator/generator.module");
const prompt_module_1 = require("./prompt/prompt.module");
const feedback_module_1 = require("./feedback/feedback.module");
const mailer_1 = require("@nestjs-modules/mailer");
const main_1 = require("./main");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: main_1.envFilePath,
                isGlobal: true,
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                },
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
            }),
            mailer_1.MailerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    transport: {
                        host: configService.get('GMAIL_SMTP_HOST'),
                        port: 587,
                        ssl: false,
                        auth: {
                            user: configService.get('GMAIL_MAIL_USER'),
                            pass: configService.get('GMAIL_MAIL_PASS'),
                        },
                        defaults: {
                            from: `"${configService.get('MAIL_DEFAULT_NAME')}" <${configService.get('MAIL_DEFAULT')}>`,
                        },
                    },
                }),
            }),
            auth_module_1.AuthModule,
            generator_module_1.GeneratorModule,
            prompt_module_1.PromptModule,
            feedback_module_1.FeedbackModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map