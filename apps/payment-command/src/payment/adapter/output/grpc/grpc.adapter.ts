import { NOTIFICATION_SERVICE, NotificationMicroService } from '@app/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { NetworkOutputPort } from 'apps/payment-command/src/payment/port/output/network.output-port';
import { lastValueFrom } from 'rxjs';

export class GrpcAdapter implements NetworkOutputPort, OnModuleInit {
  private notificationService: NotificationMicroService.NotificationService;

  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService =
      this.notificationMicroService.getService<NotificationMicroService.NotificationService>(
        'NotificationService', // .proto 파일의 service 이름
      );
  }
  async sendNotification(orderId: string, to: string): Promise<void> {
    await lastValueFrom(
      this.notificationService.sendPaymentNotification({
        to,
        orderId,
      }) as any,
    );
  }
}
