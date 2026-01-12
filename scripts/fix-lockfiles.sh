#!/bin/bash
# Fix package-lock.json sync issues
# Run from /vagrant directory inside vagrant VM

set -e

echo "========================================"
echo "Fixing package-lock.json sync issues"
echo "========================================"

cd /vagrant

echo ""
echo "1/2: Updating backend package-lock.json..."
docker-compose exec -T backend npm install --package-lock-only

echo ""
echo "2/2: Updating frontend package-lock.json..."
docker-compose exec -T frontend npm install --package-lock-only

echo ""
echo "✅ Package lock files updated!"
echo ""
echo "Next steps:"
echo "  1. Commit the updated package-lock.json files"
echo "  2. Rebuild containers: docker-compose build"
echo "  3. Restart: docker-compose up -d"
