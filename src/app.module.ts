import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/dynamodb.module';
import { CustomUnauthorizedExceptionFilter } from './filters/custom-unauthorized-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    BooksModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomUnauthorizedExceptionFilter,
    },
  ],
})
export class AppModule {}
