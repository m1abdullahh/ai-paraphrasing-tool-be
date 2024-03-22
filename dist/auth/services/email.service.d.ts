import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/auth/models/User';
export declare class EmailService {
    private readonly mailerService;
    private readonly configService;
    private readonly JWTService;
    constructor(mailerService: MailerService, configService: ConfigService, JWTService: JwtService);
    sendVerificationEmail(user: UserDocument): Promise<boolean>;
    verifyCode(code: string): Promise<string | false>;
}
