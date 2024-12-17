import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { BorrowRepository } from '../repositories/borrow.repository';
import { BookRepository } from '../repositories/book.repository';
import { CreateBorrowDto } from '../dtos/create-borrow.dto';
import { Borrow } from '../types/borrow.types';

@Injectable()
export class BorrowService {
  private readonly logger = new Logger(BorrowService.name);

  constructor(
    private readonly borrowRepository: BorrowRepository,
    private readonly bookRepository: BookRepository,
  ) {}

  async borrowBook(createBorrowDto: CreateBorrowDto): Promise<Borrow> {
    const book = await this.bookRepository.findById(createBorrowDto.bookId);
    if (!book) {
      throw new NotFoundException(
        `Book with ID ${createBorrowDto.bookId} not found`,
      );
    }

    if (!book.available || book.quantity <= 0) {
      throw new ConflictException(
        `Book with ID ${createBorrowDto.bookId} is not available for borrowing`,
      );
    }

    const existingBorrow =
      await this.borrowRepository.findActiveBorrowByBookAndUser(
        createBorrowDto.bookId,
        createBorrowDto.userId,
      );
    if (existingBorrow) {
      throw new ConflictException(
        `User with ID ${createBorrowDto.userId} has already borrowed this book`,
      );
    }

    const updatedQuantity = book.quantity - 1;
    const isAvailable = updatedQuantity > 0;
    await this.bookRepository.update(createBorrowDto.bookId, {
      quantity: updatedQuantity,
      available: isAvailable,
    });

    return this.borrowRepository.create(createBorrowDto);
  }

  async returnBook(borrowId: string): Promise<Borrow> {
    const borrow = await this.borrowRepository.findById(borrowId);
    if (!borrow) {
      throw new NotFoundException(
        `Borrow record with ID ${borrowId} not found`,
      );
    }

    if (borrow.status === 'returned') {
      throw new Error(
        `Borrow record with ID ${borrowId} has already been returned`,
      );
    }

    // Mark the book as available
    await this.bookRepository.updateAvailability(borrow.bookId, true);

    // Update the borrow record to returned
    return this.borrowRepository.update(borrowId, {
      status: 'returned',
      returnDate: new Date().toISOString(),
    });
  }

  async findAllBorrows(): Promise<Borrow[]> {
    return this.borrowRepository.findAll();
  }

  async findBorrowById(id: string): Promise<Borrow> {
    const borrow = await this.borrowRepository.findById(id);
    if (!borrow) {
      throw new NotFoundException(`Borrow record with ID ${id} not found`);
    }
    return borrow;
  }
}
