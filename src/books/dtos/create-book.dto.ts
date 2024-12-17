import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'Book title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Book author' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ description: 'Book ISBN' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ description: 'Category ID' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: 'Book quantity', minimum: 0 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ description: 'Book description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Published year' })
  @IsNumber()
  @IsOptional()
  publishedYear?: number;

  @ApiPropertyOptional({ description: 'Book cover image URL' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
