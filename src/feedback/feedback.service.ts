import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from './models/Feedback';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
    private readonly authService: AuthService,
  ) {}

  async addFeedback(userId: string, feedback: string, rating: number) {
    try {
      await this.feedbackModel.create({
        user: userId,
        feedback,
        rating,
      });
      await this.authService.changeCredits(userId, 20);
    } catch (e) {
      console.log(e);
    }
  }
}
