import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchBookDto {
  @ApiPropertyOptional({ description: 'Search by title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Search by author' })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
