import { ProductEntity } from '../../domain/product.entity';

export interface ProductOutputPort {
  getProductByIds(productIds: string[]): Promise<ProductEntity[]>;
}
