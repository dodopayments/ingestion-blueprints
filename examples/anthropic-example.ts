import { createLLMTracker } from '@dodopayments/ingestion-sdk';
import Anthropic from '@anthropic-ai/sdk';
import "dotenv/config";

async function anthropicExample() {
  console.log('🤖 Anthropic Claude Example - Advanced AI Assistant!\n');

  try {
    // 1. Create your Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // 2. Create tracker ONCE
    const llmTracker = createLLMTracker({
      apiKey: process.env.DODO_PAYMENTS_API_KEY!,
      environment: 'test_mode',
      eventName: 'your_meter_event_name',
    });

    console.log('📡 Setting up Anthropic client with tracking...');

    // 3. Wrap client for automatic tracking
    const trackedAnthropic = llmTracker.wrap({ 
      client: anthropic, 
      customerId: 'customer_123',
      metadata: {
        provider: 'anthropic',
        feature: 'chat_completion'
      }
    });
    
    // 4. Use Claude for a conversation
    console.log('🧠 Making request to Claude...\n');
    
    const response = await trackedAnthropic.messages.create({
      model: 'claude-sonnet-4-0',
      max_tokens: 500,
      messages: [
        { 
          role: 'user', 
          content: 'Explain the concept of artificial intelligence in simple terms. Keep it concise.' 
        }
      ]
    });

    console.log('🤖 Claude Response:');
    console.log(response);
    console.log('\n📊 Token Usage:');
    console.log(response.usage);
    console.log('\n✅ Usage automatically tracked to Dodo Payments!');
    console.log('🏷️  Event tagged with provider: anthropic');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('api key')) {
      console.log('\n💡 Tip: Make sure to set your ANTHROPIC_API_KEY environment variable');
      console.log('   Get your API key from: https://console.anthropic.com/');
    }
  }
}

anthropicExample().catch(console.error);
