/**
 * Object Storage Blueprint Example
 * Demonstrates tracking object storage uploads with optional bytes
 */

import { Ingestion, trackObjectStorage } from '@dodopayments/ingestion-blueprints';
import "dotenv/config";

async function main() {
  // Initialize ingestion with your API key
  const ingestion = new Ingestion({
    apiKey: process.env.DODO_PAYMENTS_API_KEY!,
    environment: 'test_mode',
    eventName: 'object_storage_upload'
  });

  // Example 1: Track S3 upload with bytes
  await trackObjectStorage(ingestion, {
    customerId: 'customer_123',
    bytes: 1048576, // 1MB
    metadata: {
      bucket: 'my-bucket',
      region: 'us-east-1'
    }
  });

  console.log('✓ Tracked S3 upload with bytes');

  // Example 2: Track GCS upload without bytes (just the event)
  await trackObjectStorage(ingestion, {
    customerId: 'customer_456',
    metadata: {
      provider: 'gcs',
      bucket: 'my-bucket',
    }
  });

  console.log('✓ Tracked GCS upload without bytes');
}

main().catch(console.error);
