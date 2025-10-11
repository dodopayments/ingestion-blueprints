/**
 * Stream Blueprint - Track bytes consumed from read/write streams
 */

import { Ingestion } from '../../core/ingestion.js';

export interface TrackStreamBytesOptions {
  /** Customer ID for billing */
  customerId: string;
  /** Number of bytes consumed */
  bytes?: number;
  /** Additional flexible metadata */
  metadata?: Record<string, any>;
}

/**
 * Track stream usage (bytes consumed)
 */
export async function trackStreamBytes(
  ingestion: Ingestion,
  options: TrackStreamBytesOptions
): Promise<void> {
  await ingestion.track({
    customerId: options.customerId,
    metadata: {
      ...(options.bytes !== undefined && { bytes: options.bytes }),
      ...options.metadata
    }
  });
}
