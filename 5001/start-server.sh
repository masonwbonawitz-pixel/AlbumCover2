#!/bin/bash

# Start script for 48x48 version on port 5001
# This is a copy of the main project running on a different port

echo "🚀 Starting 48x48 Version Server on port 5001..."
echo "📂 Open http://localhost:5001 in your browser"
echo "🔧 Admin price editor: http://localhost:5001/admin/prices"
echo ""
echo "Note: This is running on port 5001 so it won't conflict with the main version on port 5000"
echo ""

cd "$(dirname "$0")"

# Use venv Python if available (from parent directory), otherwise use system Python
if [ -f "../.venv/bin/python3" ]; then
    ../.venv/bin/python3 server.py
else
    python3 server.py
fi

