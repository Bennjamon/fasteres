export default class ExecutionError extends Error {
  constructor(message: string, public readonly code: number | null = null) {
    if (message === null || message === undefined) {
      throw new Error('Message is required');
    }

    if (typeof message !== 'string') {
      throw new Error('Message must be a string');
    }

    if ((typeof code !== 'number' && code !== null) || Number.isNaN(code)) {
      throw new Error('Code must be a number');
    }

    super(message);
  }
}
