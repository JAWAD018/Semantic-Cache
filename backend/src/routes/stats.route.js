import express from "express";

// Valkey connection
// Used to fetch analytics data stored during requests
import { valkey } from "../services/valkey.service.js";

const router = express.Router();

/*

 Analytics Endpoint

 Used to show:
 - Total Requests
 - Cache Hits
 - Cache Misses
 - LLM Calls Saved
 - Cache Hit Rate

 Perfect for hackathon dashboard

*/

router.get("/", async (req, res) => {

  // Total requests received
  const requests =
    Number(
      await valkey.get("stats:requests")
    ) || 0;

  // Number of semantic cache hits
  const hits =
    Number(
      await valkey.get("stats:hits")
    ) || 0;

  // Number of AI calls required
  const misses =
    Number(
      await valkey.get("stats:misses")
    ) || 0;

  // Number of LLM calls avoided
  const savedCalls =
    Number(
      await valkey.get("stats:saved_calls")
    ) || 0;

  /*
  
   --- Hit Rate Formula ---
  
  
   hits / requests * 100
  
   Example:
   80 hits
   100 requests
  
   = 80%
  
  */

  const hitRate =
    requests === 0
      ? 0
      : (
          (hits / requests) *
          100
        ).toFixed(2);

  res.json({
    totalRequests: requests,
    cacheHits: hits,
    cacheMisses: misses,
    hitRate: `${hitRate}%`,
    savedLLMCalls: savedCalls,
  });
});

export default router;