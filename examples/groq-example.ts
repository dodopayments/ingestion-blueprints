import { createLLMTracker } from '@dodopayments/ingestion-blueprints';
import Groq from 'groq-sdk';
import "dotenv/config";

async function groqExample() {
  console.log('🚀 Groq Usage Example - Lightning Fast LLMs!\n');

  try {
    // 1. Create your Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // 2. Create tracker ONCE
    const llmTracker = createLLMTracker({
      apiKey: process.env.DODO_PAYMENTS_API_KEY!,
      environment: 'test_mode',
      eventName: 'your_meter_event_name',
    });

    console.log('📡 Setting up Groq client with tracking...');

    // 3. Wrap client for automatic tracking
    const trackedGroq = llmTracker.wrap({
      client: groq, 
      customerId: 'customer_123',
      metadata: {
        provider: 'groq',
        feature: 'chat_completion'
      }
    });
    
    // 4. Use Groq's ultra-fast models
    console.log('⚡ Making request to Groq (super fast!)...\n');
    
    const response = await trackedGroq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful assistant that explains things concisely.' 
        },
        { 
          role: 'user', 
          content: 'Why is Groq so fast for LLM inference? Explain in 2-3 sentences.' 
        }
      ],
      model: 'llama-3.1-8b-instant', // Fast Groq model
      max_tokens: 150,
      temperature: 0.7
    });

    console.log('🤖 Groq Response:');
    console.log(response.choices[0].message.content);
    console.log('\n📊 Token Usage:');
    console.log(response.usage);
    console.log('\n✅ Usage automatically tracked to Dodo Payments!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

groqExample().catch(console.error);
