import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SendPaymentNotificationDto } from './dto/send-payment-notifiction.dto';
import { NotificationService } from './notification.service';
import { RpcInterceptor } from '@app/common';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: 'send_payment_notification' })
  @UseInterceptors(RpcInterceptor)
  @UsePipes(ValidationPipe)
  async sendPaymentNotification(
    @Payload() payload: SendPaymentNotificationDto,
  ) {
    return this.notificationService.sendPaymentNotification(payload);
  }
}
