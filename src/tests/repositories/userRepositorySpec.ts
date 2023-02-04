// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import TYPES from '../../consts/types';
import { UserRepository } from '../../repositories/userRepository';

describe('User Repository', () => {
  const userRepository = container.get<UserRepository>(TYPES.UserRepository);

  beforeAll(() => {
    console.log('');
    console.log('=============================');
    console.log('User Repository test START');
    console.log('=============================');
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  // BaseRepository -- START
  it('has a index method', () => {
    expect(userRepository.index).toBeDefined();
  });
  it('has a getById method', () => {
    expect(userRepository.getById).toBeDefined();
  });
  it('has a create method', () => {
    expect(userRepository.create).toBeDefined();
  });

  it('has a exists method', () => {
    expect(userRepository.exists).toBeDefined();
  });

  it('has a delete method', () => {
    expect(userRepository.delete).toBeDefined();
  });
  // BaseRepository -- END
  it('has a getByEmail method', () => {
    expect(userRepository.getByEmail).toBeDefined();
  });

  it('has a existsByEmail method', () => {
    expect(userRepository.existsByEmail).toBeDefined();
  });

  it('has a existsByUser method', () => {
    expect(userRepository.existsByUser).toBeDefined();
  });
});
