#!/usr/bin/env bash

set -e

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "[INFO] Starting development environment setup..."
echo "[INFO] Project root: $PROJECT_ROOT"
echo "[INFO] Starting development environment setup..."

########################################
# 🔍 Safety Check — node & npm
########################################

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is not installed. Please install Node.js first."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[ERROR] npm is not installed. Please install npm first."
  exit 1
fi

echo "[INFO] Node and npm are available."

########################################
# 📦 Function to install deps smartly
########################################

install_if_needed() {
  local dir=$1

  if [ ! -d "$dir" ]; then
    echo "[WARNING] Directory '$dir' not found. Skipping..."
    return
  fi

  echo "[INFO] Checking dependencies in $dir..."

  cd "$dir"

  if [ -d "node_modules" ]; then
    echo "[INFO] Skipping install in $dir (node_modules exists)."
  else
    echo "[INFO] Installing dependencies in $dir..."
    npm install
    echo "[INFO] Install complete in $dir."
  fi

  cd - >/dev/null
}

########################################
# 🚀 Run for backend & frontend
########################################

install_if_needed "$PROJECT_ROOT/server"
install_if_needed "$PROJECT_ROOT/client"

echo "[INFO] Development setup complete."
