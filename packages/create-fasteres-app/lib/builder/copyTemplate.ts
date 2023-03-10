import ncp from 'ncp';
import path from 'path';
import fs from 'fs';
import ora from 'ora';
import { ERROR } from '../ui/prefixes';

const templatesDir = path.resolve(__dirname, '../../templates');

export default function copyTemplate(
  template: string,
  destination: string
): Promise<void> {
  if (fs.existsSync(destination)) {
    if (
      !fs.statSync(destination).isDirectory() ||
      fs.readdirSync(destination).length !== 0
    )
      console.log(`${ERROR} file or directory ${destination} already exists`);
    process.exit(1);
  }

  const templatePath = path.resolve(templatesDir, template);

  if (!fs.existsSync(templatePath)) {
    console.log(`${ERROR} template ${template} does not exist`);
    process.exit(1);
  }

  fs.mkdirSync(destination);

  return new Promise((resolve) => {
    const spinner = ora('Copying project files...');
    ncp(templatePath, destination, (err) => {
      if (err) {
        spinner.fail(`Error while copying project files: ${err}`);
        process.exit(1);
      }

      resolve();
    });
  });
}
