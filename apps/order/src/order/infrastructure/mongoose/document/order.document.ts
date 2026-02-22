import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  DeliveryAddressDocument,
  DeliveryAddressSchema,
} from './delivery-address.document';
import { CustomerDocument, CustomerSchema } from './customer.document';
import { ProductDocument, ProductSchema } from './product.document';
import { PaymentDocument, PaymentSchema } from './payment.document';
import { Document, ObjectId } from 'mongoose';

export enum OrderStatus {
  pending = 'Pending',
  paymentCanceled = 'PaymentCanceled',
  paymentFailed = 'PaymentFailed',
  paymentProcessed = 'PaymentProcessed',
  deliveryStarted = 'DeliveryStarted',
  deliveryDone = 'DeliveryDone',
}
@Schema()
export class OrderDocument extends Document<ObjectId> {
  @Prop({
    type: CustomerSchema,
    required: true,
  })
  customer: CustomerDocument;

  @Prop({
    type: [ProductSchema],
    required: true,
  })
  products: ProductDocument[];

  @Prop({
    type: DeliveryAddressSchema,
    required: true,
  })
  deliveryAddress: DeliveryAddressDocument;

  @Prop({
    type: String,
    required: true,
    default: OrderStatus.pending,
  })
  status: OrderStatus;

  @Prop({
    type: PaymentSchema,
  })
  payment: PaymentDocument;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
