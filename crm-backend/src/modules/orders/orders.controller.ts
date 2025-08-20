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
import { OrdersService } from './orders.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  QueryOverviewDto,
  CreateOrderDto,
  OrdersPaginationQueryDto,
} from './dto';
import { ResponseMessage } from 'src/common/decorators';
import { ORDER_STATUS } from 'src/common/enums';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ResponseMessage('Order created successfully')
  @ApiOperation({ summary: 'Create order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
  @Get('overview')
  @ResponseMessage('Order overview fetched successfully')
  @ApiOperation({ summary: 'Get order overview' })
  @ApiResponse({ status: 200, description: 'Order overview' })
  getOrderOverview(@Query() query: QueryOverviewDto) {
    return this.ordersService.getOrderOverview(query.fromDate, query.toDate);
  }
  @Get('chart')
  @ResponseMessage('Order chart fetched successfully')
  @ApiOperation({ summary: 'Get order chart' })
  @ApiResponse({ status: 200, description: 'Order chart' })
  @ApiQuery({ name: 'range', type: String })
  getOrderChart(@Query() query: { range: string }) {
    return this.ordersService.getOrderChart(query.range);
  }
  @Get()
  @ResponseMessage('Orders fetched successfully')
  @ApiOperation({ summary: 'Get orders' })
  @ApiResponse({ status: 200, description: 'List of orders' })
  findAll(@Query() query: OrdersPaginationQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Order fetched successfully')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Order found' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ResponseMessage('Order updated successfully')
  @ApiOperation({ summary: 'Update order' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: ORDER_STATUS.PENDING },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Order updated' })
  update(@Param('id') id: string, @Body() body: { status: ORDER_STATUS }) {
    return this.ordersService.updateStatus(id, body.status);
  }

  @Delete(':id')
  @ResponseMessage('Order deleted successfully')
  @ApiOperation({ summary: 'Delete order' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Order removed' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Post('bulk-delete')
  @ResponseMessage('Orders deleted successfully')
  @ApiOperation({ summary: 'Bulk delete orders' })
  @ApiResponse({ status: 200, description: 'Orders bulk deleted' })
  bulkDelete(@Body() body: { orderIds: string[] }) {
    return this.ordersService.bulkDelete(body.orderIds);
  }
}
