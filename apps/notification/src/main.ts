import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    // microservice를 연결
    transport: Transport.REDIS, // 어떤 방식으로 microservice들을 통신할 것인지
    options: {
      host: 'redis',
      port: 6379,
    },
  });

  await app.startAllMicroservices(); // microservice들을 실행하겠다.
}
bootstrap();
