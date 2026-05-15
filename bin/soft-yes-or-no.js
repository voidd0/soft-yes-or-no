#!/usr/bin/env node

import fs from "node:fs";
import { analyzeSoftYesOrNo, formatReport } from "../src/index.js";

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
  });
}

function printHelp() {
  console.log(`soft-yes-or-no

Usage:
  soft-yes-or-no "Sounds good. Next week could work once things settle down."
  soft-yes-or-no --prior-pings 1 --hours-since-reply 36 "I'd love to. Circle back with me next week?"
  cat reply.txt | soft-yes-or-no --prior-pings 2
  soft-yes-or-no --file reply.txt --prior-pings 2 --json
`);
}

async function main() {
  const args = process.argv.slice(2);
  let json = false;
  let file = null;
  let hoursSinceReply = 24;
  let priorPings = 0;
  const messageParts = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      printHelp();
      return;
    }
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg === "--file") {
      file = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--hours-since-reply") {
      hoursSinceReply = Number(args[i + 1]);
      i += 1;
      continue;
    }
    if (arg === "--prior-pings") {
      priorPings = Number(args[i + 1]);
      i += 1;
      continue;
    }
    messageParts.push(arg);
  }

  let input = "";

  if (file) {
    input = fs.readFileSync(file, "utf8");
  } else if (messageParts.length) {
    input = messageParts.join(" ");
  } else if (!process.stdin.isTTY) {
    input = await readStdin();
  }

  if (!String(input || "").trim()) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  const result = analyzeSoftYesOrNo(input, { hoursSinceReply, priorPings });
  if (json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(formatReport(result));
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exitCode = 1;
});
