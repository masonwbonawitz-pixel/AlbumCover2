# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
# Copy from 5001 folder
COPY 5001/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files from 5001 folder
COPY 5001/ .

# Expose port (Render will set PORT env var at runtime)
EXPOSE 10000

# Use gunicorn to run the app
# PORT will be set by Render at runtime
CMD gunicorn --bind 0.0.0.0:${PORT:-10000} --timeout 120 --workers 2 server:app

