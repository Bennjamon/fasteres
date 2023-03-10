import build from './builder';
import askForMissingInfo from './utils/askForMissingInfo';
import parseArgs from './utils/parseArgs';

export default async function createApp(args: string[]): Promise<void> {
  console.clear();

  const parsedOptions = parseArgs(args);

  const options = await askForMissingInfo(parsedOptions);

  await build(options);

  // log fasteres with big letters
}
