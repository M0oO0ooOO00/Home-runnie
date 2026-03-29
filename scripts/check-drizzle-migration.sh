#!/usr/bin/env sh

set -eu

MODE="${1:-staged}"
DIFF_RANGE="${MIGRATION_DIFF_RANGE:-}"

if [ "$MODE" = "staged" ]; then
  CHANGED_FILES="$(git diff --name-only --cached --)"
else
  if [ -n "$DIFF_RANGE" ] && ! printf '%s' "$DIFF_RANGE" | grep -q '^0\{40\}\.\.\.'; then
    CHANGED_FILES="$(git diff --name-only "$DIFF_RANGE" --)"
  else
    CHANGED_FILES="$(git diff --name-only HEAD~1 --)"
  fi
fi

SCHEMA_CHANGED="$(printf '%s\n' "$CHANGED_FILES" | grep -E '^apps/backend/src/.*\.entity\.ts$' || true)"
MIGRATION_CHANGED="$(printf '%s\n' "$CHANGED_FILES" | grep -E '^apps/backend/drizzle/migrations/' || true)"

if [ -n "$SCHEMA_CHANGED" ] && [ -z "$MIGRATION_CHANGED" ]; then
  echo ""
  echo "[Drizzle] Schema changed but no migration file is included."
  echo "[Drizzle] Run: pnpm --filter @homerunnie/backend run db:generate"
  echo "[Drizzle] Then stage generated files under apps/backend/drizzle/migrations."
  exit 1
fi

echo "[Drizzle] Migration guard passed."
