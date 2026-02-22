import { OrderEntity } from '../../../domain/order.entity';
import { PaymentDto } from '../../../usecase/dto/create-order.dto';

export class OrderEntityMapper {
  constructor(private readonly order: OrderEntity) {}

  toMakePaymentRequest(payment: PaymentDto) {
    return {
      orderId: this.order.id,
      paymentMethod: payment.paymentMethod,
      paymentName: payment.paymentName,
      cardNumber: payment.cardNumber,
      expiryYear: payment.expiryYear,
      expiryMonth: payment.expiryMonth,
      birthOrRegistration: payment.birthOrRegistration,
      passwordTwoDigits: payment.passwordTwoDigits,
      amount: this.order.totalAmount,
      userEmail: this.order.customer.email,
    };
  }
}
