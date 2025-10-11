/**
 * Core Ingestion class for tracking usage events.
 */

import { DodoClient } from './client.js';
import { DodoEvent } from './types.js';

export interface IngestionConfig {
  /** Dodo Payments API key */
  apiKey: string;
  /** Environment mode - test_mode for testing, live_mode for production */
  environment?: 'test_mode' | 'live_mode';
  /** Event name for the meter (e.g., 's3_upload', 'api_request') */
  eventName: string;
}

/**
 * Ingestion client for tracking usage events.
 */
export class Ingestion {
  private client: DodoClient;
  private eventName: string;

  constructor(config: IngestionConfig) {
    this.client = new DodoClient({
      apiKey: config.apiKey,
      environment: config.environment || 'test_mode'
    });
    this.eventName = config.eventName;
  }

  /**
   * Track a usage event
   */
  async track(event: {
    customerId: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const dodoEvent: DodoEvent = {
      event_id: this.generateEventId(),
      customer_id: event.customerId,
      event_name: this.eventName,
      timestamp: new Date().toISOString(),
      metadata: event.metadata || {}
    };

    await this.client.ingestEvent(dodoEvent);
  }

  /**
   * Generate a unique event ID with the event name as prefix
   */
  private generateEventId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${this.eventName}_${timestamp}_${random}`;
  }
}
