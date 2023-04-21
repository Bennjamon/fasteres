import ExecutionError from '../../lib/utils/ExecutionError';

describe('ExecutionError', () => {
  it('should extends Error class', () => {
    expect(ExecutionError.prototype).toBeInstanceOf(Error);
  });

  it('should create an instance with an error message and code provided', () => {
    const message = 'Error message';
    const code = 1;

    const error = new ExecutionError(message, code);

    expect(error.message).toEqual(message);
    expect(error.code).toEqual(code);
  });

  it('code should be null if not provided', () => {
    const message = 'Error message';

    const error = new ExecutionError(message);

    expect(error.message).toBe(message);
    expect(error.code).toBeNull();
  });
});
