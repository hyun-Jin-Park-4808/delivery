import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        // kafka에 연결하는 내 서버 정보
        clientId: 'payment-query', // 내 이름이 뭔지 kafka한테 알려주는거
        brokers: ['kafka:9092'], // kafka가 어디있는지 알려주는거
      },
      consumer: {
        // 같은 groupId를 가진 컨슈머들은 같은 토픽의 메시지를 순서대로 나눠서 가져감.
        // 다른 groupId를 가진 컨슈머들은 같은 토픽의 메시지를 복제해서 각각 가져감.
        groupId: 'payment-update-consumer',
      },
    },
  });

  await app.init();

  await app.startAllMicroservices();

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
