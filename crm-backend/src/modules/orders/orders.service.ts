import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  create(createOrderDto: CreateOrderDto) {
    return { message: 'This action adds a new order', data: createOrderDto };
  }

  findAll() {
    return { message: 'This action returns all orders' };
  }

  findOne(id: string) {
    return { message: `This action returns a #${id} order` };
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return {
      message: `This action updates a #${id} order`,
      data: updateOrderDto,
    };
  }

  remove(id: string) {
    return { message: `This action removes a #${id} order` };
  }
}
