#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="${1:-/root/voiddo-ops/drops/soft-yes-or-no-compare-acquisition-20260514}"
LIVE_DIR="/var/www/tells.voiddo.com/soft-yes-or-no"
SPA_LIVE_DIR="/var/www/tells.voiddo.com/frontend/dist/soft-yes-or-no"

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR/src"

cp "$ROOT_DIR/site/index.html" "$TARGET_DIR/index.html"
cp "$ROOT_DIR/site/compare-chatgpt-gemini.html" "$TARGET_DIR/compare-chatgpt-gemini.html"
cp "$ROOT_DIR/site/styles.css" "$TARGET_DIR/styles.css"
cp "$ROOT_DIR/site/app.js" "$TARGET_DIR/app.js"
cp "$ROOT_DIR/src/index.js" "$TARGET_DIR/src/index.js"
cp "$ROOT_DIR/README.md" "$TARGET_DIR/README.md"
cp "$ROOT_DIR/compare-chatgpt-gemini.md" "$TARGET_DIR/compare-chatgpt-gemini.md"

cat > "$TARGET_DIR/verify-pack.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

sha256sum -c SHA256SUMS

grep -q "compare vs ChatGPT/Gemini" index.html
grep -q "soft-yes-or-no vs ChatGPT or Gemini" compare-chatgpt-gemini.html
grep -q "warm maybe" compare-chatgpt-gemini.html
grep -q "open Deep Dive" compare-chatgpt-gemini.html

printf 'soft-yes-or-no compare acquisition pack checks passed\n'
EOF

chmod +x "$TARGET_DIR/verify-pack.sh"

cat > "$TARGET_DIR/README-DROP.md" <<'EOF'
# soft-yes-or-no compare acquisition pack

Purpose: add a higher-intent buyer-facing comparison surface for users deciding whether they need
this deterministic warm-maybe checker or a broader AI assistant.

Contents:

- stronger repo/package discovery copy
- dedicated compare page for `soft-yes-or-no vs ChatGPT/Gemini`
- direct CTA path into the free checker, `Deep Dive`, and the wider `signal toolkit`

Verification:

```bash
./verify-pack.sh
```

Live follow-through when the tells webroot is writable:

```bash
./deploy-live.sh
```
EOF

cat > "$TARGET_DIR/deploy-live.sh" <<EOF
#!/usr/bin/env bash
set -euo pipefail

LIVE_DIR="${LIVE_DIR}"
SPA_LIVE_DIR="${SPA_LIVE_DIR}"
SOURCE_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "\$LIVE_DIR/src"
mkdir -p "\$SPA_LIVE_DIR/src"
cp "\$SOURCE_DIR/index.html" "\$LIVE_DIR/index.html"
cp "\$SOURCE_DIR/compare-chatgpt-gemini.html" "\$LIVE_DIR/compare-chatgpt-gemini.html"
cp "\$SOURCE_DIR/styles.css" "\$LIVE_DIR/styles.css"
cp "\$SOURCE_DIR/app.js" "\$LIVE_DIR/app.js"
cp "\$SOURCE_DIR/src/index.js" "\$LIVE_DIR/src/index.js"
cp "\$SOURCE_DIR/index.html" "\$SPA_LIVE_DIR/index.html"
cp "\$SOURCE_DIR/compare-chatgpt-gemini.html" "\$SPA_LIVE_DIR/compare-chatgpt-gemini.html"
cp "\$SOURCE_DIR/styles.css" "\$SPA_LIVE_DIR/styles.css"
cp "\$SOURCE_DIR/app.js" "\$SPA_LIVE_DIR/app.js"
cp "\$SOURCE_DIR/src/index.js" "\$SPA_LIVE_DIR/src/index.js"

printf 'deployed soft-yes-or-no bundle to %s and %s\n' "\$LIVE_DIR" "\$SPA_LIVE_DIR"
EOF

chmod +x "$TARGET_DIR/deploy-live.sh"

(
  cd "$TARGET_DIR"
  sha256sum index.html compare-chatgpt-gemini.html styles.css app.js src/index.js README.md compare-chatgpt-gemini.md deploy-live.sh verify-pack.sh README-DROP.md > SHA256SUMS
)

printf 'staged soft-yes-or-no site into %s\n' "$TARGET_DIR"
