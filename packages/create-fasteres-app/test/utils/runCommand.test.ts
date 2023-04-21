// @ts-nocheck
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

    await expect(
      runCommand('echo', ['Hello world'], { cwd: 'path/to/cwd' })
    ).rejects.toThrowError(expectedError);
  });

  it("should reject error with command output if code isn't 0", async () => {
    const mockResult: Result = {
      result: 'command output',
      code: 1,
    };
    const expectedError = new ExecutionError('command output', 1);

    mockedChildProcessSpawn.mockImplementation(
      () => new MockChildProcess(mockResult) as any
    );

    await expect(
      runCommand('echo', ['Hello world'], { cwd: 'path/to/cwd' })
    ).rejects.toThrowError(expectedError);
  });

  it('should reject error if command is not provided', async () => {
    await expect(runCommand()).rejects.toThrowError(
      new ExecutionError('Command is required')
    );
  });

  it('should reject error if command is not a string', async () => {
    await expect(runCommand(32)).rejects.toThrowError(
      new ExecutionError('Command must be a string')
    );
    await expect(runCommand(true)).rejects.toThrowError(
      new ExecutionError('Command must be a string')
    );
    await expect(runCommand([])).rejects.toThrowError(
      new ExecutionError('Command must be a string')
    );
    await expect(runCommand({})).rejects.toThrowError(
      new ExecutionError('Command must be a string')
    );
  });

  it('should reject error if arguments is not a string array', async () => {
    await expect(runCommand('Hello', 'World')).rejects.toThrowError(
      new ExecutionError('Arguments must be a string array')
    );
    await expect(runCommand('Hello', 21)).rejects.toThrowError(
      new ExecutionError('Arguments must be a string array')
    );
    await expect(runCommand('Hello', true)).rejects.toThrowError(
      new ExecutionError('Arguments must be a string array')
    );
    await expect(runCommand('Hello', {})).rejects.toThrowError(
      new ExecutionError('Arguments must be a string array')
    );
    await expect(runCommand('Hello', [1, 2, 3])).rejects.toThrowError(
      new ExecutionError('Arguments must be a string array')
    );
  });

  it('should reject error if options is not an object', async () => {
    await expect(runCommand('echo', ['Hello'], 'options')).rejects.toThrowError(
      new ExecutionError('Options must be an object')
    );
    await expect(runCommand('echo', ['Hello'], 54)).rejects.toThrowError(
      new ExecutionError('Options must be an object')
    );
    await expect(runCommand('echo', ['Hello'], true)).rejects.toThrowError(
      new ExecutionError('Options must be an object')
    );
    await expect(runCommand('echo', ['Hello'], [])).rejects.toThrowError(
      new ExecutionError('Options must be an object')
    );
  });
});
