import { ProductMicroService } from '@app/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcInterceptor } from '@app/common';

@Controller('product')
@UseInterceptors(GrpcInterceptor)
export class ProductController implements ProductMicroService.ProductService {
  constructor(private readonly productService: ProductService) {}

  // @MessagePattern('create_samples')
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  @GrpcMethod('ProductService')
  async createSamples() {
    const resp = await this.productService.createSamples();
    return {
      success: true,
    };
  }

  // @MessagePattern({ cmd: 'get_products_info' })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  @GrpcMethod('ProductService')
  async getProductsInfo(request: ProductMicroService.GetProductsInfoRequest) {
    const resp = await this.productService.getProductsInfo(request.productIds);
    return {
      productInfos: resp,
    };
  }
}
