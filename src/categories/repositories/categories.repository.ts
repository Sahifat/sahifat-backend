import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../../database/dynamodb.service';
import { Category } from '../interfaces/category.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoriesRepository {
  private readonly tableName = 'Categories';

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async create(data: Partial<Category>): Promise<Category> {
    const category: Category = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.dynamoDBService.put(this.tableName, category);
    return category;
  }

  async findOne(id: string): Promise<Category> {
    const result = await this.dynamoDBService.get(this.tableName, { id });
    return result as Category;
  }

  async findAll(): Promise<Category[]> {
    const result = await this.dynamoDBService.scan({
      TableName: this.tableName,
    });
    return result as Category[];
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = data;

    const result = await this.dynamoDBService.update(
      this.tableName,
      { id },
      updateData,
    );

    return result as Category;
  }

  async delete(id: string): Promise<boolean> {
    return this.dynamoDBService.delete(this.tableName, { id });
  }
}
