import { Inject, Injectable } from '@nestjs/common';
import { SendPaymentNotificationDto } from './dto/send-payment-notifiction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationStatus } from './entity/notification.entity';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_SERVICE } from '@app/common';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @Inject(ORDER_SERVICE)
    private readonly orderService: ClientProxy,
  ) {}

  async sendPaymentNotification(data: SendPaymentNotificationDto) {
    const notification = await this.createNotification(data.to);
    await this.sendEmail();
    await this.updateNotificationStatus(
      notification._id.toString(),
      NotificationStatus.sent,
    );

    // 메시지 패턴 쓰면 Cold Observable 반환받는다: subscribe 전까지는 데이터 안흘러오고, 데이터 stream이 없으면 메시지 던지지 않는다.
    // 이벤트 패턴 쓰면 Hot Observable 받게 된다: stream 존재 여부 상관없이 메시지 던진다.
    this.sendDeliveryStartedMessage(data.orderId); // 기다릴 필요 없음.
    return this.notificationModel.findById(notification._id);
  }

  sendDeliveryStartedMessage(id: string) {
    this.orderService.emit({ cmd: 'delivery_started' }, { id });
  }

  async sendEmail() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async updateNotificationStatus(id: string, status: NotificationStatus) {
    // await 안붙여도 return 값이 Promise이기 때문에 호출쪽에서 await로 기다리면 상관 없음.
    return this.notificationModel.findByIdAndUpdate(id, { status });
  }

  async createNotification(to: string) {
    // await 안붙여도 return 값이 Promise이기 때문에 호출쪽에서 await로 기다리면 상관 없음.
    return this.notificationModel.create({
      from: 'hyunin@gmail.com',
      to,
      subject: '배송이 시작됐습니다.',
      content: `${to}님! 주문하신 물건 배송이 시작되었습니다.`,
    });
  }
}
