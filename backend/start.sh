#!/bin/bash
# Railway startup script

# Railway provides PORT as environment variable
# Default to 8001 if not set
PORT=${PORT:-8001}

echo "Starting server on port $PORT..."
uvicorn server:app --host 0.0.0.0 --port $PORT
