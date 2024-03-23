import { Controller, Get, HttpException, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ExtendedRequest } from 'src/types';
import { PromptService } from './prompt.service';

@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Prompts')
@Controller('prompts')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Get('my-prompts')
  @ApiOperation({
    summary: 'Get prompts',
    description: "Get current user's prompts.",
  })
  async getUserPrompts(@Req() req: ExtendedRequest) {
    try {
      const prompts = await this.promptService.getPromptsByUserId(req.user.id);
      return prompts;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
