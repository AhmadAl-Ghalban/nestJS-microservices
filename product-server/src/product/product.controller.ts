import { Body, Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService, ) {}

  @MessagePattern('product.create')
  async createProduct(@Payload() data: CreateProductDto, @Ctx() context: RmqContext) {

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const res = await this.productService.create(data);
      return res;
    } finally {
      // channel.ack(originalMsg);
    }
  }
  @MessagePattern('product.get_all_products')
async  getAllProducts(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const res = await this.productService.findAll();
      const user = await this.productService.getUser();
      return {res, user};
    } finally {
      // channel.ack(originalMsg);
    }
  }
  @MessagePattern({ cmd: 'health.ping' })
  ping(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMsg = ctx.getMessage();
    channel.ack(originalMsg);
    return 'pong';
  }
  
}
