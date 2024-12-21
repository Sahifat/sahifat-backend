import { CognitoRepository } from '../repositories/cognito.repository';
import { RegisterUserDto } from '../dtos/register-user.dto';

export class AuthService {
  private cognitoRepository: CognitoRepository;

  constructor() {
    this.cognitoRepository = new CognitoRepository();
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<void> {
    const userPoolId = process.env.COGNITO_USER_POOL_ID!;
    const clientId = process.env.COGNITO_CLIENT_ID!;

    await this.cognitoRepository.signUpUser(registerUserDto, clientId);
    await this.cognitoRepository.addUserToGroup(
      registerUserDto.email,
      userPoolId,
      'client',
    );
  }
}
