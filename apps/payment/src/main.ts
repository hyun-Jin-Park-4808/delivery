import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    // microservice를 연결
    transport: Transport.RMQ, // 어떤 방식으로 microservice들을 통신할 것인지
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'payment_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices(); // microservice들을 실행하겠다.
}
bootstrap();
