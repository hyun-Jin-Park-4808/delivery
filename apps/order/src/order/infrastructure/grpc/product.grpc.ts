import { Inject, OnModuleInit } from '@nestjs/common';
import { ProductOutputPort } from '../../port/output/product.output-port';
import { ClientGrpc } from '@nestjs/microservices';
import { PRODUCT_SERVICE, ProductMicroService } from '@app/common';
import { ProductEntity } from '../../domain/product.entity';
import { lastValueFrom } from 'rxjs';
import { GetProductsIdsResponseMapper } from './mapper/get-products-info-response.mapper';

export class ProductGrpc implements ProductOutputPort, OnModuleInit {
  productService: ProductMicroService.ProductService;
  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroService: ClientGrpc,
  ) {}
  onModuleInit() {
    this.productService =
      this.productMicroService.getService<ProductMicroService.ProductService>(
        'ProductService',
      );
  }
  async getProductByIds(productIds: string[]): Promise<ProductEntity[]> {
    const resp = (await lastValueFrom(
      this.productService.getProductsInfo({ productIds }) as any,
    )) as ProductMicroService.GetProductsInfoResponse;

    return new GetProductsIdsResponseMapper(resp).toDomain();
  }
}
