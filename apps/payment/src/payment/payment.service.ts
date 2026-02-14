import {
  constructMetadata,
  NOTIFICATION_SERVICE,
  NotificationMicroService,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MakePaymentDto } from './dto/make-payment.dto';
import { Payment, PaymentStatus } from './entity/payment.entity';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class PaymentService implements OnModuleInit {
  private notificationService: NotificationMicroService.NotificationService;
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject(NOTIFICATION_SERVICE)
    // private readonly notificationService: ClientProxy,
    private readonly notificationMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService =
      this.notificationMicroService.getService<NotificationMicroService.NotificationService>(
        'NotificationService', // .proto 파일의 service 이름
      );
  }

  async makePayment(payload: MakePaymentDto, metadata: Metadata) {
    let paymentId;
    try {
      const result = await this.paymentRepository.save(payload);
      paymentId = result.id;
      await this.processPayment();
      await this.updatePaymentStatus(paymentId, PaymentStatus.approved);

      this.sendNotification(payload.orderId, payload.userEmail, metadata); // 기다릴 필요없음
      return this.paymentRepository.findOneBy({ id: paymentId });
    } catch (e) {
      if (paymentId) {
        await this.updatePaymentStatus(paymentId, PaymentStatus.rejected);
      }
      throw e;
    }
  }

  async processPayment() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    await this.paymentRepository.update(id, { paymentStatus: status });
  }

  async sendNotification(orderId: string, to: string, metadata: Metadata) {
    this.notificationService.sendPaymentNotification(
      {
        to,
        orderId,
      },
      constructMetadata(PaymentService.name, 'sendNotification', metadata),
    );
  }
}
