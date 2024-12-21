import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBorrowDto {
  @ApiProperty({ description: 'Book ID' })
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Borrow date' })
  @IsString()
  @IsNotEmpty()
  borrowDate: string;

  @ApiPropertyOptional({ description: 'Return date' })
  @IsString()
  @IsOptional()
  returnDate?: string;
}
