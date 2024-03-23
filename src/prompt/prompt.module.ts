import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Prompt, PromptSchema } from './models/prompt';
import { PromptController } from './prompt.controller';
import { AuthService } from 'src/auth/services/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/auth/models/User';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prompt.name, schema: PromptSchema, collection: 'Prompts' },
      { name: User.name, schema: UserSchema, collection: 'Users' },
    ]),
    AuthModule,
  ],
  controllers: [PromptController],
  providers: [PromptService, AuthService],
})
export class PromptModule {}
