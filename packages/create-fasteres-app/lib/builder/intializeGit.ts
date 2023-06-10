import ora from 'ora';
import { existsSync, statSync } from 'fs';
import runCommand from '../utils/runCommand';

export default async function intializeGit(projectDir: string): Promise<void> {
  if (projectDir === undefined || projectDir === null) {
    throw new Error('Path is not provided');
  }

  if (typeof projectDir !== 'string') {
    throw new Error('Path is not a string');
  }

  if (!existsSync(projectDir)) {
    throw new Error(`Directory does not exist: ${projectDir}`);
  }

  const stat = statSync(projectDir);

  if (!stat.isDirectory()) {
    throw new Error(`Path is not a directory: ${projectDir}`);
  }

  const spinner = ora('Initializing Git repository...');
  spinner.start();

  try {
    await runCommand('git', ['init'], { cwd: projectDir });
    spinner.stop();
  } catch (err) {
    spinner.fail(`Error initialiting Git repository: ${err}`);

    let message: string;

    if (err instanceof Error) {
      message = err.message;
    } else {
      message = `${err}`;
    }

    console.log(message);

    throw new Error(`Error initializing Git repository: ${message}`);
  }
}
