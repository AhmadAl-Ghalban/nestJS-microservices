import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/products'), ProductModule,ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
 {
        name: 'USER_SERVICE',
        transport: Transport.TCP, // Transport.TCP
        options: {
          host: 'localhost',
          port: 3002,
        },
      }, 
    ])
  ],
  controllers: [AppController, ProductController],
  providers: [AppService],
})
export class AppModule {}
