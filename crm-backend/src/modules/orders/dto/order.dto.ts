import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ORDER_STATUS, ORDER_TYPE } from 'src/common/enums';

export class OrderDto {
  @ApiProperty({ example: '60f7e9d3c9b1b12d8c8b4567' })
  id: string;

  @ApiProperty({ example: '60f7e9d3c9b1b12d8c8b1234' })
  customer: string;

  @ApiProperty({ enum: ORDER_TYPE, example: ORDER_TYPE.SALES })
  orderType: ORDER_TYPE;

  @ApiProperty({ enum: ORDER_STATUS, example: ORDER_STATUS.PENDING })
  status: ORDER_STATUS;

  @ApiProperty({ example: 199.99 })
  totalAmount: number;

  @ApiPropertyOptional({ example: 'Monthly subscription for premium plan' })
  description?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  startDate?: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  endDate?: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
