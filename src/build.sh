#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

{
  cat src/head.html
  cat src/body.html
  echo ""

  for f in src/js/*.js; do
    echo "// === $(basename "$f") ==="
    cat "$f"
    echo ""
  done

  cat src/tail.html
} > index.html

echo "Built index.html ($(wc -l < index.html) lines)"
