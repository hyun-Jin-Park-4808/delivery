import { Controller, UseInterceptors } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentMicroService } from '@app/common';
import { PaymentMethod } from './entity/payment.entity';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { GrpcInterceptor } from '@app/common';

@Controller()
@UseInterceptors(GrpcInterceptor)
export class PaymentController implements PaymentMicroService.PaymentService {
  constructor(private readonly paymentService: PaymentService) {}

  // @MessagePattern({ cmd: 'make_payment' })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  @GrpcMethod('PaymentService')
  makePayment(
    request: PaymentMicroService.MakePaymentRequest,
    metadata: Metadata,
  ) {
    return this.paymentService.makePayment(
      {
        ...request,
        paymentMethod: request.paymentMethod as PaymentMethod,
      },
      metadata,
    );
  }
}
