import inquirer, { DistinctQuestion } from 'inquirer';

import Options from '../interfaces/Options';

export default async function askForMissingInfo(
  options: Partial<Options>
): Promise<Options> {
  const prompts: DistinctQuestion[] = [];
  const result = {
    ...options,
  };

  if (!options.appName) {
    prompts.push({
      type: 'input',
      name: 'appName',
      message: 'Enter your application name',
    });
  }

  if (options.packageManager === undefined) {
    prompts.push({
      name: 'packageManager',
      type: 'list',
      choices: ['npm', 'yarn', 'pnpm'],
      message: 'Wich package manager do you want to use?',
    });
  }

  if (options.template === undefined) {
    prompts.push({
      name: 'template',
      type: 'list',
      choices: ['javascript', 'typescript'],
      message: 'What template do you want to use for your project?',
    });
  }

  if (prompts.length === 0) {
    console.log(prompts);

    return result as Options;
  }

  const answers = await inquirer.prompt(prompts);

  const keys = Object.keys(answers) as Array<keyof Options>;

  keys.forEach((key) => {
    result[key] = answers[key];
  });

  return result as Options;
}
