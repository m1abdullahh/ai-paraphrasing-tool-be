import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Prompt, PromptSchema } from './models/prompt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prompt.name, schema: PromptSchema, collection: 'Prompts' },
    ]),
  ],
  providers: [PromptService],
})
export class PromptModule {}
