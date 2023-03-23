/* eslint-disable */

import childProcess from 'child_process';
import runCommand from '../../lib/utils/runCommand';
import ExecutionError from '../../lib/utils/ExecutionError';
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
    const mockResult: Result = {
      code: 0,
      result: 'command result',
    };

    mockedChildProcessSpawn.mockImplementation(
      () => new MockChildProcess(mockResult) as any
    );

    const result = await runCommand('echo', ['Hello world'], {
      cwd: 'path/to/cwd',
      stdio: 'pipe',
    });

    expect(result).toEqual(mockResult);
  });

  it('should reject error if command fails', async () => {
    const mockResult: Result = {
      error: 'command failed',
    };
    const expectedError = new ExecutionError('command failed');

    mockedChildProcessSpawn.mockImplementation(
      () => new MockChildProcess(mockResult) as any
    );

    expect(async () =>
      runCommand('echo', ['Hello world'], { cwd: 'path/to/cwd' })
    ).rejects.toStrictEqual(expectedError);
  });
});
