import { BadRequestException } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { AddFeedbackDTO } from './dto/feedback';
import { ExtendedRequest } from 'src/types';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    addFeedback(data: AddFeedbackDTO, req: ExtendedRequest): Promise<BadRequestException | {
        message: string;
    }>;
}
