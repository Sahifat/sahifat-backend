import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BookService } from '../providers/book.service';
import { CreateBookDto } from '../dtos/create-book.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CognitoAuthGuard } from '../../auth/guards/cognito-auth.guard';
import { CognitoRolesGuard } from '../../auth/guards/cognito-roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Books')
@Controller('books')
@UseGuards(CognitoAuthGuard, CognitoRolesGuard)
@ApiBearerAuth()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all books' })
  async findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Get book by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book details' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found' })
  async findOne(@Param('id') id: string) {
    return this.bookService.findById(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create new book (Admin only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Book created successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update book (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Book updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete book (Admin only)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Book deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  async remove(@Param('id') id: string) {
    await this.bookService.remove(id);
  }
}
