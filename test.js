import assert from "node:assert/strict";
import { analyzeSoftYesOrNo } from "./src/index.js";

const clearYes = analyzeSoftYesOrNo(
  "Sounds good. I can do Tuesday at 4 or Wednesday at 6. Send me the one you want to lock.",
  { priorPings: 0, hoursSinceReply: 4 }
);
assert.equal(clearYes.posture, "clear-yes");
assert.equal(clearYes.decision.action, "lock a time");
assert.ok(clearYes.metrics.specificity >= 6);

const askClarifier = analyzeSoftYesOrNo(
  "I'd love to. Next week could work for me.",
  { priorPings: 0, hoursSinceReply: 12 }
);
assert.equal(askClarifier.posture, "soft-yes");
assert.equal(askClarifier.decision.action, "ask one clarifier");
assert.ok(askClarifier.metrics.enthusiasm >= 3.5);

const waitForThem = analyzeSoftYesOrNo(
  "Yeah, maybe sometime after things calm down. Crazy week here.",
  { priorPings: 1, hoursSinceReply: 40 }
);
assert.equal(waitForThem.posture, "polite-maybe");
assert.equal(waitForThem.decision.action, "wait for them to move");
assert.ok(waitForThem.metrics.hedging >= 5);

const treatAsNo = analyzeSoftYesOrNo(
  "I'd love to in theory, but I am slammed and not sure when I'd have the bandwidth. Keep me posted next month.",
  { priorPings: 2, hoursSinceReply: 96 }
);
assert.equal(treatAsNo.posture, "soft-no");
assert.equal(treatAsNo.decision.action, "treat as a no");
assert.ok(treatAsNo.metrics.avoidance >= 6);

console.log("soft-yes-or-no tests passed");
