import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/auth/models/User';
import { getEmailTemplate } from 'src/shared/utils';
import { EmailType } from 'src/types';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly JWTService: JwtService,
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
}
