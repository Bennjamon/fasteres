import arg from 'arg';
import Options from '../interfaces/Options';

export default function parseArgs(args: string[]): Partial<Options> {
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
    template: parsed['--template'] || 'javascript',
    packageManager: parsed['--package-manager'],
    skipInstall: parsed['--skip-install'] || false,
    skipGit: parsed['--skip-git'] || false,
  };
}
