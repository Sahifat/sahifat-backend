import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { BookRepository } from '../repositories/book.repository';
import { CreateBookDto } from '../dtos/create-book.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';
import { Book } from '../types/book.types';
import { SearchBookDto } from '../dtos/search-book.dto';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);

  constructor(private readonly bookRepository: BookRepository) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async create(createBookDto: CreateBookDto) {
    return this.bookRepository.create({ ...createBookDto, available: true });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    return this.bookRepository.update(id, updateBookDto);
  }

  async remove(id: string) {
    await this.bookRepository.remove(id);
  }

  async updateAvailability(id: string, available: boolean): Promise<Book> {
    return this.bookRepository.update(id, { available });
  }

  async searchBooks(searchBookDto: SearchBookDto): Promise<Book[]> {
    try {
      this.logger.log(
        `Searching books with params: ${JSON.stringify(searchBookDto)}`,
      );
      return await this.bookRepository.searchBooks(searchBookDto);
    } catch (error) {
      this.logger.error(`Error searching books: ${error.message}`);
      throw error;
    }
  }
}
