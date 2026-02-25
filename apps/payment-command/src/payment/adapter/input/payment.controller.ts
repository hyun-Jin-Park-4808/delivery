import { Controller, UseInterceptors } from '@nestjs/common';
import { PaymentMicroService } from '@app/common';
import { EventPattern, GrpcMethod } from '@nestjs/microservices';
import { GrpcInterceptor } from '@app/common';
import { PaymentMethod } from '../../domain/payment.domain';
import { PaymentService } from '../../application/payment.service';

@Controller()
@UseInterceptors(GrpcInterceptor)
export class PaymentController implements PaymentMicroService.PaymentService {
  constructor(private readonly paymentService: PaymentService) {}

  @GrpcMethod('PaymentService')
  makePayment(request: PaymentMicroService.MakePaymentRequest) {
    return this.paymentService.makePayment({
      ...request,
      paymentMethod: request.paymentMethod as PaymentMethod,
    });
  }

  @EventPattern('order.notification.fail') //  notification에서 이 이벤트가 발생하면 실행된다.
  orderNotificationFail(orderId: string) {
    this.paymentService.cancelPayment(orderId);
  }
}
