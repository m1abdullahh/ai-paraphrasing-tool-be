import { Module } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GeneratorController } from './generator.controller';
import { AuthService } from 'src/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/models/User';
import { ResponseMappings } from 'src/shared/utils/ResponseMappings';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        collection: 'Users',
      },
    ]),
  ],
  providers: [GeneratorService, AuthService, ResponseMappings],
  controllers: [GeneratorController],
})
export class GeneratorModule {}
