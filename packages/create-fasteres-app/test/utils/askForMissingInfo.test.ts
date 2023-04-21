// @ts-nocheck
/* eslint-disable */

import inquirer from 'inquirer';
import Options from '../../lib/interfaces/Options';
import askForMissingInfo from '../../lib/utils/askForMissingInfo';

jest.mock('inquirer');
const prompt = inquirer.prompt as unknown as jest.Mock<typeof inquirer.prompt>;

describe('askForMissingInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should ask for missing info', async () => {
    const partialOptions: Partial<Options> = {
      appName: 'app',
      packageManager: 'packageManager',
      skipGit: true,
      skipInstall: false,
    };
    const rest = {
      template: 'template',
    };

    prompt.mockImplementation(() => rest as any);

    await expect(askForMissingInfo(partialOptions)).resolves.toStrictEqual({
      ...partialOptions,
      ...rest,
    });
    expect(prompt).toHaveBeenCalled();
  });

  it("shouldn't ask anything if info is completed", async () => {
    const options: Options = {
      appName: 'app',
      packageManager: 'packageManager',
      skipGit: true,
      skipInstall: true,
      template: 'some template',
    };

    await expect(askForMissingInfo(options)).resolves.toStrictEqual(options);
    expect(prompt).not.toHaveBeenCalled();
  });

  it('should throw an error if options are not provided', async () => {
    await expect(askForMissingInfo()).rejects.toStrictEqual(
      new Error('Options are required')
    );
    await expect(askForMissingInfo(null)).rejects.toStrictEqual(
      new Error('Options are required')
    );
  });

  it('should throw an error if are not an object', async () => {
    await expect(askForMissingInfo('options')).rejects.toStrictEqual(
      new Error('Options must be an object')
    );
    await expect(askForMissingInfo(23)).rejects.toStrictEqual(
      new Error('Options must be an object')
    );
    await expect(askForMissingInfo(true)).rejects.toStrictEqual(
      new Error('Options must be an object')
    );
    await expect(askForMissingInfo([])).rejects.toStrictEqual(
      new Error('Options must be an object')
    );
  });
});
