import Options from '../../lib/interfaces/Options';
import parseArgs from '../../lib/utils/parseArgs';

type TestSet = [string, Partial<Options>];

const runSet = (set: TestSet) => {
  const [argsJoined, expected] = set;
  const args = argsJoined.split(/ +/g);

  expect(parseArgs(args)).toEqual(expected);
};

describe('parseArgs', () => {
  it('should parse given arguments', () => {
    const sets: TestSet[] = [
      [
        '--template javascript --skip-install --package-manager npm project-name',
        {
          template: 'javascript',
          skipInstall: true,
          skipGit: false,
          packageManager: 'npm',
          appName: 'project-name',
        },
      ],
      [
        'project-name --skip-git --template typescript',
        {
          template: 'typescript',
          skipGit: true,
          skipInstall: false,
          packageManager: undefined,
          appName: 'project-name',
        },
      ],
    ];

    sets.forEach(runSet);
  });

  it('should use javascript as default template if not provided', () => {
    runSet([
      '--package-manager npm --skip-install project-name',
      {
        template: 'javascript',
        packageManager: 'npm',
        skipInstall: true,
        skipGit: false,
        appName: 'project-name',
      },
    ]);
  });

  it('should use an empty string as appName if not provided', () => {
    runSet([
      '--template javascript --package-manager npm --skip-install',
      {
        template: 'javascript',
        packageManager: 'npm',
        skipInstall: true,
        skipGit: false,
        appName: '',
      },
    ]);
  });
});
