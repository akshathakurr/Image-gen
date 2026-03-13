const express = require("express");
const cors = require("cors");
const { HfInference } = require("@huggingface/inference");

const app = express();
const PORT = process.env.PORT || 3000;

// IMPORTANT: set this in your environment, do NOT hardcode in client-side code
const HF_API_KEY = process.env.HF_API_KEY;

if (!HF_API_KEY) {
  console.warn(
    "Warning: HF_API_KEY environment variable is not set. Requests to Hugging Face will fail.",
  );
}

const hf = new HfInference(HF_API_KEY);

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

// Simple health check
app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/generate", async (req, res) => {
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

    // result is a Blob in Node; convert to Buffer to send
    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error("Error calling Hugging Face Inference:", err);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});
