import { spawn, SpawnOptions } from 'child_process';

const defaultOptions: SpawnOptions = {
  cwd: process.cwd(),
  stdio: 'pipe',
};

export default function runCommand(
  command: string,
  args: string[],
  options: SpawnOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const completeOptions = {
      ...defaultOptions,
      ...options,
    };

    const child = spawn(command, args, completeOptions);
    let output = '';

    child.on('error', reject);

    child.stdout?.on('data', (data: string) => {
      output += data;
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(output);
      } else {
        resolve();
      }
    });
  });
}
