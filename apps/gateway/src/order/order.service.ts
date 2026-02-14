import {
  constructMetadata,
  ORDER_SERVICE,
  OrderMicroService,
  UserPayloadDto,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService implements OnModuleInit {
  private orderService: OrderMicroService.OrderService;
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly orderMicroService: ClientGrpc,
  ) {}
  onModuleInit() {
    this.orderService =
      this.orderMicroService.getService<OrderMicroService.OrderService>(
        'OrderService',
      );
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    userPayload: UserPayloadDto,
  ) {
    return this.orderService.createOrder(
      {
        ...createOrderDto,
        meta: {
          user: userPayload,
        },
      },
      constructMetadata(OrderService.name, 'createOrder'),
    );
  }
}
