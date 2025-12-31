/**
 * Safely serializes a value to JSON by handling circular references
 * and normalizing Error objects for structured logging.
 */
export const safeStringify = (value: unknown): string => {
  const seen = new WeakSet();

  return JSON.stringify(
    value,
    (_, val) => {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) {
          return '[Circular]';
        }
        seen.add(val);
      }

      if (val instanceof Error) {
        return {
          name: val.name,
          message: val.message,
          stack: val.stack,
        };
      }

      return val;
    },
    2
  );
};

/**
 * Escapes special characters in a string to safely construct
 * regular expressions from user-provided input.
 */
export const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
