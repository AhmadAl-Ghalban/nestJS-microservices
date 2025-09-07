import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URI!],
        queue: process.env.PRODUCTS_RPC_QUEUE || 'products_rpc',
        queueOptions: {
          durable: false,
        },
        noAck: true,
        prefetchCount: 1, // avoid multiple in-flight per consumer

        // 👇 IMPORTANT: provide socketOptions so driver has heartbeat/reconnect values
        socketOptions: {
          heartbeatIntervalInSeconds: 60,
          reconnectTimeInSeconds: 5,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
