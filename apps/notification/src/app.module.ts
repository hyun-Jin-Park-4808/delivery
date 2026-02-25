import {
  ORDER_SERVICE,
  OrderMicroService,
  traceInterceptor,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('DB_URL'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: ORDER_SERVICE, // 통신할 서비스 이름, @Inject(name)으로 주입받음.
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              channelOptions: {
                interceptors: [traceInterceptor('Notification')],
              },
              package: OrderMicroService.protobufPackage,
              protoPath: join(process.cwd(), 'proto/order.proto'),
              url: configService.getOrThrow('ORDER_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: 'KAFKA_SERVICE',
          useFactory: () => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'notification',
                brokers: ['kafka:9092'],
              },
              consumer: {
                groupId: 'notification-consumer',
              },
            },
          }),
        },
      ],
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
