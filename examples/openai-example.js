/**
 * OpenAI Example - Clean Solution to the Reinitialization Problem
 * 
 * SETUP REQUIREMENTS:
 * 1. Set environment variables:
 *    export OPENAI_API_KEY="your_openai_api_key_here"  
 *    export DODO_PAYMENTS_API_KEY="your_dodo_payments_api_key_here"
 * 
 * 2. In Dodo Payments Dashboard, create a meter:
 *    - Event Name: "your_meter_event_name"
 *    - Aggregation: "sum" 
 *    - Over Property: "totalTokens"
 *    - Unit: "tokens"
 * 
 * 3. Install dependencies: npm install openai
 * 
 * 4. Run: node examples/openai-example.js
 */

import { createLLMTracker } from '../dist/index.js';
import OpenAI from 'openai';
import "dotenv/config";

async function openaiExample() {
  console.log('🚀 Simple Usage Example - Problem Solved!\n');

  try {
    // 1. Create your LLM client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });

    // 2. Create tracker ONCE
    const llmTracker = createLLMTracker({
      apiKey: process.env.DODO_PAYMENTS_API_KEY,
      environment: 'test_mode',
      eventName: 'your_meter_event_name',
    });

    // Each request gets its own wrapped client with dynamic customerId
    const client = llmTracker.wrap({ client: openai, customerId: 'customer_123' });

    const response = await client.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: 'Tell me about solar system in detail.' }],
      max_tokens: 500
    });

    console.log(response);
    console.log(response.usage);
    console.log("✅ Automatically tracked for customer\n");

  } catch (error) {
    console.error(error);
  }
}

// Run if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('openai-example.js')) {
  openaiExample().catch(console.error);
}

export { openaiExample };
