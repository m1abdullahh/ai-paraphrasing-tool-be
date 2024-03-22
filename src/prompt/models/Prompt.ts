import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/models/User';

export type UserDocument = HydratedDocument<Prompt>;

@Schema({ timestamps: true })
export class Prompt {
  @Prop({
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  })
  user: User;
  @Prop({ type: String, required: true })
  prompt: string;
  @Prop({ type: String, required: true })
  completion: string;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);
PromptSchema.index({ user: 1 });
