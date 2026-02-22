import { CustomerEntity } from './customer.entity';
import { DeliveryAddressEntity } from './delivery-address.entity';
import { PaymentEntity } from './payment.entity';
import { ProductEntity } from './product.entity';

export enum OrderStatus {
  pending = 'Pending',
  paymentCanceled = 'PaymentCanceled',
  paymentFailed = 'PaymentFailed',
  paymentProcessed = 'PaymentProcessed',
  deliveryStarted = 'DeliveryStarted',
  deliveryDone = 'DeliveryDone',
}

export class OrderEntity {
  id: string;
  customer: CustomerEntity;
  deliveryAddress: DeliveryAddressEntity;
  products: ProductEntity[];
  status: OrderStatus;
  payment: PaymentEntity;
  totalAmount: number;

  constructor(param: {
    customer: CustomerEntity;
    products: ProductEntity[];
    deliveryAddress: DeliveryAddressEntity;
  }) {
    this.customer = param.customer;
    this.products = param.products;
    this.deliveryAddress = param.deliveryAddress;
  }

  setId(id: string) {
    this.id = id;
  }

  setPayment(payment: PaymentEntity) {
    if (!this.id) {
      throw new Error('ID가 없는 주문에는 결제를 세팅할 수 없습니다.');
    }
    this.payment = payment;
  }

  calculateTotalAmount() {
    if (this.products.length === 0) {
      throw new Error('상품이 없습니다.');
    }
    const total = this.products.reduce(
      (acc, product) => acc + product.price,
      0,
    );
    this.totalAmount = total;
  }

  processPayment() {
    if (!this.id) {
      throw new Error('ID가 없는 주문에는 결제를 처리할 수 없습니다.');
    }
    if (this.products.length === 0) {
      throw new Error('상품이 없습니다.');
    }
    if (!this.deliveryAddress) {
      throw new Error('배송지가 없습니다.');
    }
    if (!this.totalAmount) {
      throw new Error('결제를 진행하려면 결제 총액이 필수입니다.');
    }
    if (this.status !== OrderStatus.pending) {
      throw new Error('결제는 대기 상태에서만 가능합니다.');
    }
    this.status = OrderStatus.paymentProcessed;
  }

  cancelOrder() {
    this.status = OrderStatus.paymentCanceled;
  }

  startDelivery() {
    if (this.status !== OrderStatus.paymentProcessed) {
      throw new Error('배송은 결제가 완료된 주문에서만 가능합니다.');
    }
    this.status = OrderStatus.deliveryStarted;
  }

  finishDelivery() {
    if (this.status !== OrderStatus.deliveryStarted) {
      throw new Error('배송 완료는 배송 시작 상태에서만 가능합니다.');
    }
    this.status = OrderStatus.deliveryDone;
  }
}
