import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
  BadRequestException,
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

    const borrow = {
      ...createBorrowDto,
      status: 'borrowed',
    };

    return this.borrowRepository.create(borrow);
  }

  async returnBook(borrowId: string, userId: string): Promise<Borrow> {
    try {
      const borrow = await this.borrowRepository.findById(borrowId, userId);
      if (!borrow) {
        throw new NotFoundException(
          `Borrow record with ID ${borrowId} not found`,
        );
      }

      if (borrow.status === 'returned') {
        throw new BadRequestException(
          `Borrow record with ID ${borrowId} has already been returned`,
        );
      }

      await Promise.all([
        this.bookRepository.updateAvailability(borrow.bookId, true),
        this.borrowRepository.update(borrowId, userId, {
          returnDate: new Date().toISOString(),
        }),
      ]);

      const returnedBorrow: Borrow = {
        ...borrow,
        status: 'returned',
        returnDate: new Date().toISOString(),
      };

      return returnedBorrow;
    } catch (error) {
      this.logger.error(`Error returning book: ${error.message}`);
      throw error;
    }
  }

  async findAllBorrows(): Promise<Borrow[]> {
    return this.borrowRepository.findAll();
  }

  async findBorrowById(id: string, userId: string): Promise<Borrow> {
    const borrow = await this.borrowRepository.findById(id, userId);
    if (!borrow) {
      throw new NotFoundException(`Borrow record with ID ${id} not found`);
    }
    return borrow;
  }
}
