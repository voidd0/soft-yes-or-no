# soft-yes-or-no

[![License: MIT](https://img.shields.io/badge/license-MIT-0F172A.svg)](LICENSE)
[![Node ≥18](https://img.shields.io/badge/node-%E2%89%A518-0F172A)](package.json)

**[Web app](https://tells.voiddo.com/soft-yes-or-no/?ref=soft-yes-or-no-readme)** · **[Live compare page](https://tells.voiddo.com/soft-yes-or-no/compare-chatgpt-gemini.html?ref=soft-yes-or-no-readme)** · **[Packaged compare brief](compare-chatgpt-gemini.md)** · **[Deep Dive](https://tells.voiddo.com/deep-dive/?ref=soft-yes-or-no-readme)** · **[Signal toolkit](https://tells.voiddo.com/signal-toolkit/?ref=soft-yes-or-no-readme)** · **[GitHub](https://github.com/voidd0/soft-yes-or-no)** · **[npm](https://www.npmjs.com/package/@v0idd0/soft-yes-or-no)** · **[All tools](https://tools.voiddo.com/?ref=soft-yes-or-no-catalog-readme)** · **[Contact](mailto:support@voiddo.com)**

---

`soft-yes-or-no` answers one narrow question:

## What it does

> This reply sounds positive. Is it actually moving, or am I about to chase a warm maybe that never becomes a real yes?

It scores:

- enthusiasm
- specificity
- initiative
- hedging
- delay
- avoidance
- no signal

Then it recommends one action:

- `lock a time`
- `ask one clarifier`
- `wait for them to move`
- `treat as a no`

The paid product is [`tells`](https://tells.voiddo.com/?ref=soft-yes-or-no-readme), which reads what people leave unsaid across messages, people, and profiles.

This package is the zero-cost front door for one common high-friction moment:

- a prospect says the idea sounds good but never carries the calendar
- a recruiter sounds warm but keeps the next step abstract
- a date reply is positive in tone and empty in logistics
- a client says they are interested but keeps punting commitment
- a support or partner thread stays friendly while avoiding an owner
- a cofounder, teammate, or family member sounds agreeable while quietly declining movement

`soft-yes-or-no` is the deterministic first pass for that moment.

If the reply is only one piece of the pattern, the rest of the free checker ladder is:

- `message-next-step` for the broader "what do I do with this reply?" question
- `ambiguity-meter` for mixed-signal incoming messages
- `double-text-risk` for the follow-up you want to send next
- `raincheck-or-run` for warm replies that keep rescheduling without locking anything
- `call-not-text` when the thread sounds positive but clearly needs a real conversation, not another vague message
- `replytone` for the wording of your clarifier or close-the-loop message

## Install

```bash
npm install -g @v0idd0/soft-yes-or-no
```

## Browser-first free path

If you want to use `soft-yes-or-no` in the browser before installing the CLI, use the live route here:

```text
https://tells.voiddo.com/soft-yes-or-no/?ref=soft-yes-or-no-readme
```

If the user is deciding between this deterministic checker and a general assistant first, send them here:

```text
https://tells.voiddo.com/soft-yes-or-no/compare-chatgpt-gemini.html?ref=soft-yes-or-no-readme
```

If you want the packaged npm/GitHub collateral for that buyer-intent comparison, use:

```text
./compare-chatgpt-gemini.md
```

If the user needs the wider browser-first cluster around it, the shared `tells` toolkit is here:

```text
https://tells.voiddo.com/signal-toolkit/?ref=soft-yes-or-no-readme
```

If you want one adjacent free check before buying deeper analysis:

- `message-next-step` for the broader "what should I do with this reply?" call: `https://tells.voiddo.com/message-next-step/?ref=soft-yes-or-no-readme`
- `ambiguity-meter` for scoring the incoming reply's mixed signals more directly: `https://tells.voiddo.com/ambiguity-meter/?ref=soft-yes-or-no-readme`
- `double-text-risk` for the follow-up you want to send next: `https://tells.voiddo.com/double-text-risk/?ref=soft-yes-or-no-readme`
- `raincheck-or-run` for soft yeses that keep turning into moving-target scheduling: `https://tells.voiddo.com/raincheck-or-run/?ref=soft-yes-or-no-readme`
- `call-not-text` when the real next move is getting off text and onto a call: `https://tells.voiddo.com/call-not-text/?ref=soft-yes-or-no-readme`
- `replytone` for the exact clarifier or close-the-loop wording you want to send: `https://tells.voiddo.com/replytone/?ref=soft-yes-or-no-readme`

## CLI

```bash
soft-yes-or-no "Sounds good. I can do Tuesday at 4 or Wednesday at 6. Send me the one you want to lock."
```

```bash
cat reply.txt | soft-yes-or-no --prior-pings 1
```

```bash
soft-yes-or-no --json --hours-since-reply 72 --prior-pings 2 "I'd love to, just a crazy week. Maybe sometime next month."
```

```bash
soft-yes-or-no --file reply.txt --prior-pings 2
```

Example output:

```text
posture: polite-maybe
enthusiasm: 5.6/10
specificity: 3.8/10
initiative:  3.4/10
hedging:     5.2/10
delay:       6.7/10
avoidance:   5.4/10
no signal:   3.1/10

action: wait for them to move
why: The reply sounds warm enough to avoid forcing a hard no, but not concrete enough to justify more chasing from your side.
```

Use tells when the real question is no longer one warm maybe, but the wider recurring pattern with this person, prospect, recruiter, client, support thread, or family dynamic.
- quick next paid step: https://tells.voiddo.com/deep-dive/?ref=soft-yes-or-no-cli
- recurring reads: https://tells.voiddo.com/?ref=soft-yes-or-no-cli

## How the heuristic thinks

- `enthusiasm` — does the reply contain real positive energy, or only polite noise?
- `specificity` — is there an actual day, time, slot, or concrete next move?
- `initiative` — are they carrying any of the scheduling or decision burden?
- `hedging` — how much uncertainty language is keeping the door open without committing?
- `delay` — how much of the reply pushes movement into an abstract future?
- `avoidance` — does this sound like stall management rather than forward motion?
- `no signal` — does the language quietly function as a polite decline?

This tool is narrow on purpose. It does not know:

- the full history between you
- whether the person is sincere but overwhelmed
- whether the opportunity is worth extra patience
- whether a soft yes is enough in your exact context

Those are outside this tool's scope. If the stakes are real and the reply is part of a bigger pattern, use `tells`.

## Why this exists

Warm replies are expensive because they make people do optimism math.

People hear:

- "sounds good"
- "would love to"
- "next week maybe"
- "circle back with me"

and then they manufacture a second or third rescue follow-up.

That can be right once. It becomes costly when:

- the reply sounds interested but never names a slot
- the other person keeps the tone warm and the logistics empty
- every "yes" is followed by delay language
- the thread stays pleasant while responsibility stays on your side
- sales, recruiting, client, and support loops turn friendliness into a false positive
- a dating or family thread keeps sounding open without ever getting more concrete

`soft-yes-or-no` forces that moment into a simple decision.

Then, once the problem becomes "what is the real pattern here?", the right upgrade is `tells`.

That applies outside dating too:

- recruiter and hiring loops where interest never turns into the next step
- sales and partnership threads where "sounds good" masks low intent
- client threads that protect tone while avoiding a real commitment
- vendor, support, or account-management conversations that keep deferring ownership
- family, cofounder, or workplace loops where agreement language hides resistance

## Why not just use ChatGPT or Gemini?

You can, but those tools often reward tone more than movement.

`soft-yes-or-no` is narrower on purpose:

- one deterministic read on warm-but-vague replies
- stable scoring for enthusiasm, specificity, initiative, hedging, delay, and avoidance
- fast repeatable output for the same input
- a clean handoff into paid `tells` only when the single-reply heuristic is no longer enough

Comparison page for buyer-intent searches:

```text
https://tells.voiddo.com/soft-yes-or-no/compare-chatgpt-gemini.html?ref=soft-yes-or-no-readme
```

Packaged compare brief for npm/GitHub/package readers:

```text
compare-chatgpt-gemini.md
```

## Compare surface

- live compare page for browser-first "soft-yes-or-no vs ChatGPT / Gemini" traffic: `https://tells.voiddo.com/soft-yes-or-no/compare-chatgpt-gemini.html?ref=soft-yes-or-no-readme`
- packaged compare brief for npm/GitHub readers deciding whether to install: [`compare-chatgpt-gemini.md`](compare-chatgpt-gemini.md)

## Best next free exits

- [`message-next-step`](https://tells.voiddo.com/message-next-step/?ref=soft-yes-or-no-readme) when the real question is the broader next move, not only whether this is a warm maybe
- [`ambiguity-meter`](https://tells.voiddo.com/ambiguity-meter/?ref=soft-yes-or-no-readme) when the incoming reply is mixed, vague, or evasive in several directions at once
- [`double-text-risk`](https://tells.voiddo.com/double-text-risk/?ref=soft-yes-or-no-readme) when you already know you want to follow up and need to score the message before you send it
- [`raincheck-or-run`](https://tells.voiddo.com/raincheck-or-run/?ref=soft-yes-or-no-readme) when a friendly yes keeps becoming another cancellation or vague reschedule
- [`call-not-text`](https://tells.voiddo.com/call-not-text/?ref=soft-yes-or-no-readme) when the warm reply is not the problem anymore and the thread needs a real voice conversation
- [`replytone`](https://tells.voiddo.com/replytone/?ref=soft-yes-or-no-readme) when the next move is wording the clarifier, decline, or one-last-ping text cleanly

## Paid next step

When the quick vague-interest call is not enough:

- `Deep Dive` — `$19 once` for one loaded thread or one recurring person
- `Starter` — `$14.99/mo` for repeated message reading
- `Practitioner` — `$99.99/mo` for coaches, recruiters, mediators, trainers, or client-facing teams using this with clients

Start here:

```text
https://tells.voiddo.com/deep-dive/?ref=soft-yes-or-no-readme
```

If you still want one more free checkpoint before the paid read:

```text
https://tells.voiddo.com/signal-toolkit/?ref=soft-yes-or-no-readme
```

## Library usage

```js
import { analyzeSoftYesOrNo, formatReport } from "@v0idd0/soft-yes-or-no";

const result = analyzeSoftYesOrNo(
  "Sounds good. I can do Tuesday at 4 or Wednesday at 6. Send me the one you want to lock.",
  { priorPings: 0, hoursSinceReply: 4 }
);

console.log(result.decision.action);
console.log(formatReport(result));
```

## Development

```bash
npm test
```

```bash
node bin/soft-yes-or-no.js "I'd love to. Maybe next week once things calm down."
```

## Related free checkers

- [`message-next-step`](https://tells.voiddo.com/message-next-step/?ref=soft-yes-or-no-readme) — decide the broader next move for one incoming message
- [`ambiguity-meter`](https://tells.voiddo.com/ambiguity-meter/?ref=soft-yes-or-no-readme) — measure mixed signals and missing next steps
- [`double-text-risk`](https://tells.voiddo.com/double-text-risk/?ref=soft-yes-or-no-readme) — score the follow-up before you send it
- [`replytone`](https://tells.voiddo.com/replytone/?ref=soft-yes-or-no-readme) — score the wording of your clarifier or close-the-loop reply

## More from the studio

See [`from-the-studio.md`](from-the-studio.md) for the wider vøiddo catalogue.

## License

MIT.

---

Built by [vøiddo](https://voiddo.com/) — a small studio shipping AI-flavoured products, free dev tools, Chrome extensions and weird browser games.
