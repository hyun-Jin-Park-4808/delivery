import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './infrastructure/framework/order.controller';
import {
  OrderDocument,
  OrderSchema,
} from './infrastructure/mongoose/document/order.document';
import { CreateOrderUseCase } from './usecase/create-order.usecase';
import { StartDeliveryUseCase } from './usecase/start-delivery.usecase';
import { OrderRepository } from './infrastructure/mongoose/repository/order.repository';
import { UserGrpc } from './infrastructure/grpc/user.grpc';
import { ProductGrpc } from './infrastructure/grpc/product.grpc';
import { PaymentGrpc } from './infrastructure/grpc/payment.grpc';
import { CancelOrderUserCase } from './usecase/cancel-order.usercase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    StartDeliveryUseCase,
    CancelOrderUserCase,
    {
      provide: 'OrderOutputPort',
      useClass: OrderRepository,
    },
    {
      provide: 'UserOutputPort',
      useClass: UserGrpc,
    },
    {
      provide: 'ProductOutputPort',
      useClass: ProductGrpc,
    },
    {
      provide: 'PaymentOutputPort',
      useClass: PaymentGrpc,
    },
  ],
})
export class OrderModule {}
