import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/dynamodb.module';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './providers/categories.service';
import { CategoriesRepository } from './repositories/categories.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
