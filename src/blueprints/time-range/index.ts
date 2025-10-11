/**
 * Time Range Blueprint - Track resource consumption by elapsed time
 */

import { Ingestion } from '../../core/ingestion.js';

export interface TrackTimeRangeOptions {
  /** Customer ID for billing */
  customerId: string;
  /** Duration in milliseconds */
  durationMs?: number;
  /** Duration in seconds */
  durationSeconds?: number;
  /** Duration in minutes */
  durationMinutes?: number;
  /** Additional flexible metadata */
  metadata?: Record<string, any>;
}

/**
 * Track time range (runtime/duration) usage
 */
export async function trackTimeRange(
  ingestion: Ingestion,
  options: TrackTimeRangeOptions
): Promise<void> {
  await ingestion.track({
    customerId: options.customerId,
    metadata: {
      ...(options.durationMs !== undefined && { duration_ms: options.durationMs }),
      ...(options.durationSeconds !== undefined && { duration_seconds: options.durationSeconds }),
      ...(options.durationMinutes !== undefined && { duration_minutes: options.durationMinutes }),
      ...options.metadata
    }
  });
}
