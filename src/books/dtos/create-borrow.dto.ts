import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBorrowDto {
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  borrowDate: string;

  @IsString()
  @IsOptional()
  returnDate?: string;
}
