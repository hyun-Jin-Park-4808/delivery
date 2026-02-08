import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createSamples() {
    const data = [
      {
        name: 'Product 1',
        price: 100,
        description: 'Description 1',
        stock: 10,
      },
      {
        name: 'Product 2',
        price: 200,
        description: 'Description 2',
        stock: 20,
      },
      {
        name: 'Product 3',
        price: 300,
        description: 'Description 3',
        stock: 30,
      },
      {
        name: 'Product 4',
        price: 400,
        description: 'Description 4',
        stock: 40,
      },
      {
        name: 'Product 5',
        price: 500,
        description: 'Description 5',
        stock: 50,
      },
    ];

    await this.productRepository.save(data);

    return true;
  }
}
