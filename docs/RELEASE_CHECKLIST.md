# Focus-Lite v1.0.0 Release Checklist

## Pre-Release Tasks

### ✅ 1. Testing & Quality

- [ ] Run all backend tests: `docker-compose exec backend npm test`
- [ ] Run backend tests with coverage: `docker-compose exec backend npm run test:cov`
- [ ] Verify coverage >80%: Check `backend/coverage/lcov-report/index.html`
- [ ] Run frontend tests: `docker-compose exec frontend npm test`
- [ ] Run all linters: `docker-compose exec backend npm run lint && docker-compose exec frontend npm run lint`
- [ ] Verify negative test cases pass
- [ ] Check SonarCloud quality gate passes

### ✅ 2. Documentation

- [x] Update README.md with complete setup instructions
- [x] Create architecture diagram (docs/architecture-diagram.md)
- [x] Write lessons learned document (docs/LESSONS_LEARNED.md)
- [ ] Capture application screenshots
  - [ ] Login page
  - [ ] Register page
  - [ ] Tasks page (with data)
  - [ ] Dark mode (if applicable)
- [ ] Update CHANGELOG.md with v1.0.0 release notes

### ✅ 3. Configuration Review

- [ ] Verify `.env` files are in `.gitignore`
- [ ] Check no sensitive data in repository
- [ ] Verify Dockerfile builds successfully
- [ ] Test production build: `docker-compose -f docker-compose.prod.yml up --build`
- [ ] Verify migrations run cleanly
- [ ] Check database seed data (optional)

### ✅ 4. Security Review

- [ ] No hardcoded secrets or credentials
- [ ] JWT secret is environment variable
- [ ] Database password is secure
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Dependencies up to date (no critical vulnerabilities)

### ✅ 5. Repository Health

- [ ] All GitHub Actions CI checks passing
- [ ] No failing tests in main branch
- [ ] All merge conflicts resolved
- [ ] Branch protection rules enforced
- [ ] Code review completed (if applicable)

---

## Release Process

### Step 1: Final Testing

```bash
# In vagrant VM
cd /vagrant

# Run comprehensive test suite
./scripts/run-all-tests.sh

# Verify all tests pass
```

### Step 2: Update Version Numbers

```bash
# Update package.json versions
cd backend && npm version 1.0.0 --no-git-tag-version
cd ../frontend && npm version 1.0.0 --no-git-tag-version

# Update sonar-project.properties (already set to 1.0.0)
```

### Step 3: Update CHANGELOG

Create/update `CHANGELOG.md`:

```markdown
# Changelog

## [1.0.0] - 2026-01-12

### Added

- User authentication (register/login with JWT)
- Task management (CRUD operations)
- Protected routes and API endpoints
- Input validation and error handling
- Rate limiting on auth endpoints
- Database migrations and seeding
- Comprehensive test suite (unit + integration)
- CI/CD pipeline with GitHub Actions
- SonarCloud code quality analysis
- Docker containerization
- Production build with Nginx
- Dark mode support
- Optimistic UI updates
- Toast notifications

### Security

- JWT authentication with 7-day expiration
- bcrypt password hashing (12 rounds)
- SQL injection prevention (parameterized queries)
- CORS configuration
- Security headers (Helmet)
- Rate limiting

### Documentation

- Complete README with setup instructions
- Architecture diagrams and documentation
- API reference
- Lessons learned document
- Code comments and JSDoc
```

### Step 4: Commit Changes

```bash
git add .
git commit -m "chore: prepare v1.0.0 release

- Update version numbers to 1.0.0
- Add comprehensive documentation
- Update CHANGELOG with release notes
- Add architecture diagrams
- Document lessons learned"
```

### Step 5: Create Git Tag

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0

Focus-Lite v1.0.0 - Full-stack task management application

Features:
- JWT authentication
- Task CRUD operations
- Protected routes
- Comprehensive testing
- CI/CD pipeline
- Docker containerization
- Production-ready"

# Verify tag
git tag -l -n9 v1.0.0
```

### Step 6: Push to Remote

```bash
# Push changes
git push origin main

# Push tags
git push origin v1.0.0

# Or push everything
git push --follow-tags
```

### Step 7: Create GitHub Release

1. Go to: https://github.com/KagisoKat/focus-lite/releases/new
2. Select tag: `v1.0.0`
3. Release title: `Focus-Lite v1.0.0 - Production Release`
4. Description:

````markdown
# Focus-Lite v1.0.0 🚀

Full-stack task management application with professional DevOps practices.

## 🎉 Highlights

- Complete user authentication system (JWT)
- Full task management (create, update, delete, status tracking)
- Protected routes and API endpoints
- Comprehensive test coverage
- CI/CD pipeline with quality gates
- Production-ready Docker setup

## 📦 What's Included

- ✅ Backend API (Node.js + Express + PostgreSQL)
- ✅ Frontend SPA (React + Vite)
- ✅ Authentication & Authorization
- ✅ Test Suite (Jest + Supertest)
- ✅ Linting (ESLint)
- ✅ Code Quality (SonarCloud)
- ✅ Docker Compose setup
- ✅ Vagrant development environment
- ✅ Production build configuration

## 📖 Documentation

- [README](https://github.com/KagisoKat/focus-lite#readme)
- [Architecture](https://github.com/KagisoKat/focus-lite/blob/main/docs/architecture-diagram.md)
- [Lessons Learned](https://github.com/KagisoKat/focus-lite/blob/main/docs/LESSONS_LEARNED.md)

## 🚀 Quick Start

```bash
git clone https://github.com/KagisoKat/focus-lite.git
cd focus-lite
vagrant up
vagrant ssh
cd /vagrant && docker-compose up
```
````

See the [README](https://github.com/KagisoKat/focus-lite#readme) for full setup instructions.

## 🔒 Security

- JWT authentication with 7-day expiration
- bcrypt password hashing
- Rate limiting on auth endpoints
- Input validation
- SQL injection prevention
- CORS configuration

## 📊 Quality Metrics

- Test Coverage: >80%
- SonarCloud Quality Gate: ✅ Passing
- All CI Checks: ✅ Passing

## 🙏 Credits

Built with modern full-stack best practices and DevOps workflows.

````

5. Attach any relevant files (optional):
   - Screenshots
   - Build artifacts (optional)

6. Check "Set as the latest release"
7. Click "Publish release"

---

## Post-Release Tasks

### Verification

- [ ] Verify release appears on GitHub releases page
- [ ] Test clone and setup from fresh checkout
- [ ] Verify Docker images build successfully
- [ ] Check all links in README work
- [ ] Verify screenshots display correctly

### Announcement (Optional)

- [ ] Share on LinkedIn with project highlights
- [ ] Update portfolio website
- [ ] Add to resume/CV
- [ ] Share in relevant communities

### Next Steps

- [ ] Monitor for any issues
- [ ] Plan v1.1.0 features (if continuing)
- [ ] Archive project or continue development
- [ ] Use as template for future projects

---

## Rollback Plan (if needed)

If issues are discovered after release:

```bash
# Delete the tag locally
git tag -d v1.0.0

# Delete the tag remotely
git push origin :refs/tags/v1.0.0

# Delete the GitHub release (via UI)

# Fix issues, then re-tag
git tag -a v1.0.0 -m "Fixed release"
git push origin v1.0.0
````

---

## Success Criteria

Release is successful when:

✅ All tests passing  
✅ Coverage >80%  
✅ SonarCloud quality gate passing  
✅ Documentation complete  
✅ Git tag created and pushed  
✅ GitHub release published  
✅ Fresh clone and setup works  
✅ Production build works

---

**Prepared by**: Kagiso Manamela  
**Date**: January 12, 2026  
**Version**: 1.0.0
