import { GrpcInterceptor, OrderMicroService } from '@app/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateOrderUseCase } from '../../usecase/create-order.usecase';
import { StartDeliveryUseCase } from '../../usecase/start-delivery.usecase';
import { CreateOrderRequestMapper } from './mapper/create-order-request.mapper';

@Controller('order')
@UseInterceptors(GrpcInterceptor)
export class OrderController implements OrderMicroService.OrderService {
  constructor(
    private readonly createOrderUserCase: CreateOrderUseCase,
    private readonly startDeliveryUseCase: StartDeliveryUseCase,
  ) {}

  @GrpcMethod('OrderService')
  async deliveryStarted(request: OrderMicroService.DeliveryStartedRequest) {
    await this.startDeliveryUseCase.execute(request.id);
    return {};
  }

  @GrpcMethod('OrderService')
  async createOrder(request: OrderMicroService.CreateOrderRequest) {
    return this.createOrderUserCase.execute(
      new CreateOrderRequestMapper(request).toDomain(),
    );
  }
}
