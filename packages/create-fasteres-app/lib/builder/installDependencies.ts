import ora from 'ora';
import { existsSync } from 'fs';
import runCommand from '../utils/runCommand';
import ExecutionError from '../utils/ExecutionError';

const allowedPackageManagers: string[] = ['npm', 'yarn', 'pnpm'];

export default async function installDependencies(
  projectDir: string,
  packageManager: string
) {
  if (projectDir === null || projectDir === undefined) {
    throw new Error('Project directory is required');
  }

  if (typeof projectDir !== 'string') {
    throw new Error('Project directory must be a string');
  }

  if (packageManager === null || packageManager === undefined) {
    throw new Error('Package manager is required');
  }

  if (typeof packageManager !== 'string') {
    throw new Error('Package manager must be a string');
  }

  if (!allowedPackageManagers.includes(packageManager)) {
    throw new Error(`Unknown package manager: ${packageManager}`);
  }

  if (!existsSync(projectDir)) {
    throw new Error(`Directory ${projectDir} does not exist`);
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

    const error: ExecutionError = err as ExecutionError;

    throw new Error(`Error installing dependencies: ${error.message}`);
  }
}
