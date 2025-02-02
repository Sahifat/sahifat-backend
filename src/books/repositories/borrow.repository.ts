import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DynamoDBService } from '../../database/dynamodb.service';
import { Borrow } from '../types/borrow.types';
import { CreateBorrowDto } from '../dtos/create-borrow.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateBorrowDto } from '../dtos/update-borrow.dto';

@Injectable()
export class BorrowRepository {
  private readonly tableName = 'Borrows';
  private readonly logger = new Logger(BorrowRepository.name);

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async findAll(): Promise<Borrow[]> {
    const params = {
      TableName: this.tableName,
    };

    const items = await this.dynamoDBService.scan(params);
    return items as Borrow[];
  }

  async findById(borrowId: string, userId: string): Promise<Borrow | null> {
    const key = {
      id: borrowId,
      userId: userId,
    };

    const result = await this.dynamoDBService.get('Borrows', key);
    return result as Borrow | null;
  }

  async findActiveBorrowByBookAndUser(
    bookId: string,
    userId: string,
  ): Promise<Borrow | null> {
    const params = {
      TableName: this.tableName,
      FilterExpression:
        'bookId = :bookId AND userId = :userId AND #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':bookId': bookId,
        ':userId': userId,
        ':status': 'borrowed',
      },
    };

    const results = await this.dynamoDBService.scan(params);
    return (results[0] as Borrow) || null;
  }

  async create(createBorrowDto: CreateBorrowDto): Promise<Borrow> {
    const borrow: Borrow = {
      id: uuidv4(),
      ...createBorrowDto,
      status: 'borrowed',
    };

    await this.dynamoDBService.put(this.tableName, borrow);
    return borrow;
  }

  async update(
    id: string,
    userId: string,
    updateBorrowDto: UpdateBorrowDto,
  ): Promise<Borrow> {
    const existingBorrow = await this.findById(id, userId);
    if (!existingBorrow) {
      throw new NotFoundException(
        `Borrow with ID ${id} and userId ${userId} not found`,
      );
    }

    const key = {
      id: id,
      userId: userId,
    };

    const response = await this.dynamoDBService.update(this.tableName, key, {
      status: 'returned',
      returnDate: new Date().toISOString(),
      ...updateBorrowDto,
    });
    return response as Borrow;
  }

  async remove(id: string): Promise<void> {
    await this.dynamoDBService.delete(this.tableName, { id });
  }
}
