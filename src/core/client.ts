/**
 * Dodo Payments API client for event ingestion.
 * Wraps the official `dodopayments` SDK and exposes a minimal surface area.
 */

import { DodoConfig, DodoEvent, IngestResponse, APIError, ValidationError } from './types.js';
import DodoPayments from 'dodopayments';

/**
 * Client responsible for validating and ingesting usage events.
 */
export class DodoClient {
  private readonly client: DodoPayments;
  private readonly environment: 'test_mode' | 'live_mode';

  /**
   * Create a Dodo client.
   *
   * @throws ValidationError when the API key is missing
   */
  constructor(config: DodoConfig) {
    if (!config.apiKey) {
      throw new ValidationError('API key is required');
    }

    this.environment = config.environment || 'live_mode';
    
    this.client = new DodoPayments({
      bearerToken: config.apiKey,
      environment: this.environment
    });
  }

  /**
   * Submit events to Dodo Payments ingestion endpoint.
   */
  async ingestEvents(events: DodoEvent[]): Promise<IngestResponse> {
    if (!events.length) {
      throw new ValidationError('At least one event is required');
    }

    for (const event of events) {
      this.validateEvent(event);
    }

    try {
      const response = await this.client.usageEvents.ingest({ events });
      
      return {
        success: true,
        events_processed: events.length,
        ...(response as any)
      };

    } catch (error: any) {
      if (error.status || error.statusCode) {
        throw new APIError(
          error.message || `API Error: ${error.status || error.statusCode}`,
          error.status || error.statusCode,
          error
        );
      }

      throw new APIError(
        `Failed to submit events: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        { originalError: error }
      );
    }
  }

  /**
   * Submit a single event.
   */
  async ingestEvent(event: DodoEvent): Promise<IngestResponse> {
    return this.ingestEvents([event]);
  }

  /**
   * Health check to verify API reachability and credentials.
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.usageEvents.list({ page_size: 1, page_number: 1 });
      return true;
    } catch (error: any) {
      // 4xx => reachable (auth/params issue), 5xx/network => not reachable
      if (error.status && error.status >= 400 && error.status < 500) {
        return true;
      }
      return false;
    }
  }

  /**
   * Validate a single event structure.
   */
  private validateEvent(event: DodoEvent): void {
    if (!event.event_id) {
      throw new ValidationError('event_id is required');
    }

    if (!event.customer_id) {
      throw new ValidationError('customer_id is required');
    }

    if (!event.event_name) {
      throw new ValidationError('event_name is required');
    }

    if (event.timestamp) {
      try {
        new Date(event.timestamp).toISOString();
      } catch {
        throw new ValidationError('timestamp must be a valid ISO 8601 date string');
      }
    }
  }

  /**
   * Get the configured environment.
   */
  getEnvironment(): string {
    return this.environment;
  }

  /**
   * Get client information for debugging.
   * NOTE: Consider injecting real SDK version from package.json at build time.
   */
  getClientInfo(): { environment: string; sdkVersion: string } {
    return {
      environment: this.environment,
      sdkVersion: 'official-sdk'
    };
  }
}