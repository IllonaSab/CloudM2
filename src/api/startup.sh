#!/bin/bash
python -m app.worker &
uvicorn app.main:app --host 0.0.0.0 --port 8000