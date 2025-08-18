import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerDocument } from './schemas/customers.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginateResponse } from 'src/common/dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<CustomerDocument>,
  ) {}
  async create(createCustomerDto: CreateCustomerDto): Promise<void> {
    const { email } = createCustomerDto;
    const customer = await this.customerModel.findOne({ email });
    if (customer) throw new BadRequestException('Customer already exists');
    await this.customerModel.create(createCustomerDto);
  }

  async editCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<void> {
    const customer = await this.customerModel.findByIdAndUpdate(
      id,
      updateCustomerDto,
    );
    if (!customer) throw new NotFoundException('Customer not found');
  }

  async deleteCustomer(id: string): Promise<void> {
    const customer = await this.customerModel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    if (!customer) throw new NotFoundException('Customer not found');
  }

  async getCustomer(id: string): Promise<CustomerDocument> {
    const customer = await this.customerModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async getCustomers(
    query: PaginationQueryDto,
  ): Promise<PaginateResponse<Customer>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;
    const filter = { isDeleted: false } as const;
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    const [items, total] = await Promise.all([
      this.customerModel.find(filter).sort(sort).skip(skip).limit(limit),
      this.customerModel.countDocuments(filter),
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
}
