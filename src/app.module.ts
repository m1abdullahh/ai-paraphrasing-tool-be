import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneratorModule } from './generator/generator.module';
import { PromptModule } from './prompt/prompt.module';
import { FeedbackModule } from './feedback/feedback.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { envFilePath } from './main';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('GMAIL_SMTP_HOST'),
          port: 587,
          ssl: false,
          auth: {
            user: configService.get<string>('GMAIL_MAIL_USER'),
            pass: configService.get<string>('GMAIL_MAIL_PASS'),
          },
          defaults: {
            from: `"${configService.get<string>(
              'MAIL_DEFAULT_NAME',
            )}" <${configService.get<string>('MAIL_DEFAULT')}>`,
          },
        },
      }),
    }),
    AuthModule,
    GeneratorModule,
    PromptModule,
    FeedbackModule,
  ],
})
export class AppModule {}
