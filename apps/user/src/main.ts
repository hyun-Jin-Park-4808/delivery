import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    // microservice를 연결
    transport: Transport.TCP, // 어떤 방식으로 microservice들을 통신할 것인지
    options: {
      host: '0.0.0.0', // 모든 곳에서 통신을 다 받겠다.
      port: Number(process.env.TCP_PORT) ?? 6001,
    },
  });

  await app.startAllMicroservices(); // microservice들을 실행하겠다.
  await app.listen(process.env.HTTP_PORT ?? 3000);
}
bootstrap();
