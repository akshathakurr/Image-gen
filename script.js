const form = document.getElementById("prompt-form");
const promptInput = document.getElementById("prompt");
const styleSelect = document.getElementById("style");
const stepsInput = document.getElementById("steps");
const generateBtn = document.getElementById("generate-btn");
const errorEl = document.getElementById("error");

const previewImage = document.getElementById("preview-image");
const previewLoading = document.getElementById("preview-loading");
const previewStatus = document.getElementById("preview-status");
const previewStyle = document.getElementById("preview-style");
const previewSteps = document.getElementById("preview-steps");
const previewTime = document.getElementById("preview-time");

function setLoading(isLoading) {
  if (isLoading) {
    previewLoading.classList.add("visible");
    generateBtn.disabled = true;
    previewStatus.textContent = "Generating…";
  } else {
    previewLoading.classList.remove("visible");
    generateBtn.disabled = false;
    previewStatus.textContent = "Done";
  }
}

function formatStyleLabel(value) {
  const map = {
    "cinematic": "Cinematic",
    "digital-art": "Digital art",
    "3d-render": "3D render",
    "analog-film": "Analog film",
    "anime": "Anime",
    "line-art": "Line art",
  };
  return map[value] ?? value;
}

function simulateImage(prompt, style, steps) {
  const words = prompt
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 12)
    .join(" ");

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  previewImage.innerHTML = `
    <div style="width:100%;display:flex;flex-direction:column;gap:6px;">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;color:#e5e7eb;">
        <span>${formatStyleLabel(style)} mock</span>
        <span style="font-size:0.7rem;color:#9ca3af;">${steps} steps • ${timeString}</span>
      </div>
      <div style="border-radius:10px;overflow:hidden;background:radial-gradient(circle at top left,#4f46e5,#020617);padding:12px;border:1px solid rgba(148,163,184,0.4);box-shadow:0 14px 35px rgba(15,23,42,0.9);min-height:110px;display:flex;flex-direction:column;justify-content:space-between;">
        <p style="font-size:0.9rem;line-height:1.4;color:#e5e7eb;">
          ${words || "Empty prompt"}
        </p>
        <p style="margin-top:8px;font-size:0.75rem;color:#9ca3af;">
          This is a decorative placeholder, not an actual AI-generated image.
        </p>
      </div>
    </div>
  `;

  previewStyle.textContent = `Style: ${formatStyleLabel(style)}`;
  previewSteps.textContent = `Steps: ${steps}`;
  previewTime.textContent = `Last run: ${timeString}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const prompt = (promptInput.value || "").trim();
  const style = styleSelect.value;
  const steps = Number(stepsInput.value || 0);

  errorEl.textContent = "";

  if (!prompt) {
    errorEl.textContent = "Please enter a prompt before generating.";
    promptInput.focus();
    return;
  }

  if (!Number.isFinite(steps) || steps < 5 || steps > 50) {
    errorEl.textContent = "Steps must be between 5 and 50.";
    stepsInput.focus();
    return;
  }

  setLoading(true);

  window.setTimeout(() => {
    simulateImage(prompt, style, steps);
    setLoading(false);
  }, 900);
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    if (document.activeElement === promptInput || document.activeElement === stepsInput) {
      form.requestSubmit();
      event.preventDefault();
    }
  }
});

