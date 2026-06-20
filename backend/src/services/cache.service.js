import crypto from "crypto";
import { saveEpisode } from "./thebreeth.service.js";

// Converts prompts into embeddings
import { getEmbedding } from "./embedding.service.js";

// Valkey connection
import { valkey } from "./valkey.service.js";

/*

 --- Cache Service---


 Responsible for:

 1. Generating embeddings
 2. Storing prompts
 3. Storing responses
 4. Storing vectors in Valkey


*/

/*

 --- Legacy Exact Cache Lookup ---


 Currently unused after semantic search implementation.

 Kept for future comparison/testing.

*/

export async function getCached(prompt) {

  const data =
    await valkey.get(prompt);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

/*

 --- Save Cache Entry--

 Input:

 Prompt
 Response

 Process:

 Prompt
   |
 Generate Embedding
   |
 Store In Valkey

*/

export async function saveCache(
  prompt,
  response
) {

    // Convert Prompt To Embedding


  const embedding =
    await getEmbedding(prompt);

  /*
  
  --- Unique Cache Key ---
  
  
   Example:
  
   cache:8f32a4...
  
  */

  const key =
    "cache:" + crypto.randomUUID();

  
//    Store In Valkey
  
  

  await valkey.set(
    key,
    JSON.stringify({

      // Original user prompt
      prompt,

      // LLM response
      response,

      // Embedding vector
      embedding,

      // Number of cache hits
      hits: 1,

      // Creation timestamp
      createdAt: Date.now(),

    })
  );

  const breethResult =
  await saveEpisode(
    prompt,
    response
  );

return breethResult;
}