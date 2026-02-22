import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class ProductDocument {
  // order 도메인에서 관심있는 컬럼만 들고 있으면 된다.
  @Prop({
    required: true,
  })
  productId: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(ProductDocument);
