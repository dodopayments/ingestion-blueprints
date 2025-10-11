/**
 * Object Storage Blueprint - Track file uploads to object storage (S3, GCS, Azure Blob, etc.)
 */

import { Ingestion } from '../../core/ingestion.js';

export interface TrackObjectStorageOptions {
  /** Customer ID for billing */
  customerId: string;
  /** Number of bytes uploaded */
  bytes?: number;
  /** Additional flexible metadata */
  metadata?: Record<string, any>;
}

/**
 * Track object storage upload usage
 */
export async function trackObjectStorage(
  ingestion: Ingestion,
  options: TrackObjectStorageOptions
): Promise<void> {
  await ingestion.track({
    customerId: options.customerId,
    metadata: {
      ...(options.bytes !== undefined && { bytes: options.bytes }),
      ...options.metadata
    }
  });
}
