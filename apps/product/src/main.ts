import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ProductMicroService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    // microservice를 연결
    transport: Transport.GRPC, // 어떤 방식으로 microservice들을 통신할 것인지
    options: {
      package: ProductMicroService.protobufPackage,
      protoPath: join(process.cwd(), 'proto/product.proto'),
      url: configService.getOrThrow('GRPC_URL'),
    },
  });

  await app.init();

  await app.startAllMicroservices(); // microservice들을 실행하겠다.
}
bootstrap();
