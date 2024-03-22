import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from './models/Feedback';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/services/auth.service';
import { User, UserSchema } from 'src/auth/models/User';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Feedback.name,
        schema: FeedbackSchema,
        collection: 'Feedbacks',
      },
      {
        name: User.name,
        schema: UserSchema,
        collection: 'Users',
      },
    ]),
    AuthModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, AuthService],
})
export class FeedbackModule {}
