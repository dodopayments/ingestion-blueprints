/**
 * LLM token usage tracker.
 * Extracts token counts from common provider responses and ingests a usage event.
 */

import { DodoClient } from '../../core/client.js';
import { DodoEvent } from '../../core/types.js';

/**
 * Normalized token usage across providers.
 */
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  model: string;
}

/**
 * Configuration for `LLMTracker`.
 */
export interface TrackingConfig {
  /** Dodo Payments API key for event ingestion */
  apiKey: string;
  /** Environment mode - use 'test_mode' for development, 'live_mode' for production */
  environment?: 'test_mode' | 'live_mode';
  /** Event name for meter tracking - must match your Dodo Payments meter configuration */
  eventName: string;
}

/**
 * Tracks LLM usage by extracting tokens and emitting a Dodo usage event.
 */
export class LLMTracker {
  private client: DodoClient;
  private eventName: string;

  /**
   * Create a tracker that sends usage events via `DodoClient`.
   */
  constructor(config: TrackingConfig) {
    this.client = new DodoClient({
      apiKey: config.apiKey,
      environment: config.environment || 'test_mode'
    });
    this.eventName = config.eventName;
  }

  /**
   * Track token usage for any LLM response.
   */
  async track(response: any, customerId: string, metadata?: Record<string, any>): Promise<void> {
    const usage = this.extractUsage(response);
    
    if (!usage) {
      return; // Skip if no usage data
    }

    const event: DodoEvent = {
      event_id: this.generateEventId(),
      customer_id: customerId,
      event_name: this.eventName,
      timestamp: new Date().toISOString(),
      metadata: {
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
        model: usage.model,
        ...metadata
      }
    };

    await this.client.ingestEvent(event);
  }

  /**
   * Extract token usage from common LLM response formats.
   */
  private extractUsage(response: any): TokenUsage | null {
    // Google GenAI format
    if (response?.usageMetadata) {
      const usage = response.usageMetadata;
      const inputTokens = usage.promptTokenCount || 0;
      const outputTokens = usage.candidatesTokenCount || 0;
      const totalTokens = usage.totalTokenCount || (inputTokens + outputTokens);
      return {
        inputTokens,
        outputTokens,
        totalTokens,
        model: response.modelVersion || 'unknown'
      };
    }

    if (!response?.usage) {
      return null;
    }

    const usage = response.usage;

    let inputTokens = 0;
    let outputTokens = 0;
    let totalTokens = 0;

    // OpenAI format (also used by Groq and other OpenAI-compatible APIs)
    if (usage.prompt_tokens !== undefined) {
      inputTokens = usage.prompt_tokens || 0;
      outputTokens = usage.completion_tokens || 0;
      totalTokens = usage.total_tokens || (inputTokens + outputTokens);
    }
    // Anthropic format
    else if (usage.input_tokens !== undefined) {
      inputTokens = usage.input_tokens || 0;
      outputTokens = usage.output_tokens || 0;
      totalTokens = inputTokens + outputTokens;
    }
    // AI SDK format
    else if (usage.inputTokens !== undefined) {
      inputTokens = usage.inputTokens || 0;
      outputTokens = usage.outputTokens || 0;
      totalTokens = usage.totalTokens || (inputTokens + outputTokens);
    }
    // Generic format
    else {
      inputTokens = usage.inputTokens || usage.input || 0;
      outputTokens = usage.outputTokens || usage.output || 0;
      totalTokens = usage.totalTokens || usage.total || (inputTokens + outputTokens);
    }

    return {
      inputTokens,
      outputTokens,
      totalTokens,
      model: response.model || 'unknown'
    };
  }

  /**
   * Generate a unique event ID.
   */
  private generateEventId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `llm_${timestamp}_${random}`;
  }

  /**
   * Test API connectivity.
   */
  async healthCheck(): Promise<boolean> {
    return this.client.healthCheck();
  }
}
