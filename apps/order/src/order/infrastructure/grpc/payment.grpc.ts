import { Inject, OnModuleInit } from '@nestjs/common';
import { OrderEntity, OrderStatus } from '../../domain/order.entity';
import { PaymentOutputPort } from '../../port/output/payment.output-port';
import { PaymentDto } from '../../usecase/dto/create-order.dto';
import { PAYMENT_SERVICE, PaymentMicroService } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { OrderEntityMapper } from './mapper/order-entity.mapper';
import { MakePaymentResponse } from '@app/common/grpc/proto/payment';
import { PaymentFailedException } from '../../exception/payment-failed.exception';
import { MakePaymentResponseMapper } from './mapper/make-payment-response.mapper';

export class PaymentGrpc implements PaymentOutputPort, OnModuleInit {
  paymentService: PaymentMicroService.PaymentService;
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentService =
      this.paymentMicroService.getService<PaymentMicroService.PaymentService>(
        'PaymentService',
      );
  }

  async processPayment(
    order: OrderEntity,
    payment: PaymentDto,
  ): Promise<OrderEntity> {
    const resp = (await lastValueFrom(
      this.paymentService.makePayment(
        new OrderEntityMapper(order).toMakePaymentRequest(payment),
      ) as any,
    )) as MakePaymentResponse;

    const isPaid = resp.paymentStatus === 'Approved';
    const orderStatus = isPaid
      ? OrderStatus.paymentProcessed
      : OrderStatus.paymentFailed;

    if (orderStatus === OrderStatus.paymentFailed) {
      throw new PaymentFailedException(resp);
    }

    return new MakePaymentResponseMapper(resp).toDomain(order, payment);
  }
}
