import { UserDocument } from 'src/auth/models/User';

export interface ExtendedRequest extends Request {
  user: UserDocument;
}

export const WORDS_PER_CREDIT = 10;

export enum ENV {
  PROD = 'PROD',
  DEV = 'DEV',
}

export const ENV_MAPPINGS: Record<ENV, string> = {
  DEV: '.env.dev',
  PROD: '.env.prod',
};
