import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { cognitoConfig } from '../config/cognito.config';
import { CognitoAuthGuard } from './guards/cognito-auth.guard';
import { CognitoRolesGuard } from './guards/cognito-roles.guard';

@Module({
  imports: [ConfigModule.forFeature(cognitoConfig)],
  providers: [CognitoAuthGuard, CognitoRolesGuard],
  exports: [CognitoAuthGuard, CognitoRolesGuard],
})
export class AuthModule {}