// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import TYPES from '../../consts/types';
import { APIError } from '../../models/errors/apiError';
import { StatusService } from '../../services/statusService';

describe('Status Service', () => {
  const statusService = container.get<StatusService>(TYPES.StatusService);
  let createdStatusId: number;

  beforeAll(async () => {
    console.log('');
    console.log('==========================');
    console.log('CateStatusgory Service test START');
    console.log('==========================');
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  it('create should add a status', async () => {
    const result = await statusService.createStaus({
      code: 3,
      name: 'Canceled'
    });

    createdStatusId = result.id!;

    expect(result).toEqual({
      id: createdStatusId,
      code: 3,
      name: 'Canceled'
    });
  });

  it('create should throw an error if status is already exists', async () => {
    let errorCode: number;

    try {
      await statusService.createStaus({
        code: 3,
        name: 'Canceled'
      });
    } catch (err) {
      if (err instanceof APIError) {
        errorCode = err.errorCode;
      }
    }

    expect(errorCode!).toEqual(4200);
  });

  it('getAllCategories should returns at least one item', async () => {
    const result = await statusService.getAllStatus();

    // length is 3.. because we have 2 default valuse in DB (Active and Completed).. and the one that we have created in the above test
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  it('getStstusById should returns status', async () => {
    const result = await statusService.getStstusById(createdStatusId);

    expect(result).toEqual({
      id: createdStatusId,
      code: 3,
      name: 'Canceled'
    });
  });

  it('deleteStatus should delete status', async () => {
    const result = await statusService.deleteStatus(createdStatusId);

    expect(result).toEqual({
      id: createdStatusId,
      code: 3,
      name: 'Canceled'
    });
  });
});
