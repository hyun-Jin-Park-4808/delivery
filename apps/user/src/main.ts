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

  await app.init(); // onModuleInit()이 가끔 실행이 안 될 때가 있어서 여기서 init()해주면 무조건 실행된다.

  await app.startAllMicroservices(); // microservice들을 실행하겠다.
}
bootstrap();
