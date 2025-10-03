import { createLLMTracker } from "@dodopayments/ingestion-blueprints";

import client, { OpenAI } from "openai";
import "dotenv/config";

async function openrouterExample() {
  console.log("🚀 OpenRouter Usage Example\n");
  try {
    // 1. Create your OpenRouter client (using OpenAI SDK)
    const openrouter = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // 2. Create tracker
    const llmTracker = createLLMTracker({
      apiKey: process.env.DODO_PAYMENTS_API_KEY!,
      environment: "test_mode",
      eventName: "your_meter_event_name",
    });

    // 3. Wrap client for automatic tracking
    const client = llmTracker.wrap({
      client: openrouter,
      customerId: "customer_123",
    });

    // 4. Use OpenRouter normally - tracking happens automatically
    const response = await client.chat.completions.create({
      model: "x-ai/grok-4-fast:free",
      messages: [{ role: "user", content: "Explain the theory of relativity in simple terms." }],
      max_tokens: 500,
    });
    
    console.log("🤖 OpenRouter Response:");
    console.log(response.choices[0].message.content);
    console.log("\n📊 Token Usage:");
    console.log(response.usage);
    console.log("\n✅ Usage automatically tracked to Dodo Payments!");
  } catch (error) {
    console.error(error);
  }
}

openrouterExample().catch(console.error);
