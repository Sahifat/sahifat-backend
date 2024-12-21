import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'Password must have symbol characters',
  })
  password: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone_number: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
