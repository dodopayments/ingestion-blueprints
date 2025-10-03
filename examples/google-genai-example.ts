import { GoogleGenAI } from "@google/genai";
import { createLLMTracker } from "@dodopayments/ingestion-blueprints";
import "dotenv/config";

async function main() {
  console.log("🤖 Google Gemini Example\n");

  // 1. Create your Google GenAI client
  const googleGenai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  // 2. Create tracker
  const llmTracker = createLLMTracker({
    apiKey: process.env.DODO_PAYMENTS_API_KEY!,
    environment: "test_mode",
    eventName: "your_meter_event_name",
  });

  // 3. Wrap client for automatic tracking
  const client = llmTracker.wrap({
    client: googleGenai,
    customerId: "customer_123",
  });

  // 4. Use Google GenAI normally - tracking happens automatically
  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Why is the sky blue?",
  });

  console.log("🤖 Google GenAI Response:");
  console.log(response.text);
  console.log("\n📊 Token Usage:");
  console.log(response.usageMetadata);
  console.log("\n✅ Usage automatically tracked to Dodo Payments!");
}

main();
