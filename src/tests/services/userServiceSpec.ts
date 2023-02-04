// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import TYPES from '../../consts/types';
import { TokenResDto } from '../../models/dto/tokenDto';
import { UserDto } from '../../models/dto/userDto';
import { APIError } from '../../models/errors/apiError';
import { UserService } from '../../services/userService';
import { comparePassword } from '../../utils/bcrypt';
import { verifyToken } from '../../utils/verifyToken';

describe('User Service', () => {
  const userService = container.get<UserService>(TYPES.UserService);
  let userId: number;

  beforeAll(async () => {
    console.log('');
    console.log('==========================');
    console.log('User Service test START');
    console.log('==========================');
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  it('create should add a user', async () => {
    const result: UserDto = await userService.createUser({
      firstname: 'Mohammad',
      lastname: 'Alyahya',
      email: 'mohammad@alyahya.dev',
      password_encrypt: 'Aa123456'
    });

    expect(result).toEqual({
      firstName: 'Mohammad',
      lastName: 'Alyahya',
      email: 'mohammad@alyahya.dev'
    });
  });

  it('create should throw an error if user is already exists', async () => {
    let errorCode: number;

    try {
      await userService.createUser({
        firstname: 'Nasser',
        lastname: 'Khalid',
        email: 'mohammad@alyahya.dev',
        password_encrypt: 'Aa123456'
      });
    } catch (err) {
      if (err instanceof APIError) {
        errorCode = err.errorCode;
      }
    }

    expect(errorCode!).toEqual(5200);
  });

  it('getAllUser should returns at least one item', async () => {
    const result = await userService.getAllUser();

    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('getUserByEmail should returns user by its email', async () => {
    const result = await userService.getUserByEmail('mohammad@alyahya.dev');

    userId = result.id!;

    expect({
      firstName: result.firstname,
      lastName: result.lastname,
      email: result.email
    }).toEqual({
      firstName: 'Mohammad',
      lastName: 'Alyahya',
      email: 'mohammad@alyahya.dev'
    });
  });

  it('getUserById should returns user by its ID', async () => {
    const result = await userService.getUserById(userId);

    expect(result).toEqual({
      firstName: 'Mohammad',
      lastName: 'Alyahya',
      email: 'mohammad@alyahya.dev'
    });
  });

  it('comparePassword should returns true if user password match the encrypted password', async () => {
    const result = await userService.getUserByEmail('mohammad@alyahya.dev');

    expect(
      await comparePassword(result.password_encrypt, 'Aa123456')
    ).toBeTrue();
  });

  it('generateToken should generate token then verify it', async () => {
    const result = await userService.generateToken({
      email: 'mohammad@alyahya.dev',
      password: 'Aa123456'
    });

    const decoded: TokenResDto = verifyToken(result);

    expect(decoded.email).toBe('mohammad@alyahya.dev');
  });

  it('deleteUser should delete user', async () => {
    const result = await userService.deleteUser(userId);

    expect(result).toEqual({
      firstName: 'Mohammad',
      lastName: 'Alyahya',
      email: 'mohammad@alyahya.dev'
    });
  });
});
