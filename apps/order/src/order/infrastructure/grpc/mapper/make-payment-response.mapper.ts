import { PaymentMicroService } from '@app/common';
import { OrderEntity } from '../../../domain/order.entity';
import { PaymentMethod } from '../../../domain/payment.entity';
import { PaymentDto } from '../../../usecase/dto/create-order.dto';

export class MakePaymentResponseMapper {
  constructor(
    private readonly response: PaymentMicroService.MakePaymentResponse,
  ) {}

  toDomain(order: OrderEntity, payment: PaymentDto): OrderEntity {
    order.setPayment({
      ...payment,
      ...this.response,
      paymentId: this.response.id,
      paymentMethod: this.parsePaymentMethod(this.response.paymentMethod),
    });

    return order;
  }

  private parsePaymentMethod(paymentMethod: string): PaymentMethod {
    switch (paymentMethod) {
      case 'CreditCard':
        return PaymentMethod.creditCard;
      case 'KakaoPay':
        return PaymentMethod.kakaoPay;
      default:
        throw new Error('Invalid payment method');
    }
  }
}
