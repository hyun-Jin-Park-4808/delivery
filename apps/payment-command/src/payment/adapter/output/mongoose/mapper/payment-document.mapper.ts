import { PaymentModel } from 'apps/payment-command/src/payment/domain/payment.domain';
import { PaymentDocument } from '../document/payment.document';

export class PaymentDocumentMapper {
  constructor(private readonly document: PaymentDocument) {}

  toDomain(): PaymentModel {
    const model = new PaymentModel({
      paymentMethod: this.document.paymentMethod,
      cardNumber: this.document.cardNumber,
      expiryYear: this.document.expiryYear,
      expiryMonth: this.document.expiryMonth,
      birthOrRegistration: this.document.birthOrRegistration,
      passwordTwoDigits: this.document.passwordTwoDigits,
      orderId: this.document.orderId,
      amount: this.document.amount,
      userEmail: this.document.userEmail,
    });
    model.assignId(this.document._id.toString());
    return model;
  }

  toPaymentQueryMicroservicePayload() {
    return {
      _id: this.document._id,
      orderId: this.document.orderId,
      userEmail: this.document.userEmail,
      amount: this.document.amount,
      paymentStatus: this.document.paymentStatus,
      cardNumberLastFourDigits: this.document.cardNumber.slice(-4),
    };
  }
}
