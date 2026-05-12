#!/usr/bin/env bash
set -e

echo "Vercel Deployment Check"

# Fallback für Branch-Erkennung
BRANCH=${VERCEL_GIT_BRANCH:-$VERCEL_GIT_COMMIT_REF}

echo "Aktueller Branch: ${BRANCH}"

if [ "$BRANCH" = "development" ] || [ "$BRANCH" = "preproduction" ] || [ "$BRANCH" = "main" ]; then
  echo "✅ Deployment erlaubt für Branch '${BRANCH}'."
  exit 1
fi

echo "🛑 Deployment für Branch '${BRANCH}' wird blockiert."
exit 0
