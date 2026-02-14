import {
  constructMetadata,
  PAYMENT_SERVICE,
  PaymentMicroService,
  PRODUCT_SERVICE,
  ProductMicroService,
  USER_SERVICE,
  UserMicroService,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddressDto } from './dto/address.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentDto } from './dto/payment.dto';
import { Customer } from './entity/customer.entity';
import { Order, OrderStatus } from './entity/order.entity';
import { Product } from './entity/product.entity';
import { PaymentCancelledException } from './exception/payment-cancelled.exception';
import { PaymentFailedException } from './exception/payment-failed.exception';
import { lastValueFrom, Observable } from 'rxjs';
import { GetUserInfoResponse } from '@app/common/grpc/proto/user';
import { GetProductsInfoResponse } from '@app/common/grpc/proto/product';
import { MakePaymentResponse } from '@app/common/grpc/proto/payment';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class OrderService implements OnModuleInit {
  private userService: UserMicroService.UserService;
  private productService: ProductMicroService.ProductService;
  private paymentService: PaymentMicroService.PaymentService;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroService: ClientGrpc,
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroService: ClientGrpc,
    @Inject(PAYMENT_SERVICE)
    private readonly paymentMicroService: ClientGrpc,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  onModuleInit() {
    this.userService =
      this.userMicroService.getService<UserMicroService.UserService>(
        'UserService',
      );
    this.productService =
      this.productMicroService.getService<ProductMicroService.ProductService>(
        'ProductService',
      );
    this.paymentService =
      this.paymentMicroService.getService<PaymentMicroService.PaymentService>(
        'PaymentService',
      );
  }
  async createOrder(createOrderDto: CreateOrderDto, metadata: Metadata) {
    const { meta, productIds, address, payment } = createOrderDto;

    // 1) 사용자 정보 가져오기
    const user = await this.getUserFromToken(meta.user.sub, metadata);

    // 2) 상품 정보 가져오기
    const products = await this.getProductsByIds(productIds, metadata);

    // 3) 총 금액 계산하기
    const totalAmount = this.calculateTotalAmount(products);

    // 4) 금액 검증하기 - total 맞는지(프론트에서 보내준 데이터랑)
    this.validatePaymentAmount(totalAmount, payment.amount);

    // 5) 주문 생성하기
    const customer = this.createCustomer(user);
    const order = await this.createNewOrder(
      customer,
      products,
      address,
      payment,
    );

    // 6) 결제 시도하기, 주문 상태 업데이트
    await this.processPayment(
      order._id.toString(),
      payment,
      user.email,
      metadata,
    );

    // 7) 결과 반환하기
    return this.orderModel.findById(order._id);
  }

  private async getUserFromToken(userId: string, metadata: Metadata) {
    // // 1) User MS: JWT 토큰 검증
    // const tokenResp = await lastValueFrom(
    //   // RxJS의 Observable을 Promise로 바꿔주는 함수, Observable을 Promise로 변환하여 await 가능하게 만듦
    //   this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    // ); // send(): messagePattern을 사용, emit(): eventPattern을 사용

    // if (tokenResp.status === 'error') {
    //   throw new PaymentCancelledException(tokenResp);
    // }

    // // 2) User MS; 사용자 정보 가져오기
    // const userId = tokenResp.data.sub;
    const userResp = await lastValueFrom(
      this.userService.getUserInfo(
        {
          userId,
        },
        constructMetadata(OrderService.name, 'getUserFromToken', metadata),
      ) as unknown as Observable<GetUserInfoResponse>,
    );

    return userResp;
  }

  private async getProductsByIds(
    productIds: string[],
    metadata: Metadata,
  ): Promise<Product[]> {
    const resp = await lastValueFrom(
      this.productService.getProductsInfo(
        {
          productIds,
        },
        constructMetadata(OrderService.name, 'getProductsByIds', metadata),
      ) as unknown as Observable<GetProductsInfoResponse>,
    );

    // Product entity로 전환
    return resp.productInfos.map((product) => ({
      productId: product.id,
      name: product.name,
      price: product.price,
    }));
  }

  private calculateTotalAmount(products: Product[]) {
    return products.reduce(
      (total, currentProduct) => total + currentProduct.price,
      0,
    );
  }

  private validatePaymentAmount(totalA: number, totalB: number) {
    if (totalA !== totalB) {
      throw new PaymentCancelledException('결제하려는 금액이 변경되었습니다.');
    }
  }

  private createCustomer(user: { id: string; email: string; name: string }) {
    return {
      userId: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private async createNewOrder(
    customer: Customer,
    products: Product[],
    deliveryAddress: AddressDto,
    payment: PaymentDto,
  ) {
    return await this.orderModel.create({
      customer,
      products,
      deliveryAddress,
      payment,
    });
  }

  private async processPayment(
    orderId: string,
    payment: PaymentDto,
    userEmail: string,
    metadata: Metadata,
  ) {
    try {
      const resp = await lastValueFrom(
        this.paymentService.makePayment(
          {
            ...payment,
            userEmail,
            orderId,
          },
          constructMetadata(OrderService.name, 'processPayment', metadata),
        ) as unknown as Observable<MakePaymentResponse>,
      );

      const isPaid = resp.paymentStatus === 'Approved';
      const orderStatus = isPaid
        ? OrderStatus.paymentProcessed
        : OrderStatus.paymentFailed;

      if (orderStatus === OrderStatus.paymentFailed) {
        throw new PaymentFailedException('결제가 실패했습니다.');
      }

      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatus.paymentProcessed,
      });
      return resp;
    } catch (error) {
      if (error instanceof PaymentFailedException) {
        await this.orderModel.findByIdAndUpdate(orderId, {
          status: OrderStatus.paymentFailed,
        });
      }
      throw new PaymentFailedException(error.message || '결제가 실패했습니다.');
    }
  }

  changeOrderStatus(orderId: string, status: OrderStatus) {
    return this.orderModel.findByIdAndUpdate(orderId, { status });
  }
}
