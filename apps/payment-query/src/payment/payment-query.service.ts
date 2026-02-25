import { Injectable } from '@nestjs/common';
import { PaymentDocument } from './document/payment.document';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PaymentQueryService {
  constructor(
    @InjectModel(PaymentDocument.name)
    private readonly paymentRepository: Model<PaymentDocument>,
  ) {}
  saveDocument(document: PaymentDocument) {
    return this.paymentRepository.create(document);
  }

  updateDocument(document: PaymentDocument) {
    const { _id, orderId, ...rest } = document;
    return this.paymentRepository.findOneAndUpdate({ orderId }, rest);
  }
}
