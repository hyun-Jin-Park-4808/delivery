import {
  constructMetadata,
  PRODUCT_SERVICE,
  ProductMicroService,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class ProductService implements OnModuleInit {
  private productService: ProductMicroService.ProductService;
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

  createSamples() {
    return this.productService.createSamples(
      {},
      constructMetadata(ProductService.name, 'createSamples'),
    );
  }
}
