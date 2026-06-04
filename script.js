const canvas = document.querySelector("#hero-scene");
const ctx = canvas.getContext("2d");
const form = document.querySelector("#waitlist-form");
const statusEl = document.querySelector("#form-status");
const waitlistEndpoint = document
  .querySelector('meta[name="waitlist-endpoint"]')
  ?.getAttribute("content")
  ?.trim();

const colors = ["#0f766e", "#c8503f", "#c59731", "#315f8f"];
let width = 0;
let height = 0;
let nodes = [];
let animationFrame = null;

function resizeScene() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  createNodes();
}

function createNodes() {
  const count = Math.max(28, Math.floor(width / 34));
  nodes = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.26,
    vy: (Math.random() - 0.5) * 0.26,
    radius: 2 + Math.random() * 3,
    color: colors[index % colors.length],
  }));
}

function drawScene() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#151618";
  ctx.fillRect(0, 0, width, height);

  nodes.forEach((node) => {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < -20) node.x = width + 20;
    if (node.x > width + 20) node.x = -20;
    if (node.y < -20) node.y = height + 20;
    if (node.y > height + 20) node.y = -20;
  });

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(251, 250, 246, ${0.13 * (1 - distance / 150)})`;
        ctx.lineWidth = 1;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.fillStyle = node.color;
    ctx.globalAlpha = 0.88;
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  animationFrame = requestAnimationFrame(drawScene);
}

function saveWaitlistEntryLocally(data) {
  const currentEntries = JSON.parse(localStorage.getItem("dueslyWaitlist") || "[]");
  currentEntries.push({
    ...data,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem("dueslyWaitlist", JSON.stringify(currentEntries));
}

async function submitWaitlistEntry(data) {
  if (!waitlistEndpoint) {
    saveWaitlistEntryLocally(data);
    return;
  }

  const response = await fetch(waitlistEndpoint, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Waitlist submission failed");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector("button[type='submit']");
  const formData = new FormData(form);
  const data = {
    ...Object.fromEntries(formData.entries()),
    source: "auniro-site",
    createdAt: new Date().toISOString(),
  };

  submitButton.disabled = true;
  statusEl.textContent = "Adding you to the waitlist...";

  try {
    await submitWaitlistEntry(data);
    form.reset();
    statusEl.textContent = "You are on the list. We will be in touch soon.";
  } catch {
    saveWaitlistEntryLocally(data);
    statusEl.textContent = "Saved locally for now. Add a waitlist endpoint before launch.";
  } finally {
    submitButton.disabled = false;
  }
});

window.addEventListener("resize", resizeScene);
resizeScene();
drawScene();

window.addEventListener("beforeunload", () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
