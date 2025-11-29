#!/bin/bash
cd "$(dirname "$0")"

# Start server on port 5000 in background
echo "🚀 Starting server on port 5000..."
python3 server.py 5000 > server-5000.log 2>&1 &
SERVER_5000_PID=$!
echo "   Server 5000 PID: $SERVER_5000_PID"

# Wait a moment
sleep 2

# Start server on port 5001 in background
echo "🚀 Starting server on port 5001..."
python3 server.py 5001 > server-5001.log 2>&1 &
SERVER_5001_PID=$!
echo "   Server 5001 PID: $SERVER_5001_PID"

echo ""
echo "✅ Both servers started!"
echo "📂 Port 5000: http://localhost:5000 or http://127.0.0.1:5000"
echo "📂 Port 5001: http://localhost:5001 or http://127.0.0.1:5001"
echo ""
echo "To stop servers, run:"
echo "  kill $SERVER_5000_PID $SERVER_5001_PID"
echo "Or: pkill -f 'python.*server.py'"
echo ""
echo "Logs:"
echo "  tail -f server-5000.log"
echo "  tail -f server-5001.log"
echo ""

# Keep script running
wait








