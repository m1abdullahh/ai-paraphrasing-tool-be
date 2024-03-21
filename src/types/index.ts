import { UserDocument } from 'src/auth/models/User';

export interface ExtendedRequest extends Request {
  user: UserDocument;
}
