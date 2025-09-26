# 🚀 Dodo Payments Ingestion SDK

**Effortlessly track LLM token usage for usage-based billing**

Turn any LLM API call into automatic billing events with just few lines of code. Works with OpenAI, Anthropic, Groq, and AI SDK!

---

## ⚡ **Quick Start (2 minutes)**

### 1. **Install**
```bash
npm install @dodopayments/ingestion-sdk
```

### 2. **Get Your API Keys**
- **Dodo Payments API Key**: Get it from [DodoPayments API Keys](https://app.dodopayments.com/developer/api-keys)
- **LLM Provider API Key**: From OpenAI, Anthropic, Groq, etc.

### 3. **Set Up Dodo Payments Meter**
- **Login** to [DodoPayments Dashboard](https://app.dodopayments.com/)
- **Go to** Products → Meters
- **Create a new meter** and note the event name you choose
- **Set "Over Property"** to track what you need:
   - `inputTokens` - Track input/prompt tokens only
   - `outputTokens` - Track output/completion tokens only  
   - `totalTokens` - Track combined input + output tokens

### 4. **Track Usage**
```javascript
import { createLLMTracker } from '@dodopayments/ingestion-sdk';
import OpenAI from 'openai';

// 1️⃣ Create your LLM client (normal way)
const openai = new OpenAI({ apiKey: 'your_openai_key' });

// 2️⃣ Create tracker ONCE at startup
const tracker = createLLMTracker({
  apiKey: 'your_dodo_payments_key',
  environment: 'test_mode',
  eventName: 'llm.chat_completion'  // Match your meter name
});

// 3️⃣ Wrap & use - automatic tracking!
const trackedClient = tracker.wrap({ 
  client: openai, 
  customerId: 'customer_123' 
});

const response = await trackedClient.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }]
});

// ✨ Usage automatically sent to Dodo Payments for billing!
```

**That's it!** 🎉 Every API call now automatically tracks token usage.

## 📋 **Step-by-Step Setup Guide**

### **Step 1: Set Up Dodo Payments Meter**

1. **Login** to [DodoPayments Dashboard](https://app.dodopayments.com/)
2. **Go to** Products → Meters
3. **Create a new meter** and note the event name you choose
4. **Set "Over Property"** to track what you need:
   - `inputTokens` - Track input/prompt tokens only
   - `outputTokens` - Track output/completion tokens only  
   - `totalTokens` - Track combined input + output tokens

### **Step 2: Use the SDK**

```bash
npm install @dodopayments/ingestion-sdk
```

```javascript
import { createLLMTracker } from '@dodopayments/ingestion-sdk';
import OpenAI from 'openai';

// Wrap your LLM client  
const openai = new OpenAI({ apiKey: 'your_openai_key' });

// Create tracker once
const tracker = createLLMTracker({
  apiKey: 'your_dodo_payments_api_key',
  environment: 'test_mode',
  eventName: 'your_meter_event_name'  // From step 1
});

// Wrap your LLM client
const trackedClient = tracker.wrap({ 
  client: openai, 
  customerId: 'customer_123' 
});

// Use normally - automatic tracking!
const response = await trackedClient.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

---

## 🤖 **Supported LLM Providers**

### **OpenAI** 
```javascript
import { createLLMTracker } from '@dodopayments/ingestion-sdk';
import OpenAI from 'openai';

const tracker = createLLMTracker({
  apiKey: 'your_dodo_payments_api_key',
  environment: 'test_mode',
  eventName: 'openai.usage'
});

const openai = new OpenAI({ apiKey: 'sk-...' });
const tracked = tracker.wrap({ client: openai, customerId: 'user123' });

// All methods work automatically:
await tracked.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

### **Anthropic Claude**
```javascript
import { createLLMTracker } from '@dodopayments/ingestion-sdk';
import Anthropic from '@anthropic-ai/sdk';

const tracker = createLLMTracker({
  apiKey: 'your_dodo_payments_api_key',
  environment: 'test_mode',
  eventName: 'anthropic.usage'
});

const anthropic = new Anthropic({ apiKey: 'ant-...' });
const tracked = tracker.wrap({ client: anthropic, customerId: 'user123' });

await tracked.messages.create({
  model: 'claude-3-opus-20240229',
  messages: [{ role: 'user', content: 'Hello Claude!' }]
});
```

### **Groq (Ultra-Fast)**
```javascript
import { createLLMTracker } from '@dodopayments/ingestion-sdk';
import Groq from 'groq-sdk';

const tracker = createLLMTracker({
  apiKey: 'your_dodo_payments_api_key',
  environment: 'test_mode',
  eventName: 'groq.usage'
});

const groq = new Groq({ apiKey: 'gsk-...' });
const tracked = tracker.wrap({ client: groq, customerId: 'user123' });

await tracked.chat.completions.create({
  model: 'llama-3.1-8b-instant',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

### **AI SDK (Universal)**
```javascript
import { createLLMTracker } from '@dodopayments/ingestion-sdk';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const tracker = createLLMTracker({
  apiKey: 'your_dodo_payments_api_key',
  environment: 'test_mode',
  eventName: 'ai-sdk.usage'
});

const aiSdk = { generateText };
const tracked = tracker.wrap({ client: aiSdk, customerId: 'user123' });

await tracked.generateText({
  model: openai('gpt-4'),
  prompt: 'Hello world'
});
```

---

## 🔧 **Configuration Options**

### **Tracker Configuration**
```javascript
const tracker = createLLMTracker({
  apiKey: string,              // Required: Dodo Payments API key
  environment: 'test_mode' | 'live_mode',  // Required: Environment
  eventName: string            // Required: Must match meter event name
});
```

### **Per-Request Options**
```javascript
const trackedClient = tracker.wrap({
  client: yourLLMClient,       // Required: Your LLM client
  customerId: string,          // Required: Customer ID for billing
  metadata?: {                 // Optional: Additional data
    feature: 'chat',
    userTier: 'premium',
    sessionId: 'session_123'
  }
});
```

---

## 🏃‍♂️ **Advanced Usage**

### **Multiple Providers**
```javascript
// Set up different trackers for different providers
const openaiTracker = createLLMTracker({
  apiKey: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'live_mode',
  eventName: 'openai.usage'
});

const groqTracker = createLLMTracker({
  apiKey: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'live_mode', 
  eventName: 'groq.usage'
});
```

## 📊 **What Gets Tracked**

Every LLM API call automatically sends this data to Dodo Payments:

```json
{
  "event_id": "llm_1673123456_abc123",
  "customer_id": "customer_123", 
  "event_name": "llm.usage",
  "timestamp": "2024-01-08T10:30:00Z",
  "metadata": {
    "inputTokens": 10,
    "outputTokens": 25, 
    "totalTokens": 35,
    "model": "gpt-4",
    "provider": "openai"
  }
}
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

**❌ "API key invalid"**
```javascript
// ✅ Make sure you're using the right environment
const tracker = createLLMTracker({
  apiKey: 'your_key_here',
  environment: 'test_mode',  // Use 'live_mode' for production
  eventName: 'your_event_name'
});
```

**❌ "Event name not found"**
- Check your event name matches exactly what's in your Dodo Payments meter
- Event names are case-sensitive

**❌ "No usage data tracked"**
- Make sure your LLM provider returns usage data in the response
- Some models/endpoints don't include token counts

---

## 📋 **Complete Examples**

### **Express.js API**
```javascript
import express from 'express';
import { createLLMTracker } from '@dodopayments/ingestion-sdk';
import OpenAI from 'openai';

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create tracker once at startup
const tracker = createLLMTracker({
  apiKey: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'live_mode',
  eventName: 'api.chat_completion'
});

app.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    // Wrap client for this request
    const trackedClient = tracker.wrap({
      client: openai,
      customerId: userId,
      metadata: { endpoint: '/chat' }
    });
    
    const response = await trackedClient.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }]
    });
    
    res.json({ 
      message: response.choices[0].message.content,
      usage: response.usage // Token counts for debugging
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```


## ✨ **Why This SDK?**

✅ **Zero Setup Complexity** - Works out of the box  
✅ **No Reinitialization** - Set up once, use everywhere  
✅ **Universal Provider Support** - OpenAI, Anthropic, Groq, and AI-SDK  
✅ **Type-Safe** - Full TypeScript support  
✅ **Performance Optimized** - Minimal overhead

**Perfect for:** SaaS apps, AI chatbots, content generation tools, any LLM-powered application that needs usage-based billing.

---