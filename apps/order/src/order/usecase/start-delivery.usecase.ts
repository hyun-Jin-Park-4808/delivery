import { Inject, Injectable } from '@nestjs/common';
import { OrderOutputPort } from '../port/output/order.output-port';

@Injectable()
export class StartDeliveryUseCase {
  constructor(
    @Inject('OrderOutputPort')
    private readonly orderOutputPort: OrderOutputPort,
  ) {}

  async execute(orderId: string) {
    // 1) 주문을 가져온다. - Order
    const order = await this.orderOutputPort.getOrder(orderId);
    // 2) 배송을 시작한다. - Order
    order.startDelivery();
    // 3) 변경된 주문을 저장한다. - Order
    await this.orderOutputPort.updateOrder(order);
  }
}
