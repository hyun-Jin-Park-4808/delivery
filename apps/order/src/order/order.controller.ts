import { OrderMicroService } from '@app/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { OrderStatus } from './entity/order.entity';
import { PaymentMethod } from './entity/payment.entity';
import { OrderService } from './order.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { GrpcInterceptor } from '@app/common';

@Controller('order')
@UseInterceptors(GrpcInterceptor)
export class OrderController implements OrderMicroService.OrderService {
  constructor(private readonly orderService: OrderService) {}

  // @Post()
  // @UsePipes(ValidationPipe)
  // async createOrder(
  //   @Authorization() token: string,
  //   @Body() createOrderDto: CreateOrderDto,
  // ) {
  //   return this.orderService.createOrder(token, createOrderDto);
  // }

  // @EventPattern({ cmd: 'delivery_started' })
  // @UseInterceptors(RpcInterceptor)
  @GrpcMethod('OrderService')
  async deliveryStarted(request: OrderMicroService.DeliveryStartedRequest) {
    await this.orderService.changeOrderStatus(
      request.id,
      OrderStatus.deliveryStarted,
    );

    return {};
  }

  // @MessagePattern({ cmd: 'create_order' })
  @GrpcMethod('OrderService')
  async createOrder(
    request: OrderMicroService.CreateOrderRequest,
    metadata: Metadata,
  ) {
    return this.orderService.createOrder(
      {
        ...request,
        payment: {
          ...request.payment,
          paymentMethod: request.payment.paymentMethod as PaymentMethod,
        },
      },
      metadata,
    );
  }
}
