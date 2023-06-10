import { join } from 'path';
import build from '../../lib/builder';
import copyTemplate from '../../lib/builder/copyTemplate';
import installDependencies from '../../lib/builder/installDependencies';
import intializeGit from '../../lib/builder/intializeGit';
import Options from '../../lib/interfaces/Options';

jest.mock('../../lib/builder/copyTemplate');
jest.mock('../../lib/builder/installDependencies');
jest.mock('../../lib/builder/intializeGit');

describe('build', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new project, copying template, installing dependencies and initializing git', async () => {
    const options: Options = {
      appName: 'test',
      template: 'template',
      packageManager: 'npm',
      skipInstall: false,
      skipGit: false,
    };

    const cwd = process.cwd();
    const projectPath = join(cwd, options.appName);

    await build(options);

    expect(copyTemplate).toHaveBeenCalledWith(options.template, projectPath);
    expect(installDependencies).toHaveBeenCalledWith(
      projectPath,
      options.packageManager
    );
    expect(intializeGit).toHaveBeenCalledWith(projectPath);
  });

  it("shouldn't install dependencies if skipInstall is true", async () => {
    const options: Options = {
      appName: 'test',
      template: 'template',
      packageManager: 'npm',
      skipInstall: true,
      skipGit: false,
    };

    const cwd = process.cwd();
    const projectPath = join(cwd, options.appName);

    await build(options);

    expect(copyTemplate).toHaveBeenCalledWith(options.template, projectPath);
    expect(installDependencies).not.toHaveBeenCalled();
    expect(intializeGit).toHaveBeenCalledWith(projectPath);
  });

  it("shouldn't initialize git if skipGit is true", async () => {
    const options: Options = {
      appName: 'test',
      template: 'template',
      packageManager: 'npm',
      skipInstall: false,
      skipGit: true,
    };

    const cwd = process.cwd();
    const projectPath = join(cwd, options.appName);

    await build(options);

    expect(copyTemplate).toHaveBeenCalledWith(options.template, projectPath);
    expect(installDependencies).toHaveBeenCalledWith(
      projectPath,
      options.packageManager
    );
    expect(intializeGit).not.toHaveBeenCalled();
  });
});
