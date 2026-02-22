import { OrderMicroService } from '@app/common';
import { PaymentMethod } from '../../../domain/payment.entity';
import { CreateOrderDto } from '../../../usecase/dto/create-order.dto';

export class CreateOrderRequestMapper {
  constructor(private readonly request: OrderMicroService.CreateOrderRequest) {}

  toDomain(): CreateOrderDto {
    return {
      userId: this.request.meta.user.sub,
      productIds: this.request.productIds,
      address: this.request.address,
      payment: {
        ...this.request.payment,
        paymentMethod: this.parsePaymentMethod(
          this.request.payment.paymentMethod,
        ),
      },
    };
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
