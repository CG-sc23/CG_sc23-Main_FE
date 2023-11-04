export function assert(
  condition: unknown,
  error: Error | string = new Error(),
): asserts condition {
  if (condition) return;
  if (typeof error !== 'string') throw error;
  throw new Error(error);
}
