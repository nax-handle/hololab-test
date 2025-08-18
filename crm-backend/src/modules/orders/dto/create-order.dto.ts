import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ORDER_STATUS, ORDER_TYPE } from 'src/common/enums';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer id',
    example: '60f7e9d3c9b1b12d8c8b4567',
  })
  @IsMongoId()
  customer: string;

  @ApiProperty({ enum: ORDER_TYPE, example: ORDER_TYPE.SALES })
  @IsEnum(ORDER_TYPE)
  orderType: ORDER_TYPE;

  @ApiPropertyOptional({ enum: ORDER_STATUS, example: ORDER_STATUS.PENDING })
  @IsEnum(ORDER_STATUS)
  @IsOptional()
  status?: ORDER_STATUS;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  totalAmount: number;

  @ApiPropertyOptional({ example: 'Monthly subscription for premium plan' })
  @IsString()
  @IsOptional()
  description?: string;
}
