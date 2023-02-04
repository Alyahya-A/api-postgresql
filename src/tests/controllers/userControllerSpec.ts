// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import supertest from 'supertest';
import { StatusCode } from '../../consts/statusCodes';
import TYPES from '../../consts/types';
import { CreateUserResDto } from '../../models/dto/createUserDto';
import { APIError } from '../../models/errors/apiError';
import app from '../../server';
import { UserService } from '../../services/userService';
import { userData } from '../helpers/userTestData';

const request = supertest(app);

describe('User controller', () => {
  const baseUrl = '/api/users';
  let token: string;

  beforeAll(async () => {
    console.log('');
    console.log('==============================');
    console.log('User controller test START');
    console.log('==============================');

    const userService = container.get<UserService>(TYPES.UserService);

    try {
      token = await userService.generateToken({
        email: userData.email,
        password: userData.password_encrypt
      });
    } catch (error) {
      if (error instanceof APIError && error.errorCode === 5202) {
        await userService.createUser({
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          password_encrypt: userData.password_encrypt
        });

        token = await userService.generateToken({
          email: userData.email,
          password: userData.password_encrypt
        });
      }
    }

    console.log(`token: ${token}`);
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  it('posts /users: should create user and returns it', async () => {
    const response = await request
      .post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Abdulrahman',
        lastName: 'Alyahya',
        email: 'abdulrahman@alyahya.dev',
        password: 'Aa123456'
      });

    const createdUser: CreateUserResDto = response.body;

    expect(response.status).toBe(StatusCode.created);
    expect({
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email
    }).toEqual({
      firstName: 'Abdulrahman',
      lastName: 'Alyahya',
      email: 'abdulrahman@alyahya.dev'
    });
  });

  it('posts /users: should returns invalid email (Error #5002)', async () => {
    let errorCode: number = 0;

    const response = await request
      .post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Abdulrahman',
        lastName: 'Alyahya',
        email: 'abdulrahman@alyahya.a',
        password: 'Aa123456'
      });

    expect((response.body as APIError).errorCode).toBe(5002);
  });

  it('gets /users: returns a list of users', async () => {
    const response = await request
      .get(baseUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual([
      {
        firstName: 'Abdulrahman',
        lastName: 'Alyahya',
        email: 'alyahya@alyahya.dev'
      },
      {
        firstName: 'Abdulrahman',
        lastName: 'Alyahya',
        email: 'abdulrahman@alyahya.dev'
      }
    ]);
  });

  it('gets /users/:id: returns a user', async () => {
    const response = await request
      .get(`${baseUrl}/1`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual({
      firstName: 'Abdulrahman',
      lastName: 'Alyahya',
      email: 'alyahya@alyahya.dev'
    });
  });

  it('deletes /users/:id: returns the deleted user', async () => {
    const response = await request
      .delete(`${baseUrl}/2`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual({
      firstName: 'Abdulrahman',
      lastName: 'Alyahya',
      email: 'abdulrahman@alyahya.dev'
    });
  });
});
