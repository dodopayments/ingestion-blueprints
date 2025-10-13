/**
 * API Gateway Blueprint Example
 * Demonstrates tracking API calls with optional batching
 */

import { Ingestion, trackAPICall, createBatch } from '@dodopayments/ingestion-blueprints';
import "dotenv/config";

async function main() {
  // Initialize ingestion
  const ingestion = new Ingestion({
    apiKey: process.env.DODO_PAYMENTS_API_KEY!,
    environment: 'test_mode',
    eventName: 'api_call'
  });

  // Example 1: Track single API call
  await trackAPICall(ingestion, {
    customerId: 'customer_123',
    metadata: {
      endpoint: '/api/v1/users',
      method: 'GET',
      status_code: 200,
      response_time_ms: 45
    }
  });

  console.log('✓ Tracked single API call');

  // Example 2: Track API call with detailed metadata
  await trackAPICall(ingestion, {
    customerId: 'customer_456',
    metadata: {
      endpoint: '/api/v1/orders',
      method: 'POST',
      status_code: 201,
      response_time_ms: 120,
      request_size_bytes: 512,
      response_size_bytes: 256,
      user_agent: 'mobile-app/1.0',
      ip_address: '192.168.1.1'
    }
  });

  console.log('✓ Tracked API call with rich metadata');

  // Example 3: High-volume scenario with batching
  console.log('Starting batch tracking...');
  const batch = createBatch(ingestion, {
    maxSize: 10,      // Flush after 10 events
    flushInterval: 2000  // Or flush every 2 seconds
  });

  // Simulate high-volume API traffic
  for (let i = 0; i < 25; i++) {
    batch.add({
      customerId: `customer_${i % 3}`, // Rotate between 3 customers
      metadata: {
        endpoint: '/api/v1/products',
        method: 'GET',
        status_code: 200,
        response_time_ms: Math.floor(Math.random() * 100),
        cache_hit: i % 2 === 0
      }
    });
  }

  console.log('✓ Added 25 API calls to batch');

  // Clean up the batch (flushes remaining events and clears timer)
  await batch.cleanup();
  console.log('✓ Cleaned up batch (flushed and cleared timer)');
}

main().catch(console.error);
