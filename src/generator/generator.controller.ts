import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GetCompletionDTO } from './DTOs/generator.dto';
import { ResponseMappings } from 'src/shared/utils/ResponseMappings';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { countWords, generateProposalPrompt } from 'src/shared/utils';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  ExtendedRequest,
  GeneratorModel,
  TooManyRequestsException,
  WORDS_PER_CREDIT,
} from 'src/types';
import { Response } from 'express';
import { from } from 'rxjs';
import { PromptService } from 'src/prompt/prompt.service';
import { AuthService } from 'src/auth/services/auth.service';
@UseGuards(AuthGuard)
@ApiTags('Generator')
@ApiBearerAuth('JWT-auth')
@Controller('generator')
export class GeneratorController {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly responseMappings: ResponseMappings,
    private readonly promptService: PromptService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Get completion',
    description: 'Get chat completion for textual prompts.',
  })
  @Post('get-completion')
  async handleGetCompletion(
    @Body() prompt: GetCompletionDTO,
    @Req() req: ExtendedRequest,
    @Res() res: Response,
  ) {
    if (req.user.promptCredits < 10) {
      throw new TooManyRequestsException();
    }
    try {
      const { jobDescription, name, experience, additionalPrompt } = prompt;
      const AIPrompt = generateProposalPrompt(
        jobDescription,
        name,
        experience,
        additionalPrompt,
      );
      const completion = await this.generatorService.getCompletion(
        AIPrompt,
        req.user.id,
        jobDescription,
        prompt.model,
      );
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      const responseObservable = from(completion);
      let completeRes = '';
      responseObservable.subscribe({
        next(value: Record<string, any>) {
          switch (prompt.model) {
            case GeneratorModel.CLAUDE_3:
              if ((value.type as string).startsWith('content_block_delta')) {
                res.write(value.delta.text);
                completeRes = completeRes + value.delta.text;
              }
              break;
            case GeneratorModel.GPT_4:
              if (value.choices.length && value.choices[0]?.delta?.content) {
                res.write(value.choices[0]?.delta?.content);
                completeRes = completeRes + value.choices[0]?.delta?.content;
              }
          }
        },
        complete: () => {
          res.end();
          const wordCount = countWords(completeRes);
          const generationCost = ~~(wordCount / WORDS_PER_CREDIT);
          Promise.all([
            this.promptService.addPrompt({
              prompt: prompt.jobDescription,
              completion: completeRes,
              user: req.user.id,
              model: prompt.model,
              cost: generationCost,
            }),
            this.authService.changeCredits(req.user.id, -generationCost),
          ]);
        },
      });
    } catch (e) {
      return this.responseMappings.getErrorResponse(
        e.message || 'Something went wrong.',
      );
    }
  }
}
