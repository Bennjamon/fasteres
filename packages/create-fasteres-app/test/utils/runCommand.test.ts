/* eslint-disable */

import childProcess from 'child_process';
import runCommand from '../../lib/utils/runCommand';
import MockChildProcess, { Result } from '../__mocks__/ChildProcess';

jest.mock('child_process');

const mockedChildProcessSpawn =
  childProcess.spawn as jest.Mock<childProcess.ChildProcess>;

describe('runCommand', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('should run a command', async () => {
    const result: Result = {
      code: 0,
    };

    mockedChildProcessSpawn.mockImplementation(
      () => new MockChildProcess(result) as any
    );

    await runCommand('echo', ['Hello', 'world!'], {
      cwd: 'path/to/cwd',
      stdio: 'pipe',
    });

    expect(mockedChildProcessSpawn).toBeCalledWith(
      'echo',
      ['Hello', 'world!'],
      { cwd: 'path/to/cwd', stdio: 'pipe' }
    );
  });

  it('should return the command result', async () => {
    const expectedResult: Result = {
      code: 0,
      result: 'command result',
    };

    mockedChildProcessSpawn.mockImplementation(
      () => new MockChildProcess(expectedResult) as any
    );

    const result = await runCommand('echo', ['Hello world'], {
      cwd: 'path/to/cwd',
      stdio: 'pipe',
    });

    expect(result).toEqual(expectedResult);
  });
});
