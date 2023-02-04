// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import supertest from 'supertest';
import { StatusCode } from '../../consts/statusCodes';
import TYPES from '../../consts/types';
import { APIError } from '../../models/errors/apiError';
import app from '../../server';
import { UserService } from '../../services/userService';
import { userData } from '../helpers/userTestData';

const request = supertest(app);

describe('Category controller', () => {
  const baseUrl = '/api/categories';
  let token: string;

  beforeAll(async () => {
    console.log('');
    console.log('==============================');
    console.log('Category controller test START');
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

  it('posts /categories: create category and returns it', async () => {
    const response = await request
      .post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Computers',
        description: 'Computers categoty'
      });

    expect(response.status).toBe(StatusCode.created);
    expect(response.body).toEqual({
      id: 1,
      name: 'Computers',
      description: 'Computers categoty'
    });
  });

  it('gets /categories: returns a list of categories', async () => {
    const response = await request.get(baseUrl);

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual([
      {
        id: 1,
        name: 'Computers',
        description: 'Computers categoty'
      }
    ]);
  });

  it('gets /categories/:id: returns a category', async () => {
    const response = await request.get(`${baseUrl}/1`);

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual({
      id: 1,
      name: 'Computers',
      description: 'Computers categoty'
    });
  });

  it('deletes /categories/:id: returns the deleted category', async () => {
    const response = await request
      .delete(`${baseUrl}/1`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual({
      id: 1,
      name: 'Computers',
      description: 'Computers categoty'
    });
  });
});
