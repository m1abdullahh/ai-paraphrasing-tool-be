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
