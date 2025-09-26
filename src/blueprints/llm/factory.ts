import { LLMTracker } from './tracker.js';
import { wrapLLMClient } from './wrapper.js';

/**
 * Factory function to create a new LLM tracker.
 * The tracker is designed to be created once and reused for multiple customers.
 */
export function createLLMTracker(config: {
  apiKey: string;
  environment?: 'test_mode' | 'live_mode';
  eventName: string;
}) {
  // Validate required config
  if (!config.apiKey) {
    throw new Error('createLLMTracker: apiKey is required');
  }
  if (typeof config.apiKey !== 'string' || config.apiKey.trim().length === 0) {
    throw new Error('createLLMTracker: apiKey must be a non-empty string');
  }
  if (!config.eventName) {
    throw new Error('createLLMTracker: eventName is required');
  }
  if (typeof config.eventName !== 'string' || config.eventName.trim().length === 0) {
    throw new Error('createLLMTracker: eventName must be a non-empty string');
  }

  // Create the tracker once
  const tracker = new LLMTracker(config);

  return {
    /**
     * Wrap an LLM client to automatically track token usage
     * 
     * @param args.client - The LLM client to wrap (OpenAI, Anthropic, Groq, etc.)
     * @param args.customerId - Unique customer identifier for billing
     * @param args.metadata - Additional metadata to attach to tracking events
     * @returns Wrapped client that automatically tracks usage
     * 
     * @example
     * ```typescript
     * const wrappedClient = tracker.wrap({
     *   client: openai,
     *   customerId: 'cus_user123',
     *   metadata: { feature: 'chat' }
     * });
     * const response = await wrappedClient.chat.completions.create({...});
     * ```
     */
    wrap<T>(args: { client: T; customerId: string; metadata?: Record<string, any> }): T {
      const wrapperConfig: { tracker: LLMTracker; customerId: string; metadata?: Record<string, any> } = {
        tracker,
        customerId: args.customerId
      };
      if (args.metadata) wrapperConfig.metadata = args.metadata;
      
      return wrapLLMClient(args.client, wrapperConfig);
    },

    /**
     * Manual tracking for existing responses
     * @param response - The usage object to track
     * @param customerId - The customer ID to track the usage for
     * @param metadata - Additional metadata to attach to tracking events
     */
    async track(response: any, customerId: string, metadata?: Record<string, any>): Promise<void> {
      return tracker.track(response, customerId, metadata);
    },

    /**
     * Health check
     * @returns True if the tracker is healthy, false otherwise
     */
    async healthCheck(): Promise<boolean> {
      return tracker.healthCheck();
    }
  };
}
