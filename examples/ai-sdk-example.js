/**
 * AI SDK Example - Clean Solution
 *
 * SETUP REQUIREMENTS:
 * 1. Set environment variables:
 *    export GOOGLE_GENERATIVE_AI_API_KEY="your_google_api_key_here"
 *    export DODO_PAYMENTS_API_KEY="your_dodo_payments_api_key_here"
 *
 * 2. In Dodo Payments Dashboard, create a meter:
 *    - Event Name: "your_meter_event_name"
 *    - Aggregation: "sum"
 *    - Over Property: "totalTokens"
 *    - Unit: "tokens"
 *
 * 3. Install dependencies: npm install ai @ai-sdk/google
 *
 * 4. Run: node examples/ai-sdk-example.js
 */

import { createLLMTracker } from "../dist/index.js";
import { generateText, streamText } from "ai";
import { google } from "@ai-sdk/google";
import "dotenv/config";

async function aiSdkExample() {
  console.log("🤖 AI SDK Simple Usage Example - Problem Solved!\n");

  try {
    // 1. Create tracker
    const llmTracker = createLLMTracker({
      apiKey: process.env.DODO_PAYMENTS_API_KEY,
      environment: "test_mode",
      eventName: "your_meter_event_name",
    });

    // 2. Wrap the ai-sdk methods
    const client = llmTracker.wrap({
      client: { generateText, streamText },
      customerId: "customer_123",
      metadata: {
        model: "gemini-2.0-flash",
        feature: "chat",
        userTier: "premium",
        sessionId: "sess_456",
      },
    });

    // 3. Use the wrapped function
    const response = await client.generateText({
      model: google("gemini-2.0-flash"),
      prompt: "Hello, I am a cool guy! Tell me a fun fact.",
      maxOutputTokens: 500,
    });

    console.log(response);
    console.log(response.usage);
    console.log("✅ Automatically tracked for customer\n");
  } catch (error) {
    console.error(error);
  }
}

// Run if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith("ai-sdk-example.js")) {
  aiSdkExample().catch(console.error);
}

export { aiSdkExample };
