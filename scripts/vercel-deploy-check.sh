#!/usr/bin/env bash
set -e

echo "Vercel Deployment Check"

# Fallback für Branch-Erkennung
BRANCH=${VERCEL_GIT_BRANCH:-$VERCEL_GIT_COMMIT_REF}

echo "Aktueller Branch: ${BRANCH}"

if [ "$BRANCH" = "development" ] || [ "$BRANCH" = "preproduction" ] || [ "$BRANCH" = "main" ]; then
  echo "✅ Deployment allowed for branch '${BRANCH}'."
  exit 0
fi

echo "🛑 Deployment blocked for branch '${BRANCH}'."
exit 1
