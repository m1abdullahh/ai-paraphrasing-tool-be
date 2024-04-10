import { HttpException, HttpStatus } from '@nestjs/common';
import { UserDocument } from 'src/auth/models/User';
export interface ExtendedRequest extends Request {
    user: UserDocument;
}
export declare const WORDS_PER_CREDIT = 10;
export declare enum ENV {
    PROD = "PROD",
    DEV = "DEV"
}
export declare const ENV_MAPPINGS: Record<ENV, string>;
export declare enum EmailType {
    VERIFICATION = "verification",
    ACTIVATION = "activation",
    PASSWORD_RESET = "password-reset"
}
export declare enum GeneratorModel {
    GPT_4 = "GPT_4",
    CLAUDE_3 = "CLAUDE_3",
    GEMINI_PRO = "GEMINI_PRO"
}
export declare class TooManyRequestsException extends HttpException {
    constructor(response?: string, status?: HttpStatus);
}
