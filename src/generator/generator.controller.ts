import { Body, Controller, Post } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GetCompletionDTO } from './DTOs/generator.dto';
import { ResponseMappings } from 'src/shared/utils/ResponseMappings';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { generateProposalPrompt } from 'src/shared/utils';

@ApiTags('Generator')
@ApiBearerAuth('JWT-auth')
@Controller('generator')
export class GeneratorController {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly responseMappings: ResponseMappings,
  ) {}

  @ApiOperation({
    summary: 'Get completion',
    description: 'Get chat completion for textual prompts.',
  })
  @Post('get-completion')
  async handleGetCompletion(@Body() prompt: GetCompletionDTO) {
    try {
      const { jobDescription, name, experience, additionalPrompt } = prompt;
      const AIPrompt = generateProposalPrompt(
        jobDescription,
        name,
        experience,
        additionalPrompt,
      );
      const completion = await this.generatorService.getCompletion(AIPrompt);
      return this.responseMappings.getSuccessResponse(completion);
    } catch (e) {
      return this.responseMappings.getErrorResponse(
        e.messages || 'Something went wrong.',
      );
    }
  }
}
