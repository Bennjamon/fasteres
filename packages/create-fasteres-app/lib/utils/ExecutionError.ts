export default class ExecutionError extends Error {
  constructor(message: string, public readonly code?: number | null) {
    super(message);
  }
}
