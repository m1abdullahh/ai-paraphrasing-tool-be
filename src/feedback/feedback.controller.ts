import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddFeedbackDTO } from './dto/feedback';
import { ExtendedRequest } from 'src/types';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('feedback')
@ApiTags('Feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Add Feedback', description: 'Add Feedback' })
  @ApiBody({ type: AddFeedbackDTO, required: true })
  async addFeedback(@Body() data: AddFeedbackDTO, @Req() req: ExtendedRequest) {
    try {
      await this.feedbackService.addFeedback(
        req.user.id,
        data.feedback,
        data.rating,
      );
      return {
        message: 'Thanks! Bonus credits have been added to your account.',
      };
    } catch (e) {
      return new BadRequestException(e.message);
    }
  }
}
