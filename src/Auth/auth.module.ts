import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { cognitoConfig } from '../config/cognito.config';
import { CognitoAuthGuard } from './guards/cognito-auth.guard';
import { CognitoRolesGuard } from './guards/cognito-roles.guard';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [ConfigModule.forFeature(cognitoConfig)],
  providers: [CognitoAuthGuard, CognitoRolesGuard],
  exports: [CognitoAuthGuard, CognitoRolesGuard],
  controllers: [AuthController],
})
export class AuthModule {}
