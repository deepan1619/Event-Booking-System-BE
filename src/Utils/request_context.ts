import { AsyncLocalStorage } from 'async_hooks';

/**
 * Defines the shape of contextual data stored per request.
 */
export interface RequestContext {
  request_id: string;
}

/**
 * Maintains request-scoped context using AsyncLocalStorage.
 */
export const requestContext = new AsyncLocalStorage<RequestContext>();

/**
 * Retrieves the current request identifier from the async context.
 */
export const getRequestId = (): string | undefined => {
  return requestContext.getStore()?.request_id;
};
