import express from "express";

// Semantic search service
// Finds similar prompts using embeddings + cosine similarity
import { findSimilarPrompt } from "../services/semantic-search.service.js";

// Stores prompt, response and embedding in Valkey
import { saveCache } from "../services/cache.service.js";

// Calls Groq when no semantic match exists
import { askGroq } from "../services/groq.service.js";

// Direct Valkey connection used for analytics
import { valkey } from "../services/valkey.service.js";

const router = express.Router();

/*
 --- Main endpoint of our Semantic Cache Gateway --

 Flow:
 User Prompt ->   Generate Embedding
                       |            
           Search Similar Cached Prompts
                       |
                    Cache Hit ?
                    /      \
                   YES      NO
                    |        |
                Return    Groq
                Cache       |
                  Save In Valkey

*/

router.post("/", async (req, res) => {
  try {
    // Prompt sent by user
    const { prompt } = req.body;

    // Validate input
    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    // Start timer to measure total response time
    const start = Date.now();

    // Track total requests for analytics dashboard
    await valkey.incr("stats:requests");

    /*
    
     Semantic Search
    
    * Generate embedding for current prompt
    * Compare against all cached embeddings in Valkey
    * Return best match if similarity > threshold

    */

    const cached =
      await findSimilarPrompt(prompt);

    /*
    
     -- Semantic Cache Hit--
    
    * Similar question already exists
     * No AI call required
     * Saves money and reduces latency
    
    */

    if (cached.hit) {

      // Analytics
      await valkey.incr("stats:hits");
      await valkey.incr("stats:saved_calls");

      // Calculate response time
      const responseTime =
        Date.now() - start;

     return res.json({
        source: "semantic-cache",
        cacheHit: true,

        savedToValkey: true,
        savedToBreeth: true,

        similarity: Number(
            (cached.similarity * 100)
            .toFixed(2)
        ),

        matchedPrompt:
            cached.data.prompt,

        responseTime:
            `${responseTime}ms`,

        llmCallsSaved: 1,

        estimatedCostSaved:
            "$0.002",

        response:
            cached.data.response,
        });
        }

    /*
   
     Cache Miss
    
     No similar prompt found
     Need to call Groq

    */

    await valkey.incr("stats:misses");

    // Generate fresh response from AI
    const response =
      await askGroq(prompt);

    /*
    
     Store In Valkey
    
     Save:
     Prompt
     Response
     Embedding
     Metadata
    
    */

    const breethResult =
        await saveCache(
            prompt,
            response
        );

        console.log(
  "BREETH RESULT:",
  breethResult
);

    const responseTime =
      Date.now() - start;

   return res.json({
        source: "groq",
        cacheHit: false,

        savedToValkey: true,
        savedToBreeth: breethResult?.success || false,

        similarity: null,

        matchedPrompt: null,

        responseTime:
            `${responseTime}ms`,

        llmCallsSaved: 0,

        estimatedCostSaved:
            "$0.000",

        response,
        });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

export default router;