# 🚀 Dodo Payments Ingestion SDK

**Effortlessly track LLM token usage for usage-based billing**

Turn any LLM API call into automatic billing events with just a few lines of code. Works with OpenAI, Anthropic, Groq, and AI SDK!

---

## ⚡ **Quick Start**

### 1. **Install**
```bash
npm install @dodopayments/ingestion-blueprints
```
### 2. **Get your API Keys**
- **Dodo Payments API Key**: [Dodopayments API Key](https://app.dodopayments.com/developers/api-keys)
- **LLM Provider API Key**: From your LLM provider (e.g. OpenAI, Anthropic, Groq, etc.)

### 3. **Set Up Dodo Payments Meter**
1. Login to [DodoPayments Dashboard](https://app.dodopayments.com/)
2. Go to Products → Meters
3. Create a new meter with:
   - **Event Name**: `your_meter_event_name` (you'll use this in code)
   - **Aggregation**: `sum`
   - **Over Property**: Choose `totalTokens`, `inputTokens`, or `outputTokens`

### 4. **Track Usage**
```javascript
import { createLLMTracker } from '@dodopayments/ingestion-blueprints';
import OpenAI from 'openai';

// 1. Create your OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 2. Create tracker ONCE
const llmTracker = createLLMTracker({
  apiKey: process.env.DODO_PAYMENTS_API_KEY,
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

// 4. Use normally - tracking happens automatically
const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
  max_tokens: 500
});

console.log(response.choices[0].message.content);
console.log(response.usage);
// ✨ Usage automatically tracked to Dodo Payments!
```

**That's it!** 🎉 Every API call now automatically tracks token usage.

## 🧪 **Try It Yourself**

We've included working examples you can run immediately:

### **Run Examples**

1. Make sure your dodopayments meter is set up and you have your API keys.

2. **Clone and install**:
   ```bash
   git clone https://github.com/dodopayments/ingestion-blueprints.git
   cd ingestion-blueprints
   npm install
   ```

3. **Build the SDK**:
   ```bash
   npm run build
   ```

4. **Set up environment variables** in `examples/.env`:
   ```bash
   DODO_PAYMENTS_API_KEY=your_dodo_key_here
   OPENAI_API_KEY=your_openai_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   GROQ_API_KEY=your_groq_key_here
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_key_here
   ```

5. Set eventName in each example file to match your Dodo Payments meter's event name.

6. **Run an example**:
   ```bash
   cd examples
   npm install

   npx tsx openai-example.ts      # OpenAI example
   npx tsx anthropic-example.ts   # Anthropic example  
   npx tsx groq-example.ts        # Groq example
   npx tsx ai-sdk-example.ts      # AI SDK example
   ```

All examples automatically track token usage to your Dodo Payments account!

---

## 🤖 **Supported Providers**

### **OpenAI** 
```javascript
import { createLLMTracker } from '@dodopayments/ingestion-blueprints';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const llmTracker = createLLMTracker({
  apiKey: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'test_mode',
  eventName: 'your_meter_event_name',
});

const client = llmTracker.wrap({ 
  client: openai, 
  customerId: 'customer_123',
  metadata: { provider: 'openai', feature: 'chat_completion' }
});

const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
  max_tokens: 500
});
```

### **Anthropic Claude**
```javascript
import { createLLMTracker } from '@dodopayments/ingestion-blueprints';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const llmTracker = createLLMTracker({
  apiKey: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'test_mode',
  eventName: 'your_meter_event_name',
});

const client = llmTracker.wrap({ 
  client: anthropic, 
  customerId: 'customer_123',
  metadata: { provider: 'anthropic', feature: 'chat_completion' }
});

const response = await client.messages.create({
  model: 'claude-sonnet-4-0',
  max_tokens: 500,
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

### **Groq (Ultra-Fast)**
```javascript
import { createLLMTracker } from '@dodopayments/ingestion-blueprints';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const llmTracker = createLLMTracker({
  apiKey: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'test_mode',
  eventName: 'your_meter_event_name',
});

const client = llmTracker.wrap({
  client: groq, 
  customerId: 'customer_123',
  metadata: { provider: 'groq', feature: 'chat_completion' }
});

const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'llama-3.1-8b-instant',
  max_tokens: 150
});
```

### **AI SDK (Vercel)**
```javascript
import { createLLMTracker } from '@dodopayments/ingestion-blueprints';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

const llmTracker = createLLMTracker({
  apiKey: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'test_mode',
  eventName: 'your_meter_event_name',
});

const client = llmTracker.wrap({
  client: { generateText },
  customerId: 'customer_123',
  metadata: { model: 'gemini-2.0-flash', feature: 'chat' }
});

const response = await client.generateText({
  model: google('gemini-2.0-flash'),
  prompt: 'Hello!',
  maxOutputTokens: 500
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

## 🏃 **Advanced Usage**

### **Multiple Providers**
```javascript
// Track different providers separately
const llmTrackerOpenAI = createLLMTracker({
  apiKey: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'live_mode',
  eventName: 'openai_usage'
});

const llmTrackerGroq = createLLMTracker({
  apiKey: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'live_mode', 
  eventName: 'groq_usage'
});
```

### **Dynamic Customer IDs**
```javascript
// Wrap per request with different customers
app.post('/chat', async (req, res) => {
  const { message, userId } = req.body;
  
  const client = llmTracker.wrap({
    client: openai,
    customerId: userId,
    metadata: { endpoint: '/chat' }
  });
  
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: message }]
  });
  
  res.json({ message: response.choices[0].message.content });
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

## 📋 **Express.js Example**

```javascript
import express from 'express';
import { createLLMTracker } from '@dodopayments/ingestion-blueprints';
import OpenAI from 'openai';

const app = express();
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const llmTracker = createLLMTracker({
  apiKey: process.env.DODO_PAYMENTS_API_KEY,
  environment: 'live_mode',
  eventName: 'api_chat_completion'
});

app.post('/chat', async (req, res) => {
  const { message, userId } = req.body;
  
  const client = llmTracker.wrap({
    client: openai,
    customerId: userId,
    metadata: { endpoint: '/chat' }
  });
  
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: message }],
    max_tokens: 500
  });
  
  res.json({ 
    message: response.choices[0].message.content,
    usage: response.usage
  });
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