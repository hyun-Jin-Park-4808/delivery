import { Inject } from '@nestjs/common';
import { PaymentMethod, PaymentModel } from '../domain/payment.domain';
import { DatabaseOutputPort } from '../port/output/database.output-port';
import { NetworkOutputPort } from '../port/output/network.output-port';
import { PaymentOutputPort } from '../port/output/payment.output-port';

export class PaymentService {
  constructor(
    @Inject('DatabaseOutputPort') // 여기서 DatabaseOutputPort 라는 이름으로 등록된 객체 주입받겠다고 명시만 해주면 모듈 쪽에서 자유롭게 apapter를 갈아끼울 수 있다.
    private readonly databaseOutputPort: DatabaseOutputPort,
    @Inject('PaymentOutputPort')
    private readonly paymentOutputPort: PaymentOutputPort,
    @Inject('NetworkOutputPort')
    private readonly networkOutputPort: NetworkOutputPort,
  ) {}

  async makePayment(param: {
    orderId: string;
    userEmail: string;
    paymentMethod: PaymentMethod;
    cardNumber: string;
    expiryYear: string;
    expiryMonth: string;
    birthOrRegistration: string;
    passwordTwoDigits: string;
    amount: number;
  }) {
    // 1) 파라미터로 PaymentModel 생성 -> Domian 기능
    const payment = new PaymentModel(param);

    // 2) PaymentModel 저장 -> Database
    const result = await this.databaseOutputPort.savePayment(payment); // port(인터페이스-추상화)만 가지고서 코드 작성 가능

    // 3) 저장된 데이터의 ID를 PaymentModel에 저장 -> Domain 기능
    payment.assignId(result.id);

    // 4) 결제를 실행 -> PG사로 HTTP 요청
    try {
      await this.paymentOutputPort.processPayment(payment);
      // 5) 결제 데이터를 업데이트 -> Database
      payment.processPayment(); // paymentModel 객체의 결제 상태 변경
      await this.databaseOutputPort.updatePayment(payment);
    } catch (e) {
      // 7) 만약 실패하면 (4, 5) 결제를 거절 -> Database, Domain 기능
      payment.rejectPayment();
      await this.databaseOutputPort.updatePayment(payment);
      return payment;
    }

    // 6) 알림을 보냄 -> gRPC
    this.networkOutputPort.sendNotification(payment.orderId, payment.userEmail);
    return payment;
  }
}
