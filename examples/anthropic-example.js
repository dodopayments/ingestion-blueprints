/**
 * Anthropic Claude Example
 * 
 * SETUP REQUIREMENTS:
 * 1. Set environment variables:
 *    export ANTHROPIC_API_KEY="your_anthropic_api_key_here"  
 *    export DODO_PAYMENTS_API_KEY="your_dodo_payments_api_key_here"
 * 
 * 2. In Dodo Payments Dashboard, create a meter:
 *    - Event Name: "your_meter_event_name"
 *    - Aggregation: "sum" 
 *    - Over Property: "totalTokens"
 *    - Unit: "tokens"
 * 
 * 3. Install dependencies: npm install @anthropic-ai/sdk
 * 
 * 4. Run: node examples/anthropic-example.js
 */

import { createLLMTracker } from '../dist/index.js';
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
      apiKey: process.env.DODO_PAYMENTS_API_KEY,
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
    console.log(response.content[0].text);
    console.log('\n📊 Token Usage:');
    console.log(response.usage);
    console.log('\n✅ Usage automatically tracked to Dodo Payments!');
    console.log('🏷️  Event tagged with provider: anthropic');
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('api key')) {
      console.log('\n💡 Tip: Make sure to set your ANTHROPIC_API_KEY environment variable');
      console.log('   Get your API key from: https://console.anthropic.com/');
    }
  }
}

// Run if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('anthropic-example.js')) {
  anthropicExample().catch(console.error);
}

export { anthropicExample };
