import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PaymentMicroService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    // microservice를 연결
    transport: Transport.GRPC, // 어떤 방식으로 microservice들을 통신할 것인지
    options: {
      package: PaymentMicroService.protobufPackage,
      protoPath: join(process.cwd(), 'proto/payment.proto'),
      url: configService.getOrThrow('GRPC_URL'),
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'payment-command',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'payment-command-consumer',
      },
    },
  });

  await app.init();

  await app.startAllMicroservices(); // microservice들을 실행하겠다.
}
bootstrap();
