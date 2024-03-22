import { UserDocument } from 'src/auth/models/User';

export interface ExtendedRequest extends Request {
  user: UserDocument;
}

export const WORDS_PER_CREDIT = 10;
