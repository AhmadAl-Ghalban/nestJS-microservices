import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schemas/product.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ClientsModule.register([
 {
        name: 'USER_SERVICE',
        transport: Transport.TCP, // Transport.TCP
        options: {
          host: 'localhost',
          port: 3002,
        },
      }, 
    ])],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
