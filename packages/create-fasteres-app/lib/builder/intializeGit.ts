import ora from 'ora';
import runCommand from '../utils/runCommand';

export default async function intializeGit(projectDir: string): Promise<void> {
  const spinner = ora('Initializing Git repository...');
  spinner.start();
  try {
    await runCommand('git', ['init'], { cwd: projectDir });
    spinner.stop();
  } catch (err) {
    spinner.fail(`Error initialiting Git repository: ${err}`);

    process.exit(1);
  }
}
