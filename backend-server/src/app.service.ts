import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { userCreatedEvent } from './user-event';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    @Inject('PRODUCT_SERVICE') private readonly productService: ClientProxy,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  getUsers() {
    const users = this.userService.send({ cmd: 'GET_ALL_USER' }, {});
    console.log('users', users);
    return users; // send method for Request-Response
  }
  //  this if use ti service a Event Pattern (Fire-and-Forget)
  // createUser(data: any) {
  //   this.userService.emit('CREATE_USER', new userCreatedEvent(data)); // emit method for Event Pattern (Fire-and-Forget)
  // }
  createUser(data: any) {
    return this.userService.send({ cmd: 'CREATE_USER' }, data); // emit method for Event Pattern (Fire-and-Forget)
  }

  createProduct(data: any) {
    return firstValueFrom(
      this.productService.send('product.create', data).pipe(timeout(5000)),
    );
  }

  getAllProducts() {
    return firstValueFrom(
      this.productService.send('product.get_all_products', {}).pipe(timeout(100000)),
    );
  }
}
