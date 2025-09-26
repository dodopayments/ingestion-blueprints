/**
 * Core type definitions for the Dodo Payments Ingestion SDK.
 * Concise contracts shared across client and blueprints.
 */

/**
 * Configuration required to initialize the Dodo client.
 */
export interface DodoConfig {
  /** Dodo Payments API key */
  apiKey: string;
  /** Environment mode - test_mode for testing, live_mode for production */
  environment?: 'test_mode' | 'live_mode';
}

/**
 * Usage event submitted to Dodo Payments for metering.
 */
export interface DodoEvent {
  /** Unique identifier for this specific event */
  event_id: string;
  /** Dodo Payments customer ID */
  customer_id: string;
  /** Event name that triggers the meter */
  event_name: string;
  /** ISO 8601 timestamp when the event occurred */
  timestamp?: string;
  /** Additional properties for filtering and aggregation */
  metadata?: Record<string, any>;
}

/**
 * Normalized response returned after ingesting events.
 */
export interface IngestResponse {
  success: boolean;
  events_processed: number;
  errors?: Array<{
    event_id: string;
    error: string;
  }>;
}

/**
 * Base error for all ingestion-related failures.
 */
export class DodoIngestionError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'DodoIngestionError';
  }
}

/**
 * Thrown when input data is missing or malformed.
 */
export class ValidationError extends DodoIngestionError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Thrown when the Dodo Payments API returns an error status.
 */
export class APIError extends DodoIngestionError {
  constructor(message: string, statusCode: number, details?: any) {
    super(message, 'API_ERROR', statusCode, details);
    this.name = 'APIError';
  }
}

/**
 * Thrown when the SDK is misconfigured at initialization.
 */
export class ConfigurationError extends DodoIngestionError {
  constructor(message: string, details?: any) {
    super(message, 'CONFIGURATION_ERROR', 500, details);
    this.name = 'ConfigurationError';
  }
}

/**
 * Thrown when an upstream LLM/provider-specific issue occurs.
 */
export class ProviderError extends DodoIngestionError {
  constructor(message: string, details?: any) {
    super(message, 'PROVIDER_ERROR', 500, details);
    this.name = 'ProviderError';
  }
}