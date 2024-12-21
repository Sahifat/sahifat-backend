import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { BorrowService } from '../providers/borrow.service';
import { CreateBorrowDto } from '../dtos/create-borrow.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CognitoAuthGuard } from '../../auth/guards/cognito-auth.guard';
import { CognitoRolesGuard } from '../../auth/guards/cognito-roles.guard';
import { User } from '../../auth/decorators/user.decorator';
import { CognitoUser } from '../../auth/types/cognito-user.type';

@ApiTags('Books - Borrow')
@Controller('borrows')
@UseGuards(CognitoAuthGuard, CognitoRolesGuard)
@ApiBearerAuth()
export class BorrowController {
  private readonly logger = new Logger(BorrowController.name);

  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({ status: 201, description: 'Book borrowed successfully' })
  @ApiResponse({ status: 404, description: 'Book not found or unavailable' })
  async borrowBook(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowService.borrowBook(createBorrowDto);
  }

  @Post(':id/return')
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Return a book' })
  @ApiResponse({ status: 200, description: 'Book returned successfully' })
  @ApiResponse({ status: 404, description: 'Borrow record not found' })
  async returnBook(@Param('id') borrowId: string, @User() user: CognitoUser) {
    return this.borrowService.returnBook(borrowId, user.sub);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all borrow records' })
  @ApiResponse({ status: 200, description: 'List of all borrow records' })
  async findAllBorrows() {
    return this.borrowService.findAllBorrows();
  }

  @Get(':id')
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Get borrow record by ID' })
  @ApiResponse({ status: 200, description: 'Borrow record details' })
  @ApiResponse({ status: 404, description: 'Borrow record not found' })
  async findBorrowById(@Param('id') id: string, @User() user: CognitoUser) {
    return this.borrowService.findBorrowById(id, user.sub);
  }
}
