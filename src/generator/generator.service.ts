import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/services/auth.service';
import { PromptService } from 'src/prompt/prompt.service';
import { countWords } from 'src/shared/utils';
import { WORDS_PER_CREDIT } from 'src/types';

@Injectable()
export class GeneratorService {
  private anthropicAi: Anthropic;
  constructor(
    private readonly configService: ConfigService,
    private readonly promptService: PromptService,
    private readonly authService: AuthService,
  ) {
    this.anthropicAi = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPY_KEY'),
    });
  }

  async getCompletion(content: string, userId: string, originalPrompt: string) {
    const completion = await this.anthropicAi.messages.create({
      max_tokens: 1024,
      messages: [{ content, role: 'user' }],
      model: 'claude-3-opus-20240229',
    });
    const returnText = completion.content[0].text;
    this.promptService.addPrompt({
      prompt: originalPrompt,
      completion: returnText,
      user: userId,
    });
    const wordCount = countWords(returnText);
    const generationCost = wordCount / WORDS_PER_CREDIT;

    this.authService.changeCredits(userId, ~~-generationCost);
    return returnText;
  }
}
