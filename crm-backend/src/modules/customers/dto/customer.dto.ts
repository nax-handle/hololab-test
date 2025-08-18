import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty({ example: '60f7e9d3c9b1b12d8c8b4567' })
  id: string;

  @ApiProperty({ example: 'Nax Nguyen' })
  fullName: string;

  @ApiProperty({ example: 'nax.nguyen@example.com' })
  email: string;

  @ApiProperty({ example: '+84-369-212-123' })
  phone: string;

  @ApiProperty({ example: 'Haha Group' })
  companyName: string;

  @ApiProperty({ example: '123 SVH, HCM City' })
  address: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
