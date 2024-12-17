import { Module } from '@nestjs/common';
import { BookController } from './controllers/book.controller';
import { BookService } from './providers/book.service';
import { BookRepository } from './repositories/book.repository';
import { DatabaseModule } from '../database/dynamodb.module';
import { BorrowService } from './providers/borrow.service';
import { BorrowController } from './controllers/borrow.controller';
import { BorrowRepository } from './repositories/borrow.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [BookController, BorrowController],
  providers: [BookService, BookRepository, BorrowService, BorrowRepository],
  exports: [BookService, BorrowService],
})
export class BooksModule {}
