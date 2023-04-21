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
});
