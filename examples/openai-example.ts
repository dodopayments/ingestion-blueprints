import { createLLMTracker } from '@dodopayments/ingestion-blueprints';
import OpenAI from 'openai';
import "dotenv/config";

async function openaiExample() {
  console.log('🚀 Simple Usage Example\n');

  try {
    // 1. Create your OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // 2. Create tracker ONCE
    const llmTracker = createLLMTracker({
      apiKey: process.env.DODO_PAYMENTS_API_KEY!,
      environment: 'test_mode',
      eventName: 'your_meter_event_name',
    });

    // 3. Wrap client for automatic tracking
    const client = llmTracker.wrap({ 
      client: openai, 
      customerId: 'customer_123',
      metadata: {
        provider: 'openai',
        feature: 'chat_completion'
      }
    });

    // 4. Use OpenAI normally - tracking happens automatically
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Tell me about the solar system in detail.' }],
      max_tokens: 500
    });

    console.log('🤖 OpenAI Response:');
    console.log(response.choices[0].message.content);
    console.log('\n📊 Token Usage:');
    console.log(response.usage);
    console.log('\n✅ Usage automatically tracked to Dodo Payments!');

  } catch (error) {
    console.error(error);
  }
}

openaiExample().catch(console.error);
