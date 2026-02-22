export enum PaymentMethod {
  creditCard = 'CreditCard',
  kakaoPay = 'KakaoPay',
}

export class PaymentEntity {
  paymentId: string;
  paymentMethod: PaymentMethod;
  paymentName: string;
  amount: number;

  constructor(param: PaymentEntity) {
    this.paymentId = param.paymentId;
    this.paymentMethod = param.paymentMethod;
    this.paymentName = param.paymentName;
    this.amount = param.amount;
  }
}
