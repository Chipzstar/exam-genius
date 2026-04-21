#!/usr/bin/env bash
# Sync modular Prisma schema files from exam-genius (canonical) to exam-genius-backend.
# Does not copy base.prisma — each repo keeps its own generator block (output path differs).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_ROOT="$(cd "$FRONTEND_ROOT/../exam-genius-backend" && pwd)"

if [[ ! -d "$BACKEND_ROOT/prisma/schemas" ]]; then
	echo "error: backend prisma/schemas not found at $BACKEND_ROOT/prisma/schemas" >&2
	exit 1
fi

# Copy all schema fragments except base.prisma (generator/datasource differ per repo)
for f in "$FRONTEND_ROOT"/prisma/schemas/*.prisma; do
	base="$(basename "$f")"
	if [[ "$base" == "base.prisma" ]]; then
		continue
	fi
	cp "$f" "$BACKEND_ROOT/prisma/schemas/$base"
done

echo "Synced prisma/schemas from $FRONTEND_ROOT to $BACKEND_ROOT (skipped base.prisma)"
