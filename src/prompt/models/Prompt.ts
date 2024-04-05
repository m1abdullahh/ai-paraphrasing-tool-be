import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/models/User';
import { GeneratorModel } from 'src/types';

export type PromptDocument = HydratedDocument<Prompt>;

@Schema({ timestamps: true })
export class Prompt {
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
  })
  user: User;
  @Prop({ type: String, required: true })
  prompt: string;
  @Prop({ type: String, required: true })
  completion: string;
  @Prop({ type: String, required: true })
  model: GeneratorModel;
  @Prop({ type: Number, required: true })
  cost: number;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);
PromptSchema.index({ user: 1 });
