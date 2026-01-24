import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { log } from 'console';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  //  Post all users Event Pattern (Fire-and-Forget) for Microservice
  // @EventPattern('CREATE_USER')
  //   createUser(user:any) {
  //  this.appService.createUser(user);
  //   }
  // Get all users Message Pattern (Request-Response) for Microservice
  @MessagePattern({ cmd: 'CREATE_USER' })
  createUser(user: any) {
    return this.appService.createUser(user);
  }
  @MessagePattern({ cmd: 'GET_ALL_USER' })
  getUsers() {
    return this.appService.getUsers();
  }
}
