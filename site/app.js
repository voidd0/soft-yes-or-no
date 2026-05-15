import { analyzeSoftYesOrNo } from "./src/index.js";

const examples = {
  recruiter: {
    text:
      "I'd love to. The hiring team is slammed this week, so maybe sometime next month once calendars calm down.",
    hoursSinceReply: 36,
    priorPings: 1,
    note: "Warm interest is present, but the actual owner and slot are still missing."
  },
  dating: {
    text:
      "You seem great. This week is wild though. Maybe later once things settle? I'll let you know.",
    hoursSinceReply: 52,
    priorPings: 2,
    note: "The tone stays open while delay and avoidance do most of the practical work."
  },
  client: {
    text:
      "Sounds good. I can do Tuesday at 4 or Wednesday at 6. Send the one you want to lock.",
    hoursSinceReply: 4,
    priorPings: 0,
    note: "Specificity and initiative are finally strong enough to stop interpreting and close the loop."
  }
};

const input = document.querySelector("#reply-input");
const hoursInput = document.querySelector("#hours-input");
const pingsInput = document.querySelector("#pings-input");
const analyzeButton = document.querySelector("#analyze-button");
const clearButton = document.querySelector("#clear-button");
const verdictChip = document.querySelector("#verdict-chip");
const postureChip = document.querySelector("#posture-chip");
const summaryLine = document.querySelector("#summary-line");
const counterLine = document.querySelector("#counter-line");
const whyList = document.querySelector("#why-list");
const signalGrid = document.querySelector("#signal-grid");
const promptsList = document.querySelector("#prompts-list");
const exampleCard = document.querySelector("#example-card");
const exampleTabs = [...document.querySelectorAll(".example-tab")];

function stateForSignal(name, value) {
  if (name === "enthusiasm" || name === "specificity" || name === "initiative") {
    return value >= 5.8 ? "good" : "warn";
  }
  return value >= 5.6 ? "warn" : "good";
}

function renderSignals(result) {
  signalGrid.innerHTML = "";
  const cards = [
    ["enthusiasm", result.metrics.enthusiasm],
    ["specificity", result.metrics.specificity],
    ["initiative", result.metrics.initiative],
    ["hedging", result.metrics.hedging],
    ["delay", result.metrics.delay],
    ["avoidance", result.metrics.avoidance],
    ["no signal", result.metrics.noSignal]
  ];

  cards.forEach(([name, value]) => {
    const card = document.createElement("article");
    card.className = `meter-card ${stateForSignal(name, value)}`;
    card.innerHTML = `
      <div class="meter-top">
        <span>${name}</span>
        <span>${value.toFixed(1)}/10</span>
      </div>
      <div class="meter-track" aria-hidden="true">
        <div class="meter-fill" style="width:${Math.max(4, value * 10)}%"></div>
      </div>
    `;
    signalGrid.append(card);
  });
}

function renderResult(text = input.value, hours = hoursInput.value, pings = pingsInput.value) {
  const reply = String(text || "").trim();
  const hoursSinceReply = Number(hours);
  const priorPings = Number(pings);

  if (!reply) {
    verdictChip.textContent = "paste a reply";
    postureChip.textContent = "waiting";
    summaryLine.textContent =
      "Use one real incoming reply to see whether it is a clear yes, a warm maybe, or a polite exit.";
    counterLine.textContent = `0 words · ${hoursSinceReply || 0}h · ${priorPings || 0} prior ping`;
    whyList.innerHTML = "<li>Paste one reply to get a deterministic warm-maybe read.</li>";
    promptsList.innerHTML =
      "<li>This checker is narrow on purpose. It scores one reply, not the whole relationship or pipeline.</li>";
    signalGrid.innerHTML = "";
    return null;
  }

  const result = analyzeSoftYesOrNo(reply, { hoursSinceReply, priorPings });
  const wordCount = reply.split(/\s+/).filter(Boolean).length;

  verdictChip.textContent = result.decision.action;
  postureChip.textContent = result.posture;
  summaryLine.textContent = result.decision.summary;
  counterLine.textContent = `${wordCount} words · ${result.counters.hoursSinceReply}h · ${result.counters.priorPings} prior ping`;

  whyList.innerHTML = "";
  result.decision.reasons.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    whyList.append(item);
  });

  promptsList.innerHTML = "";
  result.prompts.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    promptsList.append(item);
  });

  const paidMove = document.createElement("li");
  paidMove.textContent =
    "If this warm maybe is one slice of a bigger repeating pattern, move into tells Deep Dive for the fuller read.";
  promptsList.append(paidMove);

  const recurringMove = document.createElement("li");
  recurringMove.textContent =
    "If this happens across recruiters, prospects, clients, support loops, dates, or family threads, stop solving it one message at a time and use tells Starter or Practitioner.";
  promptsList.append(recurringMove);

  renderSignals(result);
  return result;
}

function setExample(name) {
  const example = examples[name];
  input.value = example.text;
  hoursInput.value = String(example.hoursSinceReply);
  pingsInput.value = String(example.priorPings);
  const result = renderResult(example.text, example.hoursSinceReply, example.priorPings);

  exampleTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.example === name);
  });

  exampleCard.innerHTML = `
    <div>
      <p class="eyebrow">${name} example</p>
      <p class="example-copy">${example.text}</p>
    </div>
    <div class="example-side">
      <p class="verdict-chip">${result.decision.action}</p>
      <div class="example-metrics">
        <span class="example-signal">posture ${result.posture}</span>
        <span class="example-signal">specificity ${result.metrics.specificity}</span>
        <span class="example-signal">delay ${result.metrics.delay}</span>
        <span class="example-signal">avoidance ${result.metrics.avoidance}</span>
      </div>
      <p class="example-copy">${example.note}</p>
    </div>
  `;
}

analyzeButton.addEventListener("click", () => renderResult());
clearButton.addEventListener("click", () => {
  input.value = "";
  renderResult("", hoursInput.value, pingsInput.value);
  input.focus();
});

input.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    renderResult();
  }
});

hoursInput.addEventListener("change", () => renderResult());
pingsInput.addEventListener("change", () => renderResult());
exampleTabs.forEach((tab) => {
  tab.addEventListener("click", () => setExample(tab.dataset.example));
});

setExample("recruiter");
