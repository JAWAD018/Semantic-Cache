import axios from "axios";

export async function saveEpisode(
  prompt,
  response
) {
  try {

    console.log(
      "BREETH KEY:",
      process.env.THEBREETH_API_KEY?.substring(0, 12)
    );

    const result = await axios.post(
      "https://api.thebreeth.com/v1/episodes",
      {
        content: `
User Prompt:
${prompt}

AI Response:
${response}
        `,
        group_id: "default",
        source_description:
          "semantic-cache-gateway",
        extract_intent: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.THEBREETH_API_KEY.trim()}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "Saved To TheBreeth"
    );

    return {
      success: true,
      data: result.data,
    };

  } catch (error) {

    console.log("TheBreeth Error");

    console.log(
      error.response?.data ||
      error.message
    );

    return {
      success: false,
      error:
        error.response?.data ||
        error.message,
    };
  }
}