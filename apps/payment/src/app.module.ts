import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { PaymentModule } from './payment/payment.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  NOTIFICATION_SERVICE,
  NotificationMicroService,
  traceInterceptor,
} from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow('DB_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: NOTIFICATION_SERVICE, // 통신할 서비스 이름, @Inject(name)으로 주입받음.
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              channelOptions: {
                interceptors: [traceInterceptor('Payment')],
              },
              package: NotificationMicroService.protobufPackage,
              protoPath: join(process.cwd(), 'proto/notification.proto'),
              url: configService.getOrThrow('NOTIFICATION_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
