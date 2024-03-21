import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeneratorService {
  private anthropicAi: Anthropic;
  constructor(private readonly configService: ConfigService) {
    this.anthropicAi = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPY_KEY'),
    });
  }

  async getCompletion(content: string) {
    const completion = await this.anthropicAi.messages.create({
      max_tokens: 1024,
      messages: [{ content, role: 'user' }],
      model: 'claude-3-opus-20240229',
    });
    const returnText = completion.content[0].text;
    return returnText;
  }
}
