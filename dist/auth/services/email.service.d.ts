/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/auth/models/User';
import { RecoveryToken } from '../models/RecoveryToken';
import { Model } from 'mongoose';
export declare class EmailService {
    private readonly mailerService;
    private readonly configService;
    private readonly JWTService;
    private readonly recoveryTokenModel;
    constructor(mailerService: MailerService, configService: ConfigService, JWTService: JwtService, recoveryTokenModel: Model<RecoveryToken>);
    sendVerificationEmail(user: UserDocument): Promise<boolean>;
    verifyCode(code: string): Promise<string | false>;
    sendAccountRecoveryEmail(email: string, name: string): Promise<void>;
    confirmRecoveryCode(email: string, token: string): Promise<{
        match: boolean;
        code?: string;
    }>;
    expireRecoveryCode(email: string, code: string): Promise<void>;
}
