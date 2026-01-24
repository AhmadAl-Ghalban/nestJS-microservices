import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP, // Transport.TCP
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'products_rpc',
          queueOptions: {
            durable: false,
          },
          noAck: true,
          // socketOptions: {
          //   heartbeatIntervalInSeconds: 60,
          //   reconnectTimeInSeconds: 5,
          // },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
