import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsEmail } from 'class-validator';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true })
  fullName: string;
  @IsEmail()
  @Prop({ unique: true, required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ type: Boolean, required: false, default: true })
  active: boolean;
  @Prop({ type: Boolean, required: false, default: false })
  emailVerified: boolean;
  @Prop({ type: Number, required: true, default: 150 })
  promptCredits: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ fullName: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ active: 1 });
