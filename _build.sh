#!/bin/bash
set -e

# Install dependencies with bun
bun install

# Build the project
bun run build

