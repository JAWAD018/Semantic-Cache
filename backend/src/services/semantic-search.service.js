// Valkey database
import { valkey } from "./valkey.service.js";

// Embedding generator
import { getEmbedding } from "./embedding.service.js";

// Similarity calculator
import { cosineSimilarity } from "../utils/similarity.js";

/*

--- Similarity Threshold ---


 If score >= 0.85

 Treat as same intent

*/

const THRESHOLD = 0.85;

/*

//  Semantic Search Engine


 Flow:

 Prompt
    |
 Embedding
    |
 Load Cached Records
    |   
 Compare Similarity
    |
 Best Match
    |
 Cache Hit ?

*/

export async function findSimilarPrompt(prompt) {


  
    // Generate Embedding For Current Prompt
  


  const promptEmbedding =
    await getEmbedding(prompt);

  /*
  
  --- Fetch All Cache Records ---
  
  
   Example:
  
   cache:uuid1
   cache:uuid2
   cache:uuid3
  
  */

  const keys =
    await valkey.keys("cache:*");

  let bestMatch = null;

  let highestScore = 0;

//    Compare Against Every Cached Entry

  for (const key of keys) {

    const cached = JSON.parse(
      await valkey.get(key)
    );

    /*
    --- Cosine Similarity ---
    
    
     Returns:
    
     1.0 = identical meaning
     0.9 = very similar
     0.5 = partially related
     0.0 = unrelated
    
    */

    const score =
      cosineSimilarity(
        promptEmbedding,
        cached.embedding
      );

    
    //  Track Best Match

    if (score > highestScore) {

      highestScore = score;

      bestMatch = cached;
    }
  }

  
  
    // Cache Hit
  

  if (
    bestMatch &&
    highestScore >= THRESHOLD
  ) {
    return {

      hit: true,

      similarity:
        highestScore,

      data:
        bestMatch,

    };
  }

//    Cache Miss


  return {
    hit: false,
  };
}