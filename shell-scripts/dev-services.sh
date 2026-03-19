# #!/usr/bin/env bash

# set -e

# ########################################
# # 📍 Resolve paths (location independent)
# ########################################
# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# BACKEND_DIR="$PROJECT_ROOT/server"
# FRONTEND_DIR="$PROJECT_ROOT/client"

# BACKEND_PID_FILE="$PROJECT_ROOT/backend.pid"
# FRONTEND_PID_FILE="$PROJECT_ROOT/frontend.pid"

# ########################################
# # 🩺 Health check for backend
# ########################################
# check_health() {
#   echo "[INFO] Checking backend health..."

#   for i in {1..5}; do
#     if curl -f -s http://localhost:5004/api/health >/dev/null 2>&1; then
#       echo "[OK] Backend is Up!"
#       return 0
#     fi

#     echo "[INFO] Health check attempt $i failed. Retrying in 2s..."
#     sleep 2
#   done

#   echo "[FAIL] Backend died or is not responding."
#   return 1
# }

# ########################################
# # 🚀 START SERVICES (PRODUCTION)
# ########################################
# start_services() {
#   echo "[INFO] Starting production services..."

#   ########################################
#   # ---- Backend ----
#   ########################################
#   if [ -f "$BACKEND_PID_FILE" ]; then
#     echo "[INFO] Backend already running (pid file exists). Skipping."
#   else
#     if [ ! -d "$BACKEND_DIR" ]; then
#       echo "[ERROR] Backend directory not found: $BACKEND_DIR"
#       exit 1
#     fi

#     echo "[INFO] Starting backend (production)..."
#     cd "$BACKEND_DIR"

#     npm install
#     npm start &
#     BACKEND_PID=$!
#     echo "$BACKEND_PID" > "$BACKEND_PID_FILE"
#     echo "[INFO] Backend PID: $BACKEND_PID"

#     if ! check_health; then
#       echo "[ERROR] Backend failed health check. Stopping..."
#       kill "$BACKEND_PID" 2>/dev/null || true
#       rm -f "$BACKEND_PID_FILE"
#       exit 1
#     fi

#     cd "$PROJECT_ROOT"
#   fi

#   echo "[INFO] Production services started."
#   exit 0
# }

# ########################################
# # 🛑 STOP SERVICES
# ########################################
# stop_services() {
#   echo "[INFO] Stopping services..."

#   # ---- Backend ----
#   if [ -f "$BACKEND_PID_FILE" ]; then
#     TARGET_PID=$(cat "$BACKEND_PID_FILE")
#     echo "[INFO] Stopping backend (PID: $TARGET_PID)..."
#     kill "$TARGET_PID" 2>/dev/null || true
#     rm -f "$BACKEND_PID_FILE"
#     echo "[INFO] Backend stopped."
#   else
#     echo "[INFO] No backend PID file found."
#   fi

#   # ---- Frontend ----
#   if [ -f "$FRONTEND_PID_FILE" ]; then
#     TARGET_PID=$(cat "$FRONTEND_PID_FILE")
#     echo "[INFO] Stopping frontend (PID: $TARGET_PID)..."
#     kill "$TARGET_PID" 2>/dev/null || true
#     rm -f "$FRONTEND_PID_FILE"
#     echo "[INFO] Frontend stopped."
#   else
#     echo "[INFO] No frontend PID file found."
#   fi

#   echo "[INFO] Services stopped."
# }

# ########################################
# # 🎯 Command handler
# ########################################
# case "${1:-}" in
#   start)
#     start_services
#     ;;
#   stop)
#     stop_services
#     ;;
#   *)
#     echo "[ERROR] Usage: $0 {start|stop}"
#     exit 1
#     ;;
# esac

#!/usr/bin/env bash

set -e

########################################
# 📍 Config
########################################
PORT=5004

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/server"

########################################
# 🧹 Kill process on port (IDEMPOTENT)
########################################
kill_port() {
  echo "[INFO] Cleaning up port $PORT..."

  PID=$(lsof -ti:$PORT || true)

  if [ -n "$PID" ]; then
    echo "[INFO] Killing process on port $PORT (PID: $PID)"
    kill -9 $PID || true
  else
    echo "[INFO] No process running on port $PORT"
  fi
}

########################################
# 🩺 Health check
########################################
check_health() {
  echo "[INFO] Checking backend health..."

  for i in {1..10}; do
    if curl -f -s http://localhost:$PORT/api/health >/dev/null 2>&1; then
      echo "[OK] Backend is Up!"
      return 0
    fi

    echo "[INFO] Attempt $i failed. Retrying in 2s..."
    sleep 2
  done

  echo "[FAIL] Backend not responding"
  return 1
}

########################################
# 🚀 START SERVICES
########################################
start_services() {
  echo "[INFO] Starting production services..."

  if [ ! -d "$BACKEND_DIR" ]; then
    echo "[ERROR] Backend directory not found: $BACKEND_DIR"
    exit 1
  fi

  # 🔥 Ensure clean state
  kill_port

  cd "$BACKEND_DIR"

  echo "[INFO] Installing dependencies..."
  npm install

  echo "[INFO] Starting backend..."

  # 🔥 Properly detached process
  nohup npm start > backend.log 2>&1 < /dev/null &
  disown || true

  echo "[INFO] Backend started (detached)"

  # 🩺 Health check
  if ! check_health; then
    echo "[ERROR] Backend failed health check"
    exit 1
  fi

  echo "[INFO] Deployment successful. Exiting."
  exit 0
}

########################################
# 🛑 STOP SERVICES
########################################
stop_services() {
  echo "[INFO] Stopping services..."
  kill_port
  echo "[INFO] Services stopped."
}

########################################
# 🎯 Command handler
########################################
case "${1:-}" in
  start)
    start_services
    ;;
  stop)
    stop_services
    ;;
  *)
    echo "[ERROR] Usage: $0 {start|stop}"
    exit 1
    ;;
esac
