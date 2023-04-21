export interface Result {
  result?: string;
  error?: string;
  code?: number | null;
}

type Event = 'error' | 'data' | 'close';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler = (...args: any[]) => void;

const createOn = (result: Result) => (event: Event, callback: EventHandler) => {
  if (
    event === 'error' &&
    result.error !== undefined &&
    result.error !== null
  ) {
    const error = new Error(result.error);
    callback(error);
  } else if (
    event === 'data' &&
    result.result !== undefined &&
    result.result !== null
  ) {
    callback(result.result);
  } else if (event === 'close') {
    callback(result.code || null);
  }
};

export default class MockChildProcess {
  on: (event: Event, callback: EventHandler) => void;

  stdout: {
    on(event: 'data', callback: (data: string) => void): void;
  };

  constructor(result: Result) {
    this.on = createOn(result);
    this.stdout = { on: createOn(result) };
  }
}
