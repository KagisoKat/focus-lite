#!/bin/bash
# Test runner script for Focus-Lite
# Run this inside vagrant VM: vagrant ssh -c "/vagrant/scripts/run-all-tests.sh"

set -e  # Exit on any error

echo "========================================"
echo "Focus-Lite - Test Suite Runner"
echo "========================================"
echo ""

# Navigate to project directory
cd /vagrant

# Ensure services are running
echo "✓ Checking Docker services..."
docker-compose ps | grep -q "Up" || {
    echo "⚠ Services not running. Starting them..."
    docker-compose up -d
    sleep 5
}

echo ""
echo "========================================"
echo "1/4: Backend Tests with Coverage"
echo "========================================"
docker-compose exec -T backend npm run test:cov

echo ""
echo "========================================"
echo "2/4: Backend Linting"
echo "========================================"
docker-compose exec -T backend npm run lint

echo ""
echo "========================================"
echo "3/4: Frontend Tests"
echo "========================================"
docker-compose exec -T frontend npm test -- --run

echo ""
echo "========================================"
echo "4/4: Frontend Linting"
echo "========================================"
docker-compose exec -T frontend npm run lint

echo ""
echo "========================================"
echo "✅ All Tests Passed!"
echo "========================================"
echo ""
echo "Coverage report: backend/coverage/lcov-report/index.html"
echo "SonarCloud configuration: sonar-project.properties"
echo ""
echo "Next steps:"
echo "  - Review coverage: open backend/coverage/lcov-report/index.html"
echo "  - Run SonarCloud analysis via GitHub Actions"
echo "  - Tag release: git tag v1.0.0 && git push origin v1.0.0"
