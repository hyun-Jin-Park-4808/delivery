import { ProductMicroService } from '@app/common';
import { ProductEntity } from '../../../domain/product.entity';

export class GetProductsIdsResponseMapper {
  constructor(
    private readonly response: ProductMicroService.GetProductsInfoResponse,
  ) {}

  toDomain(): ProductEntity[] {
    return this.response.productInfos.map(
      (product) =>
        new ProductEntity({
          productId: product.id,
          name: product.name,
          price: product.price,
        }),
    );
  }
}
