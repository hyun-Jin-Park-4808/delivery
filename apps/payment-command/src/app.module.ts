import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  NOTIFICATION_SERVICE,
  NotificationMicroService,
  traceInterceptor,
} from '@app/common';
import { join } from 'path';
import { PaymentModule } from './payment/payment.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: 5432,
        username: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        // ssl: {
        //   rejectUnauthorized: false,
        // },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGO_DB_URL'),
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
        {
          name: 'KAFKA_SERVICE', // 이벤트를 보내기 위해 등록
          useFactory: () => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'payment-command',
                brokers: ['kafka:9092'],
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
