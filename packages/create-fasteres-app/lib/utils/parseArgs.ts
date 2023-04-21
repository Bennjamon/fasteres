import arg from 'arg';
import Options from '../interfaces/Options';

export default function parseArgs(args: string[]): Partial<Options> {
  if (args === undefined || args === null) {
    throw new Error('Arguments are required');
  }

  if (
    !Array.isArray(args) ||
    args.some((argument) => typeof argument !== 'string')
  ) {
    throw new Error('Arguments must be a string array');
  }

  const parsed = arg(
    {
      '--template': String,
      '--package-manager': String,
      '--skip-install': Boolean,
      '--skip-git': Boolean,
    },
    {
      argv: args,
    }
  );

  return {
    appName: parsed._.join(' '),
    template: parsed['--template'],
    packageManager: parsed['--package-manager'],
    skipInstall: parsed['--skip-install'] || false,
    skipGit: parsed['--skip-git'] || false,
  };
}
