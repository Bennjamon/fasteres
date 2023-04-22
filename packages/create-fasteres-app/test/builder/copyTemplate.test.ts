/* eslint-disable */

import mock from 'mock-fs';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import ncp from 'ncp';

import copyTemplate from '../../lib/builder/copyTemplate';

const templateDir = resolve(__dirname, '../../templates');

jest.mock('ncp');

const ncpMock = ncp as unknown as jest.Mock<typeof ncp>;
const originalNcp = jest.requireActual('ncp');

type FileStruct = {
  [key: string]: string | FileStruct;
};

const compare = (expected: FileStruct, dir: string): void => {
  expect(existsSync(dir)).toBe(true);

  const stat = statSync(dir);

  expect(stat.isDirectory()).toBe(true);

  const files = readdirSync(dir);

  files.forEach((file) => {
    expect(file in expected).toBe(true);
  });

  for (const file in expected) {
    const content = expected[file];
    const filepath = resolve(dir, file);
    const stat = statSync(filepath);

    expect(existsSync(filepath)).toBe(true);

    if (typeof content === 'string') {
      expect(stat.isFile()).toBe(true);

      const fileContent = readFileSync(filepath, 'utf8');

      expect(fileContent).toBe(content);
    } else {
      expect(stat.isDirectory()).toBe(true);

      const struct = content as FileStruct;

      compare(struct, filepath);
    }
  }
};

describe('copyTemplate', () => {
  afterEach(() => {
    mock.restore();
    jest.clearAllMocks();
  });

  it('should copy template provided in directory', async () => {
    const templateContent = {
      file1: 'File 1 content',
      file2: 'File 2 content',
      dir1: {
        file3: 'File 3 content',
      },
      dir2: {
        file4: 'File 4 content',
      },
    };

    mock({
      [templateDir]: {
        javascript: templateContent,
      },
    });

    ncpMock.mockImplementation(originalNcp);

    await copyTemplate('javascript', './src/');

    compare(templateContent, './src');
  });

  it('should reject an error if template does not exist', async () => {
    mock({
      [templateDir]: {},
    });

    await expect(() =>
      copyTemplate('javascript', './src')
    ).rejects.toStrictEqual(new Error('Template javascript does not exist'));
  });

  it('should reject an error if directory already exists and is not empty', async () => {
    const templateContent = {
      file1: 'File 1 content',
      file2: 'File 2 content',
      dir1: {
        file3: 'File 3 content',
      },
      dir2: {
        file4: 'File 4 content',
      },
    };

    mock({
      [templateDir]: {
        javascript: templateContent,
      },
      src: {
        file1: 'File 1 content',
      },
    });

    await expect(() =>
      copyTemplate('javascript', './src')
    ).rejects.toStrictEqual(
      new Error('File or directory ./src already exists')
    );
  });

  it('should reject an error if ncp fails', async () => {
    const templateContent = {
      file1: 'File 1 content',
      file2: 'File 2 content',
      dir1: {
        file3: 'File 3 content',
      },
      dir2: {
        file4: 'File 4 content',
      },
    };
    const errorMessage = 'Error in template copying';

    mock({
      [templateDir]: {
        javascript: templateContent,
      },
    });

    ncpMock.mockImplementation((_, _2, cb) => cb(errorMessage));

    await expect(copyTemplate('javascript', './src')).rejects.toStrictEqual(
      new Error(`Error while copying project files: ${errorMessage}`)
    );
  });
});
