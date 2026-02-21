import { PaymentOutputPort } from 'apps/payment/src/payment/port/output/payment.output-port';
import { PaymentModel } from '../../../domain/payment.domain';

export class PortOneAdapter implements PaymentOutputPort {
  async processPayment(payment: PaymentModel): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
}
