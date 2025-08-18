import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { OrdersModule } from './modules/orders/orders.module';
import { CustomersModule } from './modules/customers/customers.module';
import { MongoDbModule } from './databases/mongodb.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrdersModule,
    CustomersModule,
    MongoDbModule,
  ],
  providers: [AppService],
})
export class AppModule {}
