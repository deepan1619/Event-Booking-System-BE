/**
 * Returns the current timestamp in ISO 8601 string format.
 */
export const nowISO = (): string => {
  return new Date().toISOString();
};
