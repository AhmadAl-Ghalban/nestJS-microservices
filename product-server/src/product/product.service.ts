// src/product/product.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schemas';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  async create(dto: CreateProductDto) {
    console.log(
      '🚀 ~ product.service.ts:15 ~ ProductService ~ create ~ dto:',
      dto,
    );
    try {
      const sku = uuidv4();
      const data = { ...dto, sku: sku }; // trim SKU if provided
      const doc = await this.productModel.create(data);
      return doc.toObject();
    } catch (e: any) {
      if (e?.code === 11000) {
        // duplicate key (e.g., SKU)
        throw new Error('CONFLICT: duplicate key');
      }
      throw e;
    }
  }

  async findAll() {
    return this.productModel.find().lean().exec();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new Error('BAD_REQUEST: invalid id');
    const doc = await this.productModel.findById(id).lean().exec();
    if (!doc) throw new Error('NOT_FOUND');
    return doc;
  }

  async update(id: string, dto: UpdateProductDto) {
    if (!isValidObjectId(id)) throw new Error('BAD_REQUEST: invalid id');
    const doc = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean()
      .exec();
    if (!doc) throw new Error('NOT_FOUND');
    return doc;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new Error('BAD_REQUEST: invalid id');
    const doc = await this.productModel.findByIdAndDelete(id).lean().exec();
    if (!doc) throw new Error('NOT_FOUND');
    return { deleted: true, id };
  }
  getUser() {
    const user = firstValueFrom(
      this.userService.send({ cmd: 'GET_ALL_USER' }, {}),
    );

    return user;
  }
}
