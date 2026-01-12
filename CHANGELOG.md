# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-12

### Added

- Initial release of Focus-Lite task management application
- User authentication with JWT (register/login)
- Protected task management (create, read, update, delete)
- Task status workflow: pending → in-progress → completed
- React frontend with dark mode support
- Optimistic UI updates with rollback on error
- Toast notifications for user feedback
- Server-side validation and database constraints
- Automated database migrations
- Docker Compose development environment
- Vagrant VM setup for reproducible development
- Jest + Supertest backend test suite with coverage reporting
- ESLint for code quality (backend + frontend)
- GitHub Actions CI pipeline with quality gates
- SonarCloud integration for code analysis
- Production Docker Compose configuration with Nginx
- Database backup/restore utilities
- Comprehensive API documentation
- Security hardening (rate limiting, helmet, bcrypt)

[1.0.0]: https://github.com/KagisoKat/focus-lite/releases/tag/v1.0.0
