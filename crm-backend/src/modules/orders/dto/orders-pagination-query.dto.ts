import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsEnum,
  IsNumber,
  IsDate,
  IsMongoId,
  Min,
} from 'class-validator';
import { ORDER_STATUS } from 'src/common/enums';

export class OrdersPaginationQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ enum: ORDER_STATUS })
  @IsOptional()
  @IsEnum(ORDER_STATUS)
  status?: ORDER_STATUS;

  @ApiPropertyOptional({ example: 100 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  minTotalAmount?: number;

  @ApiPropertyOptional({ example: 1000 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxTotalAmount?: number;

  @ApiPropertyOptional({ example: '2025-08-18' })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  fromDate?: Date;

  @ApiPropertyOptional({ example: '2025-08-31' })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  toDate?: Date;

  @ApiPropertyOptional({ example: '60f7e9d3c9b1b12d8c8b4567' })
  @IsOptional()
  @IsMongoId()
  customer?: string;
}
