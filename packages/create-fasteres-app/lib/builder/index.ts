import path from 'path';

import Options from '../interfaces/Options';
import { INFO } from '../ui/prefixes';
import copyTemplate from './copyTemplate';
import installDependencies from './installDependencies';

const cwd = process.cwd();

export default async function build(options: Options): Promise<void> {
  const projectPath = path.join(cwd, options.appName);

  console.log();
  console.log(`${INFO} creating a new project at ${projectPath}`);

  await copyTemplate(options.template, projectPath);

  if (!options.skipInstall) {
    await installDependencies(projectPath, options.packageManager);
  }
}
