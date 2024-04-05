import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeneratorModel } from 'src/types';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

@Injectable()
export class GeneratorService {
  private anthropicAi: Anthropic;
  private openAi: OpenAIClient;
  constructor(private readonly configService: ConfigService) {
    this.anthropicAi = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPY_KEY'),
    });
    const credentials: AzureKeyCredential = new AzureKeyCredential(
      this.configService.get<string>('GPT4_OPENAPI_KEY'),
    );
    this.openAi = new OpenAIClient(
      'https://asjndja2.openai.azure.com/',
      credentials,
      {},
    );
  }

  async getCompletion(
    content: string,
    userId: string,
    originalPrompt: string,
    service: GeneratorModel,
  ) {
    let textStream: any;
    if (service === GeneratorModel.CLAUDE_3) {
      const completion = this.anthropicAi.messages.stream({
        max_tokens: 1024,
        messages: [{ content, role: 'user' }],
        model: 'claude-3-opus-20240229',
      });
      textStream = completion;
    } else {
      const completion = await this.openAi.streamChatCompletions('xyz', [
        {
          role: 'user',
          content,
        },
      ]);
      textStream = completion;
    }

    return textStream;
  }
}
