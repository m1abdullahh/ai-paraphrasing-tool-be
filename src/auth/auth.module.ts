import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ResponseMappings } from 'src/shared/utils/ResponseMappings';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/User';
import { EmailService } from './services/email.service';
import { RecoveryToken, RecoveryTokenSchema } from './models/RecoveryToken';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        collection: 'Users',
      },
      {
        name: RecoveryToken.name,
        schema: RecoveryTokenSchema,
        collection: 'Recovery Tokens',
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ResponseMappings, EmailService],
})
export class AuthModule {}
