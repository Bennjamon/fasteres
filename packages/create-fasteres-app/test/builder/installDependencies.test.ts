// @ts-nocheck
/* eslint-disable */

import mock from 'mock-fs';

import installDependencies from '../../lib/builder/installDependencies';
import ExecutionError from '../../lib/utils/ExecutionError';
import runCommand, { ExecutionResult } from '../../lib/utils/runCommand';

jest.mock('../../lib/utils/runCommand');

const originalPlatform = process.platform;

const mockRunCommand = runCommand as unknown as jest.Mock<typeof runCommand>;

describe('installDependencies', () => {
  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform });
    jest.clearAllMocks();
    mock.restore();
  });

  it('should run the install command with the package manager provided', async () => {
    const result: ExecutionResult = {
      code: 0,
      result: 'Dependencies installed',
    };
    const projectDir = __dirname;
    const packageManager = 'npm';

    Object.defineProperty(process, 'platform', { value: 'linux' });

    mock({
      [projectDir]: {
        'package.json': '{}',
      },
    });
    mockRunCommand.mockImplementation(() => Promise.resolve(result));

    await installDependencies(projectDir, packageManager);

    expect(mockRunCommand).toHaveBeenCalledWith(packageManager, ['install'], {
      cwd: projectDir,
    });
  });

  it('should add .cmd to the command in windows', async () => {
    const result: ExecutionResult = {
      code: 0,
      result: 'Dependencies installed',
    };
    const projectDir = __dirname;
    const packageManager = 'npm';

    Object.defineProperty(process, 'platform', { value: 'win32' });

    mock({
      [projectDir]: {
        'package.json': '{}',
      },
    });
    mockRunCommand.mockImplementation(() => Promise.resolve(result));

    await installDependencies(projectDir, packageManager);

    expect(mockRunCommand).toHaveBeenCalledWith(
      `${packageManager}.cmd`,
      ['install'],
      { cwd: projectDir }
    );
  });

  it('should reject an error if package manager is unknown', async () => {
    const projectDir = __dirname;
    const packageManager = 'Unknown';

    await expect(
      installDependencies(projectDir, packageManager)
    ).rejects.toStrictEqual(
      new Error(`Unknown package manager: ${packageManager}`)
    );
  });

  it('should reject an error if run command fails', async () => {
    const projectDir = __dirname;
    const packageManager = 'npm';
    const errorMessage = 'Error while installing dependencies';

    const error = new ExecutionError(errorMessage);

    mock({
      [projectDir]: {
        'package.json': '{}',
      },
    });
    mockRunCommand.mockImplementation(() => Promise.reject(error));

    await expect(
      installDependencies(projectDir, packageManager)
    ).rejects.toStrictEqual(
      new Error(`Error installing dependencies: ${errorMessage}`)
    );
  });

  it('should reject an error if directory does not exist', async () => {
    const projectDir = '/non/existing/directory';
    const packageManager = 'npm';

    mock({});

    await expect(
      installDependencies(projectDir, packageManager)
    ).rejects.toStrictEqual(
      new Error(`Directory ${projectDir} does not exist`)
    );
  });

  it('should reject an error if project directory is not provided', async () => {
    await expect(installDependencies()).rejects.toStrictEqual(
      new Error('Project directory is required')
    );
    await expect(installDependencies(null)).rejects.toStrictEqual(
      new Error('Project directory is required')
    );
  });

  it('should reject an error if project directory is not a string', async () => {
    await expect(installDependencies(32)).rejects.toStrictEqual(
      new Error('Project directory must be a string')
    );
    await expect(installDependencies(true)).rejects.toStrictEqual(
      new Error('Project directory must be a string')
    );
    await expect(installDependencies([])).rejects.toStrictEqual(
      new Error('Project directory must be a string')
    );
  });

  it('should reject an error if package manager is not provided', async () => {
    await expect(installDependencies(__dirname)).rejects.toStrictEqual(
      new Error('Package manager is required')
    );
    await expect(installDependencies(__dirname, null)).rejects.toStrictEqual(
      new Error('Package manager is required')
    );
  });

  it('should reject an error if package manager is not a string', async () => {
    await expect(installDependencies(__dirname, 32)).rejects.toStrictEqual(
      new Error('Package manager must be a string')
    );
    await expect(installDependencies(__dirname, true)).rejects.toStrictEqual(
      new Error('Package manager must be a string')
    );
    await expect(installDependencies(__dirname, true)).rejects.toStrictEqual(
      new Error('Package manager must be a string')
    );
  });
});
