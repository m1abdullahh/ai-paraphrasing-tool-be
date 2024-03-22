import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcrypt';
import { RegisterDTO } from './dto/auth.dto';
import { User, UserDocument } from './models/User';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async checkAvailability({
    username,
    email,
  }: {
    username: string;
    email: string;
  }): Promise<{ available: boolean; error?: string }> {
    if (await this.userModel.exists({ username })) {
      return { available: false, error: 'This username is taken.' };
    }
    if (await this.userModel.exists({ email })) {
      return { available: false, error: 'This email address is taken.' };
    }
    return { available: true };
  }

  async createUser(data: RegisterDTO) {
    const passwordHash = hashSync(data.password, 10);
    try {
      await this.userModel.create({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`,
        password: passwordHash,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findOne(email: string): Promise<UserDocument> {
    return await this.userModel
      .findOne({
        $or: [{ email: email }, { email: email }],
      })
      .exec();
  }

  async changeCredits(userId: string, change: number): Promise<void> {
    return await this.userModel.findByIdAndUpdate(userId, {
      $inc: {
        promptCredits: change,
      },
    });
  }

  getGoogleAuthURL() {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.configService.get<string>('GOOGLE_AUTH_CLIENT_ID')}&redirect_uri=${this.configService.get<string>('GOOGLE_AUTH_REDIRECT_URI')}&response_type=code&scope=profile email`;
    return url;
  }
}
