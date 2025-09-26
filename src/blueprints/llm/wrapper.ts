/**
 * LLM client wrapper.
 * Creates a lightweight proxy that tracks token usage after method calls.
 */

import { LLMTracker } from './tracker.js';

/**
 * Configuration for wrapping an LLM client.
 */
export interface WrapperConfig {
  tracker: LLMTracker;
  customerId: string;
  metadata?: Record<string, any>;
}

/**
 * Create a simple wrapper around supported LLM clients that automatically tracks usage
 */
export function wrapLLMClient<T>(client: T, config: WrapperConfig): T {
  const { tracker, customerId, metadata } = config;

  // Create a simple proxy that intercepts method calls
  return new Proxy(client as any, {
    get(target, prop, receiver) {
      const originalValue = Reflect.get(target, prop, receiver);

      if (typeof originalValue === 'function') {
        return async function (...args: any[]) {
          try {
            const result = await originalValue.apply(target, args);

            await tracker.track(result, customerId, metadata);

            return result;
          } catch (error) {
            throw error;
          }
        };
      }

      if (originalValue && typeof originalValue === 'object') {
        return wrapLLMClient(originalValue, config);
      }

      return originalValue;
    }
  });
}
