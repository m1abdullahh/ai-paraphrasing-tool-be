import { Module } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GeneratorController } from './generator.controller';
import { AuthService } from 'src/auth/services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/models/User';
import { ResponseMappings } from 'src/shared/utils/ResponseMappings';
import { PromptModule } from 'src/prompt/prompt.module';
import { PromptService } from 'src/prompt/prompt.service';
import { Prompt, PromptSchema } from 'src/prompt/models/prompt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        collection: 'Users',
      },
      {
        name: Prompt.name,
        schema: PromptSchema,
        collection: 'Prompts',
      },
    ]),
    PromptModule,
  ],
  providers: [GeneratorService, AuthService, ResponseMappings, PromptService],
  controllers: [GeneratorController],
})
export class GeneratorModule {}
