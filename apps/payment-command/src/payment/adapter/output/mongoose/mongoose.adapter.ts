import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentModel } from '../../../domain/payment.domain';
import { DatabaseOutputPort } from '../../../port/output/database.output-port';
import { PaymentDocument } from './document/payment.document';
import { PaymentDocumentMapper } from './mapper/payment-document.mapper';

export class MongooseAdapter implements DatabaseOutputPort {
  constructor(
    @InjectModel(PaymentDocument.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  async findPaymentByOrderId(orderId: string): Promise<PaymentModel> {
    const result = await this.paymentModel.findOne({ orderId });
    return new PaymentDocumentMapper(result).toDomain();
  }

  async savePayment(payment: PaymentModel): Promise<PaymentModel> {
    const model = await this.paymentModel.create(payment);

    const mapper = new PaymentDocumentMapper(model);

    this.kafkaService.emit(
      'payment.created',
      mapper.toPaymentQueryMicroservicePayload(),
    );
    return mapper.toDomain();
  }

  async updatePayment(payment: PaymentModel): Promise<PaymentModel> {
    const model = await this.paymentModel.create(payment);
    // const model = await this.paymentModel.findByIdAndUpdate(
    //   payment.id,
    //   payment,
    //   {
    //     new: true,
    //   },
    // );

    const mapper = new PaymentDocumentMapper(model);

    this.kafkaService.emit(
      'payment.updated',
      mapper.toPaymentQueryMicroservicePayload(),
    );
    return mapper.toDomain();
  }
}
