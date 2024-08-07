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
import { ConfigService } from '@nestjs/config';
import { RegisterDTO } from '../dto/auth.dto';
import { User, UserDocument } from '../models/User';
import { Model } from 'mongoose';
export declare class AuthService {
    private readonly userModel;
    private readonly configService;
    constructor(userModel: Model<User>, configService: ConfigService);
    checkAvailability({ username, email, }: {
        username: string;
        email: string;
    }): Promise<{
        available: boolean;
        error?: string;
    }>;
    createUser(data: RegisterDTO): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOne(email: string): Promise<UserDocument>;
    changeCredits(userId: string, change: number): Promise<void>;
    getGoogleAuthURL(): string;
    setEmailVerifiedStatus(id: string, status: boolean): Promise<void>;
    changePassword(email: string, newPassword: string): Promise<void>;
}
