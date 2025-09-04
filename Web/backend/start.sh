#!/bin/bash
# backend/start.sh
# Render exposes $PORT. This script launches uvicorn with that port.

PORT=${PORT:-8000}
export PYTHONUNBUFFERED=1

# Optional: set TF threads to prevent noisy CPU usage (tweak per environment)
export OMP_NUM_THREADS=2
export TF_CPP_MIN_LOG_LEVEL=2

uvicorn main:app --host 0.0.0.0 --port ${PORT}
