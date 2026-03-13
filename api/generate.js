const { HfInference } = require("@huggingface/inference");

const HF_API_KEY = process.env.HF_API_KEY;

if (!HF_API_KEY) {
  console.warn(
    "Warning: HF_API_KEY environment variable is not set. Requests to Hugging Face will fail.",
  );
}

const hf = new HfInference(HF_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { model, prompt, width, height } = req.body || {};

  if (!model || !prompt) {
    return res
      .status(400)
      .json({ error: "Missing required fields: model and prompt." });
  }

  if (!HF_API_KEY) {
    return res
      .status(500)
      .json({ error: "HF_API_KEY is not configured on the server." });
  }

  try {
    const result = await hf.textToImage({
      model,
      inputs: prompt,
      parameters: {
        width,
        height,
      },
    });

    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(buffer);
  } catch (err) {
    console.error("Error calling Hugging Face Inference:", err);
    res.status(500).json({ error: "Failed to generate image." });
  }
};

