/**
 * Stream Blueprint Example
 * Demonstrates tracking stream byte consumption
 */

import {
  Ingestion,
  trackStreamBytes,
} from "@dodopayments/ingestion-blueprints";
import "dotenv/config";

async function main() {
  // Initialize ingestion
  const ingestion = new Ingestion({
    apiKey: process.env.DODO_PAYMENTS_API_KEY!,
    environment: "test_mode",
    eventName: "stream_consumption",
  });

  // Example 1: Track video streaming
  await trackStreamBytes(ingestion, {
    customerId: "customer_123",
    bytes: 10485760, // 10MB
    metadata: {
      stream_type: "video",
    },
  });

  console.log("✓ Tracked video stream consumption");

  // Example 2: Track audio streaming
  await trackStreamBytes(ingestion, {
    customerId: "customer_456",
    bytes: 2097152, // 2MB
    metadata: {
      stream_type: "audio",
    },
  });

  console.log("✓ Tracked audio stream consumption");
}

main().catch(console.error);
