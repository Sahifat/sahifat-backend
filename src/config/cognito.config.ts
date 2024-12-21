import { registerAs } from '@nestjs/config';

export const cognitoConfig = registerAs('cognito', () => ({
  region: process.env.AWS_REGION,
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId: process.env.COGNITO_CLIENT_ID,
  authority: process.env.COGNITO_AUTHORITY,
  domain: process.env.COGNITO_DOMAIN,
}));
