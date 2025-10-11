/**
 * API Gateway Blueprint - Track API calls at the gateway level
 */

import { Ingestion } from '../../core/ingestion.js';

export interface TrackAPICallOptions {
  /** Customer ID for billing */
  customerId: string;
  /** Additional flexible metadata */
  metadata?: Record<string, any>;
}

/**
 * Track API call usage
 */
export async function trackAPICall(
  ingestion: Ingestion,
  options: TrackAPICallOptions
): Promise<void> {
  const trackData: { customerId: string; metadata?: Record<string, any> } = {
    customerId: options.customerId
  };

  if (options.metadata) {
    trackData.metadata = options.metadata;
  }

  await ingestion.track(trackData);
}

export interface CreateBatchOptions {
  /** Maximum batch size before auto-flush */
  maxSize?: number;
  /** Auto-flush interval in milliseconds */
  flushInterval?: number;
}

/**
 * Create a batch helper for high-volume API tracking
 */
export function createBatch(
  ingestion: Ingestion,
  config: CreateBatchOptions = {}
) {
  const maxSize = config.maxSize || 100;
  const flushInterval = config.flushInterval || 5000;
  
  const events: TrackAPICallOptions[] = [];
  let timer: NodeJS.Timeout | null = null;

  const flush = async () => {
    if (events.length === 0) return;
    
    const toSend = events.splice(0, events.length);
    await Promise.all(toSend.map(event => trackAPICall(ingestion, event)));
  };

  const resetTimer = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      flush().catch(console.error);
    }, flushInterval);
  };

  return {
    add: (event: TrackAPICallOptions) => {
      events.push(event);
      
      if (events.length >= maxSize) {
        if (timer) clearTimeout(timer);
        flush().catch(console.error);
      } else {
        resetTimer();
      }
    },
    
    flush: async () => {
      if (timer) clearTimeout(timer);
      await flush();
    },
    
    cleanup: async () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      await flush();
      events.length = 0; // Clear array to allow GC
    }
  };
}
