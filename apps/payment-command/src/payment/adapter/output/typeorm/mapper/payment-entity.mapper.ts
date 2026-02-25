import { PaymentModel } from 'apps/payment-command/src/payment/domain/payment.domain';
import { PaymentEntity } from '../entity/payment.entity';

export class PaymentEntityMapper {
  constructor(private readonly payment: PaymentEntity) {}

  toDomain(): PaymentModel {
    const payment = new PaymentModel({
      paymentMethod: this.payment.paymentMethod,
      cardNumber: this.payment.cardNumber,
      expiryYear: this.payment.expiryYear,
      expiryMonth: this.payment.expiryMonth,
      birthOrRegistration: this.payment.birthOrRegistration,
      passwordTwoDigits: this.payment.passwordTwoDigits,
      orderId: this.payment.orderId,
      amount: this.payment.amount,
      userEmail: this.payment.userEmail,
    });
    payment.assignId(this.payment.id);
    return payment;
  }
}
