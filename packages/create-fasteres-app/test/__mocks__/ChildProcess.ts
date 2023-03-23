export interface Result {
  result?: string;
  error?: string;
  code?: number | null;
}

type Event = 'error' | 'data' | 'close';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler = (...args: any[]) => void;

const createOn = (result: Result) => (event: Event, callback: EventHandler) => {
  if (event === 'error' && result.error !== undefined) {
    const error = new Error(result.error);
    callback(error);
  }
  if (event === 'data' && result.result !== undefined) {
    callback(result.result);
  } else if (event === 'close') {
    callback(result.code);
  }
};

export default class MockChildProcess {
  on: (event: Event, callback: EventHandler) => void;

  stdout: {
    on(event: 'data', callback: (data: string) => void): void;
  };

  constructor(private readonly result: Result) {
    this.on = createOn(result);
    this.stdout = { on: createOn(result) };
  }
}
