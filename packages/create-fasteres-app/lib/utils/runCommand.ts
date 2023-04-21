import { spawn, SpawnOptions } from 'child_process';
import ExecutionError from './ExecutionError';

interface ExecutionResult {
  code: number;
  result: string;
}

const defaultOptions: SpawnOptions = {
  cwd: process.cwd(),
  stdio: 'pipe',
};

export default function runCommand(
  command: string,
  args: string[],
  options: SpawnOptions = {}
): Promise<ExecutionResult> {
  return new Promise((resolve, reject) => {
    if (command === undefined || command === null) {
      throw new ExecutionError('Command is required');
    }

    if (typeof command !== 'string') {
      throw new ExecutionError('Command must be a string');
    }

    if (!Array.isArray(args) || args.some((arg) => typeof arg !== 'string')) {
      throw new ExecutionError('Arguments must be a string array');
    }

    if (typeof options !== 'object' || Array.isArray(options)) {
      throw new ExecutionError('Options must be an object');
    }

    const completeOptions = {
      ...defaultOptions,
      ...options,
    };

    const child = spawn(command, args, completeOptions);
    let output = '';

    child.on('error', (err) => {
      reject(new ExecutionError(err.message));
    });

    child.stdout?.on('data', (data: string) => {
      output += data;
    });

    child.on('close', (code) => {
      if (code && code !== 0) {
        reject(new ExecutionError(output, code));
      } else {
        resolve({
          code: code || 0,
          result: output,
        });
      }
    });
  });
}
