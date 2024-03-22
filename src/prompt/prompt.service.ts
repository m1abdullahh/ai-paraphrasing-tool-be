import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Prompt } from './models/prompt';
import { Model } from 'mongoose';
import { AddPromptDTO } from './dto/prompt';

@Injectable()
export class PromptService {
  constructor(
    @InjectModel(Prompt.name) private readonly promptModel: Model<Prompt>,
  ) {}

  async addPrompt(data: AddPromptDTO) {
    try {
      await this.promptModel.create({
        completion: data.completion,
        prompt: data.prompt,
        user: data.user,
      });
    } catch (e) {
      throw new InternalServerErrorException(
        e.message || 'Something went wrong.',
      );
    }
  }
}
