import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class QueryOverviewDto {
  @ApiProperty({
    description: 'From date',
    example: '2025-08-15',
  })
  @IsString()
  fromDate: string;

  @ApiProperty({
    description: 'To date',
    example: '2025-08-20',
  })
  @IsString()
  toDate: string;
}
