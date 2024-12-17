import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DynamoDBService } from '../../database/dynamodb.service';
import { Book } from '../types/book.types';
import { CreateBookDto } from '../dtos/create-book.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookRepository {
  private readonly tableName = 'Books';
  private readonly logger = new Logger(BookRepository.name);

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async findAll(): Promise<Book[]> {
    const params = {
      TableName: this.tableName,
    };

    const items = await this.dynamoDBService.scan(params);
    return items as Book[];
  }

  async findById(id: string): Promise<Book | null> {
    const item = await this.dynamoDBService.get(this.tableName, { id });
    return item as Book | null;
  }

  async findByTitle(title: string): Promise<Book | null> {
    try {
      const params = {
        TableName: 'Books',
        IndexName: 'title-index',
        KeyConditionExpression: 'title = :title',
        ExpressionAttributeValues: {
          ':title': title,
        },
      };

      const results = await this.dynamoDBService.query(params);
      return (results[0] as Book) || null;
    } catch (error) {
      this.logger.error(
        `Error fetching book by title ${title}: ${error.message}`,
      );
      throw error;
    }
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    const params = {
      TableName: this.tableName,
      IndexName: 'isbn-index',
      KeyConditionExpression: 'isbn = :isbn',
      ExpressionAttributeValues: {
        ':isbn': isbn,
      },
    };

    const results = await this.dynamoDBService.query(params);
    return (results[0] as Book) || null;
  }

  async updateAvailability(id: string, available: boolean): Promise<Book> {
    const existingBook = await this.findById(id);
    if (!existingBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const updateData = { available };

    const response = await this.dynamoDBService.update(
      this.tableName,
      { id },
      updateData,
    );
    return response as Book;
  }

  async create(
    createBookDto: CreateBookDto & { available: boolean },
  ): Promise<Book> {
    // Check for duplicate title
    const existingBookByTitle = await this.findByTitle(createBookDto.title);
    if (existingBookByTitle) {
      throw new ConflictException(
        `A book with the title "${createBookDto.title}" already exists.`,
      );
    }

    // Check for duplicate ISBN
    const existingBookByIsbn = await this.findByIsbn(createBookDto.isbn);
    if (existingBookByIsbn) {
      throw new ConflictException(
        `A book with the ISBN "${createBookDto.isbn}" already exists.`,
      );
    }

    const book: Book = {
      id: uuidv4(),
      ...createBookDto,
      available: createBookDto.quantity > 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.dynamoDBService.put(this.tableName, book);
    return book;
  }

  async update(id: string, updateBookDto: Partial<Book>): Promise<Book> {
    const existingBook = await this.findById(id);
    if (!existingBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    const updateData = {
      ...updateBookDto,
    };

    const response = await this.dynamoDBService.update(
      this.tableName,
      { id },
      updateData,
    );
    return response as Book;
  }

  async remove(id: string): Promise<void> {
    await this.dynamoDBService.delete(this.tableName, { id });
  }
}
