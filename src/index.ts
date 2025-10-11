/**
 * Dodo Payments Ingestion SDK public entry.
 * Simple, clean exports for core client and blueprint tracking helpers.
 */

// Core exports
export * from './core/index.js';

// Core Ingestion class
export { Ingestion } from './core/ingestion.js';
export type { IngestionConfig } from './core/ingestion.js';

// Object Storage Blueprint
export { trackObjectStorage } from './blueprints/object-storage/index.js';
export type { TrackObjectStorageOptions } from './blueprints/object-storage/index.js';

// Stream Blueprint
export { trackStreamBytes } from './blueprints/stream/index.js';
export type { TrackStreamBytesOptions } from './blueprints/stream/index.js';

// Time Range Blueprint
export { trackTimeRange } from './blueprints/time-range/index.js';
export type { TrackTimeRangeOptions } from './blueprints/time-range/index.js';

// API Gateway Blueprint
export { trackAPICall, createBatch } from './blueprints/api-gateway/index.js';
export type { TrackAPICallOptions, CreateBatchOptions } from './blueprints/api-gateway/index.js';

// LLM tracking (existing feature)
export * from './blueprints/llm/index.js';