import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'src/auth/models/User';
import {
  generateRandomOTP,
  getEmailTemplate,
  getRecoveryEmailTemplate,
} from 'src/shared/utils';
import { EmailType } from 'src/types';
import { RecoveryToken, TokenStatus } from '../models/RecoveryToken';
import { Model } from 'mongoose';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly JWTService: JwtService,
    @InjectModel(RecoveryToken.name)
    private readonly recoveryTokenModel: Model<RecoveryToken>,
  ) {}

  async sendVerificationEmail(user: UserDocument): Promise<boolean> {
    const expiry = this.configService.get<string>('JWT_EXPIRES_IN');
    try {
      const emailToken = this.JWTService.sign(
        { email: user.email, id: user.id },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: expiry,
        },
      );
      await this.mailerService.sendMail({
        from: 'Abdullah K. <akjee204@gmail.com>',
        sender: 'Email Verification for Proposal Generator',
        to: user.email,
        subject: 'ABServes - Verify your email address',
        html: getEmailTemplate(
          user.fullName,
          emailToken,
          expiry,
          EmailType.VERIFICATION,
        ),
      });
      return true;
    } catch {
      return false;
    }
  }

  async verifyCode(code: string): Promise<string | false> {
    try {
      const payload = await this.JWTService.verifyAsync<{
        email: string;
        id: string;
      }>(code, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload.id;
    } catch (e) {
      return false;
    }
  }

  async sendAccountRecoveryEmail(email: string, name: string) {
    const token = generateRandomOTP(6);

    // Delete previous email recovery token instances for this email
    await this.recoveryTokenModel.deleteMany({
      email,
      status: TokenStatus.FRESH,
    });

    await this.recoveryTokenModel.create({
      email: email,
      status: TokenStatus.FRESH,
      token: token,
    });

    await this.mailerService.sendMail({
      from: 'Abdullah K. <akjee204@gmail.com>',
      sender: 'Account Recovery for Proposal Generator',
      to: email,
      subject: 'ABServes Inc. - Recover your account',
      html: getRecoveryEmailTemplate(name, token, '10 minutes'),
    });
  }

  async confirmRecoveryCode(
    email: string,
    token: string,
  ): Promise<{ match: boolean; code?: string }> {
    const tokenInstance = await this.recoveryTokenModel
      .findOne({
        email,
        status: TokenStatus.FRESH,
      })
      .exec();
    if (tokenInstance.token === token) {
      const code = await this.JWTService.signAsync(
        { email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '30m',
        },
      );
      await this.recoveryTokenModel.findByIdAndUpdate(tokenInstance.id, {
        status: TokenStatus.CODE_GENERATED,
        code,
      });
      return { match: true, code };
    }
    return { match: false };
  }

  async expireRecoveryCode(email: string, code: string) {
    await this.recoveryTokenModel.findOneAndUpdate(
      { email, code },
      { status: TokenStatus.EXPIRED },
    );
  }
}
