#!/bin/bash
# Build script for Render - tries to install Pillow with pre-built wheels
set -e

echo "Upgrading pip, setuptools, wheel..."
pip install --upgrade pip setuptools wheel

echo "Installing Pillow with pre-built wheels only..."
pip install pillow --only-binary :all: --no-build-isolation || pip install pillow --prefer-binary

echo "Installing other requirements..."
pip install -r requirements.txt --prefer-binary || pip install -r requirements.txt

echo "Build complete!"
