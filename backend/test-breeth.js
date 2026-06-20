import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

try {
  console.log("KEY:", process.env.THEBREETH_API_KEY);

  const response = await axios.post(
    "https://api.thebreeth.com/v1/episodes",
    {
      content: "Testing Breeth from Semantic Cache Hackathon",
      group_id: "default",
      source_description: "manual-test",
      extract_intent: false,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.THEBREETH_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("SUCCESS:");
  console.log(response.data);

} catch (error) {

  console.log("STATUS:");
  console.log(error.response?.status);

  console.log("ERROR:");
  console.log(error.response?.data || error.message);
}