const ENTHUSIASM_PHRASES = [
  "sounds good",
  "that works",
  "works for me",
  "would love to",
  "i'd love to",
  "happy to",
  "definitely",
  "let's do it",
  "lets do it",
  "interested",
  "excited",
  "keen to",
  "down for"
];

const SPECIFIC_PHRASES = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "tomorrow",
  "next tuesday",
  "after 6",
  "at 3",
  "at 4",
  "at 5",
  "at 6",
  "calendar",
  "calendly",
  "send me two times",
  "here's my availability",
  "here is my availability",
  "i can do",
  "i can make",
  "free on"
];

const INITIATIVE_PHRASES = [
  "send me your calendar",
  "here's my calendar",
  "here is my calendar",
  "pick a time",
  "send two times",
  "what works for you",
  "i can do",
  "i can make",
  "i'm free",
  "i am free",
  "let me know which time",
  "book a slot",
  "choose a time"
];

const HEDGE_PHRASES = [
  "maybe",
  "might",
  "hopefully",
  "should",
  "probably",
  "sometime",
  "we'll see",
  "we will see",
  "could be",
  "kind of",
  "sort of"
];

const DELAY_PHRASES = [
  "later",
  "next week",
  "next month",
  "after the launch",
  "after things calm down",
  "once things settle",
  "down the line",
  "circle back",
  "touch base later",
  "sometime soon",
  "eventually"
];

const AVOIDANCE_PHRASES = [
  "crazy week",
  "super busy",
  "slammed",
  "hard to commit",
  "not sure yet",
  "can't promise",
  "cannot promise",
  "keep you posted",
  "keep me posted",
  "let me get back to you",
  "reach out later",
  "too much right now",
  "buried right now"
];

const NO_PHRASES = [
  "not a fit",
  "going to pass",
  "i'll pass",
  "ill pass",
  "not in a place",
  "not ready",
  "no thanks",
  "can't commit",
  "cannot commit",
  "best of luck",
  "take care",
  "leave it there",
  "leave it here"
];

function clamp(value, min = 0, max = 10) {
  return Math.max(min, Math.min(max, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function countMatches(text, phrases) {
  return phrases.reduce((count, phrase) => {
    let hits = 0;
    let start = 0;
    while (start < text.length) {
      const index = text.indexOf(phrase, start);
      if (index === -1) {
        break;
      }
      hits += 1;
      start = index + phrase.length;
    }
    return count + hits;
  }, 0);
}

function countRegexMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function buildDecision(metrics, counters) {
  const reasons = [];
  let action = "wait for them to move";
  let summary =
    "The reply sounds warm enough to avoid forcing a hard no, but not concrete enough to justify more chasing from your side.";

  if (metrics.noSignal >= 6.5 || (metrics.avoidance >= 7 && counters.priorPings >= 2)) {
    action = "treat as a no";
    summary =
      "This is carrying more polite exit energy than forward movement. More effort from you is unlikely to turn it into a real yes.";
    reasons.push("Avoidance and no-signal language are outweighing real momentum.");
  } else if (
    metrics.specificity >= 7 &&
    metrics.initiative >= 6 &&
    metrics.hedging <= 4.6 &&
    metrics.avoidance < 5.5
  ) {
    action = "lock a time";
    summary =
      "The message is positive and concrete enough to stop interpreting and move directly into scheduling.";
    reasons.push("There is enough specificity and initiative to close the loop now.");
  } else if (
    metrics.enthusiasm >= 3.5 &&
    metrics.avoidance < 6 &&
    metrics.noSignal < 5.5 &&
    counters.priorPings <= 1
  ) {
    action = "ask one clarifier";
    summary =
      "The tone is still open, but the logistics are missing. One clean clarifier is justified; anything beyond that becomes unnecessary pursuit.";
    reasons.push("Positive tone is doing some real work, but the next step is still abstract.");
  }

  if (metrics.hedging >= 5.8) {
    reasons.push("Hedging language is keeping the door open without actually moving through it.");
  }
  if (metrics.delay >= 5.8) {
    reasons.push("Delay language is stronger than commitment language.");
  }
  if (metrics.specificity < 5) {
    reasons.push("No actual time, slot, or owner is carrying the next step yet.");
  }

  return {
    action,
    summary,
    reasons: [...new Set(reasons)].slice(0, 3)
  };
}

function buildPrompts(action) {
  if (action === "lock a time") {
    return [
      "Great. I can do Tuesday at 4 or Wednesday at 6. Pick whichever works.",
      "Perfect. Send the slot you want to lock and I’ll confirm."
    ];
  }
  if (action === "ask one clarifier") {
    return [
      "Sounds good. What exact day works best for you?",
      "Happy to do it. Send one concrete time that actually works on your side."
    ];
  }
  if (action === "treat as a no") {
    return [
      "Understood. I’ll leave it there.",
      "No problem. If that changes later, you can reopen it from your side."
    ];
  }
  return [
    "Leave the next move with them instead of manufacturing momentum for the thread.",
    "Do not convert a warm maybe into your second or third scheduling rescue."
  ];
}

export function analyzeSoftYesOrNo(input, options = {}) {
  const text = String(input || "").trim();
  if (!text) {
    throw new Error("soft-yes-or-no needs reply text");
  }

  const hoursSinceReply = Number(options.hoursSinceReply ?? options.hours_since_reply ?? 24);
  const priorPings = Number(options.priorPings ?? options.prior_pings ?? 0);
  if (!Number.isFinite(hoursSinceReply) || hoursSinceReply < 0) {
    throw new Error("hoursSinceReply must be a non-negative number");
  }
  if (!Number.isFinite(priorPings) || priorPings < 0) {
    throw new Error("priorPings must be a non-negative number");
  }

  const lower = text.toLowerCase();
  const exclamations = (text.match(/!/g) || []).length;
  const questionMarks = (text.match(/\?/g) || []).length;
  const dayOrTimeHits =
    countRegexMatches(lower, /\b(?:mon|tues|wednes|thurs|fri|satur|sun)day\b/g) +
    countRegexMatches(lower, /\b\d{1,2}(?::\d{2})?\s?(?:am|pm)?\b/g);

  const enthusiasmHits = countMatches(lower, ENTHUSIASM_PHRASES);
  const specificHits = countMatches(lower, SPECIFIC_PHRASES) + dayOrTimeHits;
  const initiativeHits = countMatches(lower, INITIATIVE_PHRASES);
  const hedgeHits = countMatches(lower, HEDGE_PHRASES);
  const delayHits = countMatches(lower, DELAY_PHRASES);
  const avoidanceHits = countMatches(lower, AVOIDANCE_PHRASES);
  const noHits = countMatches(lower, NO_PHRASES);

  const enthusiasm = clamp(
    2 + enthusiasmHits * 1.7 + exclamations * 0.2 - hedgeHits * 0.35 - noHits * 1.2
  );
  const specificity = clamp(
    2 + specificHits * 1.15 + initiativeHits * 0.55 - hedgeHits * 0.35 - delayHits * 0.4
  );
  const initiative = clamp(
    2 + initiativeHits * 2 + specificHits * 0.35 - avoidanceHits * 0.45 - priorPings * 0.7
  );
  const hedging = clamp(2 + hedgeHits * 1.6 + questionMarks * 0.2 - specificHits * 0.2);
  const delay = clamp(
    2 +
      delayHits * 1.8 +
      avoidanceHits * 0.8 +
      Math.max(0, hoursSinceReply - 72) / 36 -
      specificHits * 0.2
  );
  const avoidance = clamp(
    1 + avoidanceHits * 1.8 + delayHits * 0.5 + priorPings * 1.1 - initiativeHits * 0.4
  );
  const noSignal = clamp(1 + noHits * 3.2 + avoidanceHits * 0.6 + delayHits * 0.35);

  const metrics = {
    enthusiasm: round1(enthusiasm),
    specificity: round1(specificity),
    initiative: round1(initiative),
    hedging: round1(hedging),
    delay: round1(delay),
    avoidance: round1(avoidance),
    noSignal: round1(noSignal)
  };

  let posture = "polite-maybe";
  if (metrics.noSignal >= 6.5 || (metrics.avoidance >= 7 && priorPings >= 2)) {
    posture = "soft-no";
  } else if (
    metrics.specificity >= 7 &&
    metrics.initiative >= 6 &&
    metrics.hedging <= 4.6 &&
    metrics.avoidance < 5.5
  ) {
    posture = "clear-yes";
  } else if (metrics.enthusiasm >= 3.5 && metrics.delay < 5.8 && metrics.avoidance < 6) {
    posture = "soft-yes";
  }

  const decision = buildDecision(metrics, { priorPings });
  return {
    posture,
    metrics,
    decision,
    prompts: buildPrompts(decision.action),
    counters: {
      hoursSinceReply,
      priorPings,
      questionMarks
    }
  };
}

function buildSiblingExit(posture) {
  const base = "https://tells.voiddo.com";
  const r = "?ref=soft-yes-or-no-cli";
  const lines = ["next:"];
  if (posture === "soft-no") {
    lines.push(
      `- score your follow-up before sending: ${base}/double-text-risk/${r}`,
      `- check the full next move: ${base}/message-next-step/${r}`
    );
  } else if (posture === "polite-maybe") {
    lines.push(
      `- if this keeps becoming another reschedule: ${base}/raincheck-or-run/${r}`,
      `- if the reply is mixed in more ways than warmth alone: ${base}/ambiguity-meter/${r}`
    );
  } else if (posture === "soft-yes") {
    lines.push(
      `- when the thread needs a real conversation instead: ${base}/call-not-text/${r}`,
      `- to draft the clarifier cleanly: ${base}/replytone/${r}`
    );
  } else {
    lines.push(
      `- to send the right message now: ${base}/replytone/${r}`,
      `- for the full next move: ${base}/message-next-step/${r}`
    );
  }
  lines.push(
    `- upgrade for recurring patterns: ${base}/deep-dive/${r}`,
    `- ChatGPT/Gemini compare: ${base}/soft-yes-or-no/compare-chatgpt-gemini.html?ref=soft-yes-or-no-cli-compare`
  );
  return lines;
}

export function formatReport(result) {
  const lines = [
    `posture: ${result.posture}`,
    `enthusiasm: ${result.metrics.enthusiasm}/10`,
    `specificity: ${result.metrics.specificity}/10`,
    `initiative:  ${result.metrics.initiative}/10`,
    `hedging:     ${result.metrics.hedging}/10`,
    `delay:       ${result.metrics.delay}/10`,
    `avoidance:   ${result.metrics.avoidance}/10`,
    `no signal:   ${result.metrics.noSignal}/10`,
    "",
    `action: ${result.decision.action}`,
    `why: ${result.decision.summary}`
  ];

  if (result.decision.reasons.length) {
    lines.push("", "reasons:");
    for (const reason of result.decision.reasons) {
      lines.push(`- ${reason}`);
    }
  }

  if (result.prompts.length) {
    lines.push("", "prompt ideas:");
    for (const prompt of result.prompts) {
      lines.push(`- ${prompt}`);
    }
  }

  lines.push("", ...buildSiblingExit(result.posture));

  return lines.join("\n");
}
