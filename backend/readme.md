# 🚀 Semantic Cache Gateway

An Open Source AI Semantic Cache Gateway powered by **Valkey**, **TheBreeth**, and **LLMs**.

This project reduces AI inference costs and response times by intelligently reusing previous responses for semantically similar prompts.

Built during the Valkey Hyderabad Hackathon 2026.

---

# Problem

Large Language Models (LLMs) are expensive and slow.

For example:

```text
What is React?
Explain React
Tell me about React.js
Can you describe React?
```

Although these prompts ask the same thing, most AI systems call the LLM every single time.

This results in:

* Higher costs
* Increased latency
* Wasted compute resources
* Poor scalability

---

# Solution

Semantic Cache Gateway uses embeddings and vector similarity to detect semantically similar prompts.

Instead of matching exact text:

```text
What is React?
```

The system understands:

```text
Explain React
Tell me about React
Describe React.js
```

have the same meaning.

If similarity exceeds a threshold, the cached response is returned instantly.

No LLM call required.

---

# Architecture

```text
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Generate Vector │
                  │   Embedding     │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Valkey Semantic │
                  │      Cache      │
                  └────────┬────────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      Similar Match                No Match
         Found                     Found
             │                           │
             ▼                           ▼
    Return Cached Response         Call LLM
                                        │
                                        ▼
                                Generate Answer
                                        │
                                        ▼
                                Store In Valkey
                                        │
                                        ▼
                               Store In TheBreeth
```

---

# Technologies Used

## Valkey

Used as the semantic cache layer.

Stores:

* Prompt
* Response
* Embedding Vector
* Metadata

Benefits:

* Millisecond retrieval
* Reduced LLM calls
* Cost savings

---

## TheBreeth

Used as persistent memory.

Stores:

* AI conversations
* Historical interactions
* Extracted entities
* Relationship graphs

Benefits:

* Long-term memory
* Knowledge graph creation
* Historical search

---

## Groq

Used as the inference provider.

Only called when:

```text
Cache Miss
```

occurs.

---

## Xenova Transformers

Used for generating embeddings.

Model:

```text
Xenova/all-MiniLM-L6-v2
```

Embedding Size:

```text
384 Dimensions
```

---

# How It Works

## First Request

User asks:

```text
What is React?
```

System:

1. Generates embedding
2. Searches Valkey
3. No match found
4. Calls Groq
5. Saves response in Valkey
6. Saves interaction in TheBreeth

Response:

```json
{
  "source": "groq",
  "cacheHit": false
}
```

---

## Second Request

User asks:

```text
Explain React
```

System:

1. Generates embedding
2. Compares with existing cache
3. Similarity = 92%
4. Returns cached response

Response:

```json
{
  "source": "semantic-cache",
  "cacheHit": true,
  "similarity": 92
}
```

No LLM call required.

---

# Features

## Semantic Cache

Detects meaning instead of exact text.

Example:

```text
What is Node.js?
Explain Node.js
Tell me about Node
```

All can resolve to the same cached response.

---

## Cost Reduction

Avoids unnecessary LLM requests.

Metrics tracked:

* Saved LLM calls
* Cache hit rate
* Estimated cost savings

---

## Long-Term Memory

Every new AI interaction is stored in TheBreeth.

This enables:

* Historical recall
* Knowledge graph creation
* Entity extraction

---

## Analytics Dashboard API

Tracks:

* Total requests
* Cache hits
* Cache misses
* Hit rate
* Saved LLM calls

---

# API Endpoints

## Ask AI

POST

```http
/api/ask
```

Request:

```json
{
  "prompt": "What is React?"
}
```

---

## Embedding Test

POST

```http
/api/embedding
```

Request:

```json
{
  "text": "What is React?"
}
```

---

## Compare Similarity

POST

```http
/api/embedding/compare
```

Request:

```json
{
  "text1": "What is React?",
  "text2": "Explain React"
}
```

---

## Statistics

GET

```http
/api/stats
```

Response:

```json
{
  "totalRequests": 10,
  "cacheHits": 7,
  "cacheMisses": 3,
  "hitRate": "70%",
  "savedLLMCalls": 7
}
```

---

# Setup

## Install Dependencies

```bash
npm install
```

---

## Start Valkey

```bash
docker run -d \
--name valkey \
-p 6379:6379 \
valkey/valkey:latest
```

---

## Environment Variables

Create:

```env
PORT=4000

VALKEY_HOST=localhost
VALKEY_PORT=6379

GROQ_API_KEY=your_groq_key

THEBREETH_API_KEY=your_breeth_key
```

---

## Start Server

```bash
npm run dev
```

---

# Future Improvements

* Valkey Vector Search Module
* Multi-Provider AI Gateway
* OpenAI Support
* Gemini Support
* Claude Support
* Distributed Cache Clustering
* Web Dashboard
* Cost Analytics
* Semantic Cache Warming
* Multi-Tenant Architecture

---

# Impact

This project demonstrates how Valkey can be used as a semantic caching layer for AI applications.

Benefits:

✅ Faster Responses

✅ Reduced LLM Costs

✅ Improved Scalability

✅ Persistent Knowledge Storage

✅ Open Source Friendly

---

# Built For

Valkey Hyderabad Hackathon 2026

Using:

* Valkey
* TheBreeth
* Groq
* Node.js
* Express.js
* Docker
* Transformers.js

---