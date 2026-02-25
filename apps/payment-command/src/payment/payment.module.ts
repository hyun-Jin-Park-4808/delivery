import { Module } from '@nestjs/common';
import { PaymentController } from './adapter/input/payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './adapter/output/typeorm/entity/payment.entity';
import { PaymentService } from './application/payment.service';
import { TypeOrmAdapter } from './adapter/output/typeorm/typeorm.adapter';
import { PortOneAdapter } from './adapter/output/portone/portone.adapter';
import { GrpcAdapter } from './adapter/output/grpc/grpc.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentDocument,
  PaymentSchema,
} from './adapter/output/mongoose/document/payment.document';
import { MongooseAdapter } from './adapter/output/mongoose/mongoose.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    MongooseModule.forFeature([
      { name: PaymentDocument.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    { provide: 'DatabaseOutputPort', useClass: MongooseAdapter },
    { provide: 'PaymentOutputPort', useClass: PortOneAdapter },
    { provide: 'NetworkOutputPort', useClass: GrpcAdapter },
  ],
})
export class PaymentModule {}
