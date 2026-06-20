import { getEmbedding } from "./services/embedding.service.js";

const embedding = await getEmbedding(
  "What is React?"
);

console.log("Length:", embedding.length);
console.log("First 10:", embedding.slice(0, 10));