import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserMicroService } from '@app/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    // microservice를 연결
    transport: Transport.GRPC, // 어떤 방식으로 microservice들을 통신할 것인지
    options: {
      package: UserMicroService.protobufPackage,
      protoPath: join(process.cwd(), 'proto/user.proto'),
      url: configService.get('GRPC_URL'),
    },
  });

  await app.startAllMicroservices(); // microservice들을 실행하겠다.
}
bootstrap();
