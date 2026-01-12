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

.PHONY: prod-up prod-down prod-logs prod-ps

prod-up:
	docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build

prod-down:
	docker compose --env-file .env.prod -f docker-compose.prod.yml down

prod-logs:
	docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f --tail=100

prod-ps:
	docker compose --env-file .env.prod -f docker-compose.prod.yml ps

.PHONY: prod-smoke

prod-smoke:
	@echo "== containers =="
	@docker compose --env-file .env.prod -f docker-compose.prod.yml ps
	@echo
	@echo "== health =="
	@curl -fsS http://localhost:8080/health && echo
	@curl -fsS http://localhost:8080/api/health && echo

.PHONY: db-backup db-restore

db-backup:
	@mkdir -p backups
	@echo "Creating backup in ./backups ..."
	docker exec -t focus-db pg_dump -U focus -d focus -F c -f /tmp/focus.backup
	docker cp focus-db:/tmp/focus.backup backups/focus_`date +%Y%m%d_%H%M%S`.backup
	@echo "Done."

# Usage:
# make db-restore FILE=backups/focus_YYYYMMDD_HHMMSS.backup
db-restore:
	@if [ -z "$(FILE)" ]; then echo "Missing FILE=. Example: make db-restore FILE=backups/your.backup"; exit 1; fi
	@echo "Restoring from $(FILE) ..."
	docker cp $(FILE) focus-db:/tmp/restore.backup
	docker exec -t focus-db pg_restore -U focus -d focus --clean --if-exists /tmp/restore.backup
	@echo "Done."
