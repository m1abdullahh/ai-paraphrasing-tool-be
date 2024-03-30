import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/services/auth.service';
import { PromptService } from 'src/prompt/prompt.service';
import { countWords } from 'src/shared/utils';
import { GeneratorModel, WORDS_PER_CREDIT } from 'src/types';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

@Injectable()
export class GeneratorService {
  private anthropicAi: Anthropic;
  private openAi: OpenAIClient;
  constructor(
    private readonly configService: ConfigService,
    private readonly promptService: PromptService,
    private readonly authService: AuthService,
  ) {
    this.anthropicAi = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPY_KEY'),
    });
    const credentials: AzureKeyCredential = new AzureKeyCredential(
      this.configService.get<string>('GPT4_OPENAPI_KEY'),
    );
    this.openAi = new OpenAIClient(
      'https://asjndja2.openai.azure.com/',
      credentials,
    );
  }

  async getCompletion(
    content: string,
    userId: string,
    originalPrompt: string,
    service: GeneratorModel,
  ) {
    let returnText: string;
    if (service === GeneratorModel.CLAUDE_3) {
      const completion = await this.anthropicAi.messages.create({
        max_tokens: 1024,
        messages: [{ content, role: 'user' }],
        model: 'claude-3-opus-20240229',
      });
      returnText = completion.content[0].text;
      this.promptService.addPrompt({
        prompt: originalPrompt,
        completion: returnText,
        user: userId,
      });
    } else {
      const completion = await this.openAi.getChatCompletions('xyz', [
        {
          role: 'user',
          content,
        },
      ]);
      returnText = completion.choices[0].message.content;
    }
    const wordCount = countWords(returnText);
    const generationCost = wordCount / WORDS_PER_CREDIT;

    this.authService.changeCredits(userId, ~~-generationCost);
    return returnText;
  }
}
