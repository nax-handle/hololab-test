import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_STATUS } from 'src/common/enums';
import { OrdersPaginationQueryDto } from './dto/orders-pagination-query.dto';
import { convertToObjectId, getDateRange } from 'src/utils';
import { CustomersService } from '../customers/customers.service';
import { OrderRepository } from './repositories/order.repository';
import { PaginateResponse } from 'src/common/dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    private customerService: CustomersService,
    private orderRepository: OrderRepository,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<void> {
    const customer = await this.customerService.findUserByEmailOrId(
      createOrderDto.customer,
    );
    if (!customer) throw new NotFoundException('User not found');
    await this.orderModel.create({
      ...createOrderDto,
      customer: customer._id,
    });
  }

  async findAll(
    query: OrdersPaginationQueryDto,
  ): Promise<PaginateResponse<Order>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      minTotalAmount,
      maxTotalAmount,
      fromDate,
      toDate,
      customer,
      search,
      orderType,
    } = query;
    const skip = (page - 1) * limit;
    const filter: FilterQuery<Order> = { isDeleted: false };
    if (status) filter.status = status;
    if (search) {
      const searchConditions: FilterQuery<Order>[] = [
        { customer: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
      if (/^[0-9a-fA-F]{24}$/.test(search)) {
        searchConditions.push({ _id: convertToObjectId(search) });
      }
      filter.$or = searchConditions;
    }
    if (minTotalAmount != null || maxTotalAmount != null) {
      filter.totalAmount = {
        ...(minTotalAmount != null ? { $gte: minTotalAmount } : {}),
        ...(maxTotalAmount != null ? { $lte: maxTotalAmount } : {}),
      };
    }
    if (fromDate || toDate) {
      filter.createdAt = {
        ...(fromDate ? { $gte: fromDate } : {}),
        ...(toDate ? { $lte: toDate } : {}),
      };
    }
    if (customer) {
      filter.customer = convertToObjectId(customer);
    }
    if (orderType) {
      filter.orderType = orderType;
    }
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    const [items, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .populate('customer')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.orderModel.countDocuments(filter),
    ]);
    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findOne({ _id: convertToObjectId(id), isDeleted: false })
      .populate('customer');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, next: ORDER_STATUS) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status === next)
      throw new BadRequestException('Status unchanged');
    if (
      order.status === ORDER_STATUS.COMPLETED ||
      order.status === ORDER_STATUS.CANCELLED
    )
      throw new BadRequestException(
        `Order already ${order.status}, cannot change`,
      );
    const allowed: Record<ORDER_STATUS, ORDER_STATUS[]> = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PROCESSING]: [
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.CANCELLED,
      ],
      [ORDER_STATUS.COMPLETED]: [],
      [ORDER_STATUS.CANCELLED]: [],
    };
    if (!allowed[order.status].includes(next))
      throw new BadRequestException(
        `Invalid transition ${order.status} -> ${next}`,
      );

    const update: Partial<Order> = { status: next };
    if (next === ORDER_STATUS.COMPLETED) update.completedAt = new Date();

    await this.orderModel.updateOne({ _id: id }, update);
    return { id, status: next };
  }
  async remove(id: string): Promise<void> {
    const order = await this.orderModel.findById(id, {
      isDeleted: false,
    });
    if (!order) throw new NotFoundException('Order not found');

    if (order.status === ORDER_STATUS.PENDING) {
      await order.updateOne({ isDeleted: true });
      return;
    }
    throw new BadRequestException(`Cannot delete ${order.status} order`);
  }

  async bulkDelete(orderIds: string[]): Promise<{ deletedCount: number }> {
    if (!orderIds || orderIds.length === 0) {
      throw new BadRequestException('Order IDs array cannot be empty');
    }

    const result = await this.orderModel.updateMany(
      {
        _id: { $in: orderIds },
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
    );

    return { deletedCount: result.modifiedCount };
  }
  async getOrderOverview(fromDate: string, toDate: string) {
    return this.orderRepository.getOrderOverview(fromDate, toDate);
  }
  async getOrderChart(range: string) {
    const data = getDateRange(range);
    return { data: await this.orderRepository.getChartData(data), range };
  }
}
