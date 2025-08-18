import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ResponseMessage } from 'src/common/decorators';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ResponseMessage('Customer created successfully')
  @ApiOperation({ summary: 'Create customer' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({ status: 201, description: 'Customer created' })
  addCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Patch(':id')
  @ResponseMessage('Customer updated successfully')
  @ApiOperation({ summary: 'Edit customer' })
  @ApiResponse({ status: 200, description: 'Customer updated' })
  @ApiBody({ type: UpdateCustomerDto })
  editCustomer(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Param('id') id: string,
  ) {
    return this.customersService.editCustomer(id, updateCustomerDto);
  }

  @Get()
  @ResponseMessage('Customers fetched successfully')
  @ApiOperation({ summary: 'Get customers' })
  @ApiResponse({
    status: 200,
    description: 'Customers list',
  })
  getCustomers(@Query() query: PaginationQueryDto) {
    return this.customersService.getCustomers(query);
  }

  @Get(':id')
  @ResponseMessage('Customer fetched successfully')
  @ApiOperation({ summary: 'Get customer by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Customer detail' })
  getCustomer(@Param('id') id: string) {
    return this.customersService.getCustomer(id);
  }

  @Delete(':id')
  @ResponseMessage('Customer deleted successfully')
  @ApiOperation({ summary: 'Delete customer' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Customer removed' })
  deleteCustomer(@Param('id') id: string) {
    return this.customersService.deleteCustomer(id);
  }
}
