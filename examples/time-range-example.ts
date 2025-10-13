/**
 * Time Range Blueprint Example
 * Demonstrates tracking resource runtime/duration
 */

import { Ingestion, trackTimeRange } from "@dodopayments/ingestion-blueprints";
import "dotenv/config";

async function main() {
  // Initialize ingestion
  const ingestion = new Ingestion({
    apiKey: process.env.DODO_PAYMENTS_API_KEY!,
    environment: "test_mode",
    eventName: "time_range_usage",
  });

  // Example 1: Track duration in milliseconds
  await trackTimeRange(ingestion, {
    customerId: "customer_123",
    durationMs: 5432,
    metadata: {
      resource_type: "serverless_function",
    },
  });

  console.log("✓ Tracked duration in milliseconds");

  // Example 2: Track duration in seconds
  await trackTimeRange(ingestion, {
    customerId: "customer_456",
    durationSeconds: 120,
    metadata: {
      resource_type: "container",
    },
  });

  console.log("✓ Tracked duration in seconds");

  // Example 3: Track duration in minutes
  await trackTimeRange(ingestion, {
    customerId: "customer_789",
    durationMinutes: 15,
    metadata: {
      resource_type: "vm_instance",
    },
  });
  
  console.log("✓ Tracked duration in minutes\n");
}

main().catch(console.error);
