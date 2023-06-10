/* eslint-disable import/no-extraneous-dependencies */
// @ts-nocheck

import mock from 'mock-fs';

import initializeGit from '../../lib/builder/intializeGit';
import runCommand, { ExecutionResult } from '../../lib/utils/runCommand';
import ExecutionError from '../../lib/utils/ExecutionError';

jest.mock('../../lib/utils/runCommand');

const mockRunCommand = runCommand as unknown as jest.Mock<typeof runCommand>;

describe('initializeGit', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mock.restore();
  });

  it('should create a git repository', async () => {
    const projectDir = __dirname;
    const result: ExecutionResult = {
      code: 0,
      result: 'Command result',
    };

    mock({
      [projectDir]: {
        'package.json': '{}',
      },
    });

    mockRunCommand.mockImplementation(() => () => Promise.resolve(result));

    await initializeGit(projectDir);

    expect(mockRunCommand).toHaveBeenCalledWith('git', ['init'], {
      cwd: projectDir,
    });
  });

  it('should reject an error if runCommand fails', async () => {
    const projectDir = __dirname;
    const error = new ExecutionError('Error executing "git init"', 1);

    mock({
      [projectDir]: {
        'package.json': '{}',
      },
    });

    mockRunCommand.mockImplementation(() => Promise.reject(error));

    const expectedError = new Error(
      `Error initializing Git repository: ${error.message}`
    );

    await expect(initializeGit(projectDir)).rejects.toStrictEqual(
      expectedError
    );
  });

  it('should reject an error if directory does not exist', async () => {
    const projectDir = __dirname;
    const expectedError = new Error(`Directory does not exist: ${projectDir}`);

    mock({});

    await expect(initializeGit(projectDir)).rejects.toStrictEqual(
      expectedError
    );
  });

  it("should reject an error if path isn't a directory", async () => {
    const projectDir = __dirname;

    mock({
      [projectDir]: 'File not a directory',
    });

    const expectedError = new Error(`Path is not a directory: ${projectDir}`);

    await expect(initializeGit(projectDir)).rejects.toStrictEqual(
      expectedError
    );
  });

  it('should reject an error if path is not provided', async () => {
    const expectedError = new Error('Path is not provided');

    await expect(initializeGit()).rejects.toStrictEqual(expectedError);
    await expect(initializeGit(undefined)).rejects.toStrictEqual(expectedError);
    await expect(initializeGit(null)).rejects.toStrictEqual(expectedError);
  });

  it('should reject an error if path is not a string', async () => {
    const expectedError = new Error('Path is not a string');

    await expect(initializeGit(12)).rejects.toStrictEqual(expectedError);
    await expect(initializeGit(true)).rejects.toStrictEqual(expectedError);
    await expect(initializeGit(Symbol('symbol'))).rejects.toStrictEqual(
      expectedError
    );
    await expect(initializeGit([])).rejects.toStrictEqual(expectedError);
    await expect(initializeGit({})).rejects.toStrictEqual(expectedError);
  });
});
