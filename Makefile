SHELL := /bin/bash

.PHONY: help vagrant-up vagrant-ssh vagrant-reload up down restart ps logs logs-backend logs-frontend logs-db \
        test lint build fe-build be-test db-reset db-psql db-shell

help:
	@echo "Focus-Lite Makefile commands:"
	@echo ""
	@echo "Vagrant:"
	@echo "  make vagrant-up      # Start VM"
	@echo "  make vagrant-reload  # Reload VM (use after provisioning/group changes)"
	@echo "  make vagrant-ssh     # SSH into VM"
	@echo ""
	@echo "Docker (run inside VM in /vagrant):"
	@echo "  make up              # Build + start containers"
	@echo "  make down            # Stop containers"
	@echo "  make restart         # Restart containers"
	@echo "  make ps              # List containers"
	@echo "  make logs            # Tail all logs"
	@echo "  make logs-backend    # Tail backend logs"
	@echo "  make logs-frontend   # Tail frontend logs"
	@echo "  make logs-db         # Tail db logs"
	@echo ""
	@echo "Quality:"
	@echo "  make test            # Backend tests"
	@echo "  make lint            # Lint backend + frontend"
	@echo "  make build           # Frontend build"
	@echo ""
	@echo "Database:"
	@echo "  make db-psql         # Open psql in db container"
	@echo "  make db-shell        # Shell into db container"
	@echo "  make db-reset        # DANGER: drop volumes and recreate DB"

# --------------------
# Vagrant (run on host)
# --------------------
vagrant-up:
	vagrant up

vagrant-reload:
	vagrant reload

vagrant-ssh:
	vagrant ssh

# ------------------------------------------
# Docker Compose (run inside VM at /vagrant)
# ------------------------------------------
up:
	docker compose up -d --build

down:
	docker compose down

restart:
	docker compose restart

ps:
	docker ps

logs:
	docker compose logs -f --tail=100

logs-backend:
	docker logs -f --tail=200 focus-backend

logs-frontend:
	docker logs -f --tail=200 focus-frontend

logs-db:
	docker logs -f --tail=200 focus-db

# -------
# Quality
# -------
test: be-test

be-test:
	docker exec -it focus-backend npm test

lint:
	docker exec -it focus-backend npm run lint
	docker exec -it focus-frontend npm run lint

build: fe-build

fe-build:
	docker exec -it focus-frontend npm run build

# --------
# Database
# --------
db-psql:
	docker exec -it focus-db psql -U focus -d focus

db-shell:
	docker exec -it focus-db bash

db-reset:
	@echo "This will REMOVE volumes (Postgres data). Press Ctrl+C to cancel."
	@sleep 2
	docker compose down -v
	docker compose up -d --build
