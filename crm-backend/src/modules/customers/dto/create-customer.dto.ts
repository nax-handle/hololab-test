import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Nax Nguyen' })
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @ApiProperty({ example: 'nax.nguyen@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '+84-369-212-123' })
  @IsString()
  @IsNotEmpty()
  phone: string;
  @ApiProperty({ example: 'Haha Group' })
  @IsString()
  @IsNotEmpty()
  companyName: string;
  @ApiProperty({ example: '123 SVH, HCM City' })
  @IsString()
  @IsNotEmpty()
  address: string;
}
