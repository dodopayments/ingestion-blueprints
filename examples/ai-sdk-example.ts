import { createLLMTracker } from "@dodopayments/ingestion-blueprints";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import "dotenv/config";

async function aiSdkExample() {
  console.log("🤖 AI SDK Simple Usage Example\n");

  try {
    // 1. Create tracker
    const llmTracker = createLLMTracker({
      apiKey: process.env.DODO_PAYMENTS_API_KEY!,
      environment: "test_mode",
      eventName: "your_meter_event_name",
    });

    // 2. Wrap the ai-sdk methods
    const client = llmTracker.wrap({
      client: { generateText },
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

aiSdkExample().catch(console.error);
