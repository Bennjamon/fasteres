export default class ExecutionError extends Error {
  constructor(message: string, public readonly code: number | null = null) {
    if (message === null || message === undefined) {
      throw new Error('Message is required');
    }

    super(message);
  }
}
