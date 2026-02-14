import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ORDER_SERVICE,
  OrderMicroService,
  PRODUCT_SERVICE,
  ProductMicroService,
  USER_SERVICE,
  UserMicroService,
} from '@app/common';
import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { BearerTokenMiddleware } from './auth/middleware/bearer-token.middleware';
import { join } from 'path';
import { traceInterceptor } from '@app/common/grpc';

@Module({
  imports: [
    OrderModule,
    AuthModule,
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.string().required(),
        USER_HOST: Joi.string().required(),
        USER_TCP_PORT: Joi.number().required(),
        PRODUCT_HOST: Joi.string().required(),
        PRODUCT_TCP_PORT: Joi.number().required(),
        ORDER_HOST: Joi.string().required(),
        ORDER_TCP_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: USER_SERVICE, // 통신할 서비스 이름, @Inject(name)으로 IoC 컨테이너에 주입받을 이름
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              channelOptions: {
                interceptors: [traceInterceptor('Gateway')],
              },
              package: UserMicroService.protobufPackage,
              protoPath: join(process.cwd(), 'proto/user.proto'),
              url: configService.getOrThrow('USER_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: PRODUCT_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              channelOptions: {
                interceptors: [traceInterceptor('Gateway')],
              },
              package: ProductMicroService.protobufPackage,
              protoPath: join(process.cwd(), 'proto/product.proto'),
              url: configService.getOrThrow('PRODUCT_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: ORDER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              channelOptions: {
                interceptors: [traceInterceptor('Gateway')],
              },
              package: OrderMicroService.protobufPackage,
              protoPath: join(process.cwd(), 'proto/order.proto'),
              url: configService.getOrThrow('ORDER_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BearerTokenMiddleware).forRoutes('order');
  }
}
