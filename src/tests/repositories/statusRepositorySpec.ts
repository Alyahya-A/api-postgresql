// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import TYPES from '../../consts/types';
import { StatusRepository } from '../../repositories/statusRepository';

describe('Status Repository', () => {
  const statusRepository = container.get<StatusRepository>(
    TYPES.StatusRepository
  );

  beforeAll(() => {
    console.log('');
    console.log('=============================');
    console.log('Status Repository test START');
    console.log('=============================');
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  // BaseRepository -- START
  it('has a index method', () => {
    expect(statusRepository.index).toBeDefined();
  });
  it('has a getById method', () => {
    expect(statusRepository.getById).toBeDefined();
  });
  it('has a create method', () => {
    expect(statusRepository.create).toBeDefined();
  });

  it('has a exists method', () => {
    expect(statusRepository.exists).toBeDefined();
  });

  it('has a delete method', () => {
    expect(statusRepository.delete).toBeDefined();
  });
  // BaseRepository -- END
  it('has a existsByName method', () => {
    expect(statusRepository.existsByName).toBeDefined();
  });

  it('has a existsByName method', () => {
    expect(statusRepository.existsByName).toBeDefined();
  });
});
