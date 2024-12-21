import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { RegisterUserDto } from '../dtos/register-user.dto';

export class CognitoRepository {
  private cognitoProvider: CognitoIdentityServiceProvider;

  constructor() {
    this.cognitoProvider = new CognitoIdentityServiceProvider();
  }

  async signUpUser(
    registerUserDto: RegisterUserDto,
    clientId: string,
  ): Promise<void> {
    const { password, email, phone_number, name } = registerUserDto;

    const signUpParams = {
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'phone_number', Value: phone_number },
        { Name: 'name', Value: name },
      ],
    };

    await this.cognitoProvider.signUp(signUpParams).promise();
  }

  async addUserToGroup(
    username: string,
    userPoolId: string,
    groupName: string,
  ): Promise<void> {
    const addUserToGroupParams = {
      GroupName: groupName,
      UserPoolId: userPoolId,
      Username: username,
    };

    await this.cognitoProvider
      .adminAddUserToGroup(addUserToGroupParams)
      .promise();
  }
}
