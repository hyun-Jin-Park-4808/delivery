import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from '../entity/payment.entity';

export class MakePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  paymentName: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  expiryYear: string;

  @IsString()
  @IsNotEmpty()
  expiryMonth: string;

  @IsString()
  @IsNotEmpty()
  birthOrRegistration: string;

  @IsString()
  @IsNotEmpty()
  passwordTwoDigits: string;

  @IsString()
  @IsNotEmpty()
  userEmail: string;
}
