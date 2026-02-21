import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  NotificationStatus,
  PaymentMethod,
  PaymentStatus,
} from 'apps/payment/src/payment/domain/payment.domain';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class PaymentDocument extends Document<ObjectId> {
  @Prop({
    type: String,
    enum: PaymentStatus,
    required: true,
    default: PaymentStatus.pending,
  })
  paymentStatus: PaymentStatus;

  @Prop({
    type: String,
    enum: PaymentMethod,
    required: true,
    default: PaymentMethod.creditCard,
  })
  paymentMethod: PaymentMethod;

  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  expiryYear: string;

  @Prop({ required: true })
  expiryMonth: string;

  @Prop({ required: true })
  birthOrRegistration: string;

  @Prop({ required: true })
  passwordTwoDigits: string;

  @Prop({
    type: String,
    enum: NotificationStatus,
    required: true,
    default: NotificationStatus.pending,
  })
  notificationStatus: NotificationStatus;

  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  userEmail: string;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
