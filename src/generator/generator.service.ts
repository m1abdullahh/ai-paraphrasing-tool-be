import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeneratorModel } from 'src/types';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeneratorService {
  private anthropicAi: Anthropic;
  private openAi: OpenAIClient;
  private googleAI: GoogleGenerativeAI;
  constructor(private readonly configService: ConfigService) {
    this.anthropicAi = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_KEY'),
    });
    const credentials: AzureKeyCredential = new AzureKeyCredential(
      this.configService.get<string>('GPT4_OPENAPI_KEY'),
    );
    this.openAi = new OpenAIClient(
      'https://asjndja2.openai.azure.com/',
      credentials,
      {},
    );
    this.googleAI = new GoogleGenerativeAI(
      this.configService.get<string>('GOOGLE_GEMINI_API_KEY'),
    );
  }

  async getCompletion(
    content: string,
    userId: string,
    originalPrompt: string,
    service: GeneratorModel,
  ) {
    let textStream: any;
    if (service === GeneratorModel.GEMINI_PRO) {
      const model = this.googleAI.getGenerativeModel({ model: 'gemini-pro' });
      const completion = await model.generateContentStream(content);
      textStream = completion.stream;
    } else if (service === GeneratorModel.CLAUDE_3) {
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
