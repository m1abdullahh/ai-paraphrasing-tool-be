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
import { SignInDTO, RegisterDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ResponseMappings } from 'src/shared/utils/ResponseMappings';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ExtendedRequest } from 'src/types';
export declare class AuthController {
    private readonly authService;
    private readonly responseMappings;
    private readonly jwtService;
    private readonly configService;
    constructor(authService: AuthService, responseMappings: ResponseMappings, jwtService: JwtService, configService: ConfigService);
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
    handleGetProfile(req: ExtendedRequest): Promise<import("mongoose").Document<unknown, {}, import("src/auth/models/User").User> & import("src/auth/models/User").User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    handleGetAuthUrl(res: Response): void;
}
