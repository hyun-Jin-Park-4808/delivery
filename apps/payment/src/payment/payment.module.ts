import { Module } from '@nestjs/common';
import { PaymentController } from './adapter/input/payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './adapter/output/typeorm/entity/payment.entity';
import { PaymentService } from './application/payment.service';
import { TypeOrmAdapter } from './adapter/output/typeorm/typeorm.adapter';
import { PortOneAdapter } from './adapter/output/portone/portone.adapter';
import { GrpcAdapter } from './adapter/output/grpc/grpc.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    { provide: 'DatabaseOutputPort', useClass: TypeOrmAdapter },
    { provide: 'PaymentOutputPort', useClass: PortOneAdapter },
    { provide: 'NetworkOutputPort', useClass: GrpcAdapter },
  ],
})
export class PaymentModule {}
