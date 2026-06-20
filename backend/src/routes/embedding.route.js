import express from "express";

// Service responsible for converting text into embeddings
// Embeddings are numerical vector representations of text
import { getEmbedding } from "../services/embedding.service.js";

// Utility used to calculate similarity between two embeddings
import { cosineSimilarity } from "../utils/similarity.js";

const router = express.Router();

/*

 Purpose:
 Convert text into an embedding vector

 Example:
 Input:
 "What is Angular?"

 Output:
 [-0.09, 0.007, 0.08, ...]

 Used for:
 - Debugging
 - Understanding embeddings
 - Demonstrating semantic search

*/

router.post("/", async (req, res) => {
  try {

    // User input text
    const { text } = req.body;

    /*
    
     Generate Embedding
    
     The transformer model converts text into a
     384-dimensional vector.
    
    */

    const embedding =
      await getEmbedding(text);

    return res.json({

      // Size of embedding vector
      length: embedding.length,

      // Returning first 20 values only
      // Full vector contains 384 values
      embedding:
        embedding.slice(0, 20)

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
});

/*

 Purpose:
 Compare two pieces of text semantically

 Example:

 Text 1:
 "What is Angular?"

 Text 2:
 "Explain Angular"

 Result:
 0.90 (90% similar)

 This endpoint validates that our semantic
 search system works correctly.

*/

router.post("/compare", async (req, res) => {

  // First sentence
  const { text1, text2 } = req.body;

  /*
  
   Generate Embeddings
  
   Convert both texts into vectors
  
  */

  const e1 =
    await getEmbedding(text1);

  const e2 =
    await getEmbedding(text2);

  /*
  
   Calculate Similarity
  
  --- Cosine similarity returns:---
  
   1.0 = Identical meaning
   0.9 = Very similar
   0.8 = Similar
   0.5 = Somewhat related
   0.0 = Completely unrelated

  */

  const similarity =
    cosineSimilarity(e1, e2);

  return res.json({

    // Similarity score between 0 and 1
    similarity

  });
});

export default router;