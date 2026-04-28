#!/bin/bash
set -e

echo "=== Starting CardFlow Backend ==="
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "Current directory: $(pwd)"

cd /app/backend

echo "=== Installing dependencies ==="
npm install --verbose

echo "=== Checking installed packages ==="
npm list express-validator

echo "=== Starting server ==="
npm start