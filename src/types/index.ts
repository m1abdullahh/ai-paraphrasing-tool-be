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

export enum EmailType {
  VERIFICATION = 'verification',
  ACTIVATION = 'activation',
  PASSWORD_RESET = 'password-reset',
}

export enum GeneratorModel {
  GPT_4 = 'GPT_4',
  CLAUDE_3 = 'CLAUDE_3',
}
