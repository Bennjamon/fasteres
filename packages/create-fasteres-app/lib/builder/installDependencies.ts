import ora from 'ora';
import { ERROR } from '../ui/prefixes';
import runCommand from '../utils/runCommand';

const allowedPackageManagers: string[] = ['npm', 'yarn', 'pnpm'];

export default async function installDependencies(
  projectDir: string,
  packageManager: string
) {
  if (!allowedPackageManagers.includes(packageManager)) {
    console.log(`${ERROR} unknown package manager: ${packageManager}`);
    process.exit(1);
  }

  let command = packageManager;

  if (process.platform === 'win32') {
    command += '.cmd';
  }

  const spinner = ora(`Installing dependencies with ${command}...`);
  spinner.start();

  try {
    await runCommand(command, ['install'], { cwd: projectDir });
    spinner.stop();
  } catch (err) {
    spinner.fail(`Error installing dependencies: ${err}`);

    process.exit(1);
  }
}
