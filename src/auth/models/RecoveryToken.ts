import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecoveryTokenDocument = HydratedDocument<RecoveryToken>;

export enum TokenStatus {
  FRESH = 'FRESH',
  CODE_GENERATED = 'CODE_GENERATED',
  EXPIRED = 'EXPIRED',
}

@Schema({ timestamps: true })
export class RecoveryToken {
  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: false })
  code: string;

  @Prop({ type: String, required: true })
  status: TokenStatus;
}

export const RecoveryTokenSchema = SchemaFactory.createForClass(RecoveryToken);
