import { GrpcInterceptor, OrderMicroService } from '@app/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, GrpcMethod } from '@nestjs/microservices';
import { CreateOrderUseCase } from '../../usecase/create-order.usecase';
import { StartDeliveryUseCase } from '../../usecase/start-delivery.usecase';
import { CreateOrderRequestMapper } from './mapper/create-order-request.mapper';
import { CancelOrderUserCase } from '../../usecase/cancel-order.usercase';

@Controller('order')
export class OrderController implements OrderMicroService.OrderService {
  constructor(
    private readonly createOrderUserCase: CreateOrderUseCase,
    private readonly startDeliveryUseCase: StartDeliveryUseCase,
    private readonly cancelOrderUseCase: CancelOrderUserCase,
  ) {}

  @GrpcMethod('OrderService', 'DeliveryStarted')
  @UseInterceptors(GrpcInterceptor)
  async deliveryStarted(request: OrderMicroService.DeliveryStartedRequest) {
    await this.startDeliveryUseCase.execute(request.id);
    return {};
  }

  @GrpcMethod('OrderService', 'CreateOrder')
  @UseInterceptors(GrpcInterceptor)
  async createOrder(request: OrderMicroService.CreateOrderRequest) {
    return this.createOrderUserCase.execute(
      new CreateOrderRequestMapper(request).toDomain(),
    );
  }

  @EventPattern('order.notification.fail') // notification에서 이 이벤트가 발생하면 실행된다.
  orderNotificationFail(orderId: string) {
    this.cancelOrderUseCase.execute(orderId);
  }
}
