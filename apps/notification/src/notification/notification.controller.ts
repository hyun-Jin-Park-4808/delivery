import { NotificationMicroService } from '@app/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { GrpcInterceptor } from '@app/common';

@Controller()
@UseInterceptors(GrpcInterceptor)
export class NotificationController
  implements NotificationMicroService.NotificationService
{
  constructor(private readonly notificationService: NotificationService) {}

  // @MessagePattern({ cmd: 'send_payment_notification' })
  // @UseInterceptors(RpcInterceptor)
  // @UsePipes(ValidationPipe)
  @GrpcMethod('NotificationService')
  async sendPaymentNotification(
    request: NotificationMicroService.SendPaymentNotificationRequest,
    metadata: Metadata,
  ) {
    const resp = (
      await this.notificationService.sendPaymentNotification(request, metadata)
    ).toJSON();

    return {
      ...resp,
      status: resp.status.toString(),
    };
  }
}
