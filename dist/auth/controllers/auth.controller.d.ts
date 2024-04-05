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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { SignInDTO, RegisterDTO, AccountRecoveryDTO, ConfirmAccountRecoveryTokenDTO, NewPasswordDTO } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ExtendedRequest } from 'src/types';
import { EmailService } from '../services/email.service';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    private readonly configService;
    private readonly emailService;
    constructor(authService: AuthService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    handleRegister(signUpData: RegisterDTO): Promise<{
        message: string;
    }>;
    handleLogin(signInData: SignInDTO): Promise<{
        accessToken: string;
        expiresIn: string;
        user: import("mongoose").Document<unknown, {}, import("src/auth/models/User").User> & import("src/auth/models/User").User & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    handleGetProfile(req: ExtendedRequest): Promise<any>;
    handleGetAuthUrl(res: Response): void;
    confirmCode(code: string, res: Response): Promise<void>;
    handleAccountRecovery(data: AccountRecoveryDTO): Promise<{
        message: string;
    }>;
    confirmAccountRecoveryToken(data: ConfirmAccountRecoveryTokenDTO): Promise<{
        message: string;
        code: string;
    }>;
    resetPassword(data: NewPasswordDTO): Promise<{
        message: string;
    }>;
}
