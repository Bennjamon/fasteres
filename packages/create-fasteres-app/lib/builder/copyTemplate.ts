import ncp from 'ncp';
import path from 'path';
import fs from 'fs';
import ora from 'ora';

const templatesDir = path.resolve(__dirname, '../../templates');

export default function copyTemplate(
  template: string,
  destination: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destination)) {
      if (
        !fs.statSync(destination).isDirectory() ||
        fs.readdirSync(destination).length !== 0
      )
        reject(Error(`File or directory ${destination} already exists`));
    }

    const templatePath = path.resolve(templatesDir, template);

    if (!fs.existsSync(templatePath)) {
      reject(Error(`Template ${template} does not exist`));
    }

    fs.mkdirSync(destination);

    const spinner = ora('Copying project files...');
    ncp(templatePath, destination, (err) => {
      if (err) {
        spinner.fail(`Error while copying project files: ${err}`);
        reject(Error(`Error while copying project files: ${err}`));
      }

      resolve();
    });
  });
}
