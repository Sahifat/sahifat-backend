import { AuthService } from '../providers/auth.service';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<{ message: string } | { error: string }> {
    try {
      await this.authService.registerUser(registerUserDto);
      return { message: 'User registered successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
