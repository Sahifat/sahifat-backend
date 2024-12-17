import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private cognitoVerifier;

  constructor(private configService: ConfigService) {
    this.cognitoVerifier = CognitoJwtVerifier.create({
      userPoolId: this.configService.get('cognito.userPoolId'),
      clientId: this.configService.get('cognito.clientId'),
      tokenUse: 'access',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Custom message: No token provided');
    }

    if (token.split('.').length !== 3) {
      throw new UnauthorizedException('do not have permission');
    }

    try {
      const payload = await this.cognitoVerifier.verify(token);
      request.user = {
        sub: payload.sub,
        email: payload.email,
        groups: payload['cognito:groups'] || [],
      };
      return true;
    } catch {
      throw new UnauthorizedException(`Custom message: Invalid token`);
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) return null;

    return token;
  }
}
