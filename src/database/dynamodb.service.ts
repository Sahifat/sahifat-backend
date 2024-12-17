import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient } from '../config/dynamodb.config';

@Injectable()
export class DynamoDBService implements OnModuleInit {
  private docClient: DynamoDBDocumentClient;
  private readonly logger = new Logger(DynamoDBService.name);

  onModuleInit() {
    this.docClient = getDynamoDBClient();
  }

  async put(tableName: string, item: Record<string, any>) {
    try {
      const params = {
        TableName: tableName,
        Item: {
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      await this.docClient.send(new PutCommand(params));
      return item;
    } catch (error) {
      this.logger.error(`Error creating book in ${tableName}:`, error);
      throw error;
    }
  }

  async get(tableName: string, key: Record<string, any>) {
    try {
      const params = {
        TableName: tableName,
        Key: key,
      };

      const response = await this.docClient.send(new GetCommand(params));
      return response.Item;
    } catch (error) {
      this.logger.error(`Error getting book from ${tableName}:`, error);
      throw error;
    }
  }

  async update(
    tableName: string,
    key: Record<string, any>,
    updates: Record<string, any>,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, ...updateFields } = updates;

      // Build update expression and attribute values
      const updateExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      Object.keys(updateFields).forEach((field, index) => {
        updateExpressions.push(`#field${index} = :value${index}`);
        expressionAttributeNames[`#field${index}`] = field;
        expressionAttributeValues[`:value${index}`] = updateFields[field];
      });

      // Always update the updatedAt timestamp
      updateExpressions.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      const params = {
        TableName: tableName,
        Key: key,
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW' as const,
      };

      const response = await this.docClient.send(new UpdateCommand(params));
      return response.Attributes;
    } catch (error) {
      this.logger.error(`Error updating item in ${tableName}:`, error);
      throw error;
    }
  }

  async delete(tableName: string, key: Record<string, any>) {
    try {
      const params = {
        TableName: tableName,
        Key: key,
      };

      await this.docClient.send(new DeleteCommand(params));
      return true;
    } catch (error) {
      this.logger.error(`Error deleting book from ${tableName}:`, error);
      throw error;
    }
  }

  async scan(params: {
    TableName: string;
    FilterExpression?: string;
    ExpressionAttributeNames?: Record<string, string>;
    ExpressionAttributeValues?: Record<string, any>;
  }) {
    try {
      const response = await this.docClient.send(new ScanCommand(params));
      return response.Items || [];
    } catch (error) {
      this.logger.error(
        `Error scanning items from ${params.TableName}:`,
        error,
      );
      throw error;
    }
  }

  async query(params: {
    TableName: string;
    IndexName?: string;
    KeyConditionExpression: string;
    ExpressionAttributeValues: Record<string, any>;
  }) {
    try {
      const response = await this.docClient.send(new QueryCommand(params));
      return response.Items || [];
    } catch (error) {
      this.logger.error(
        `Error querying books from ${params.TableName}:`,
        error,
      );
      throw error;
    }
  }
}
