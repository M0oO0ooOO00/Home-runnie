#!/bin/sh
set -e

echo "Running database migration (drizzle-kit push)..."
pnpm db:push

echo "Starting application..."
exec node dist/main
