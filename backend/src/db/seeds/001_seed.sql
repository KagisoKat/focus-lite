-- Seed a test user for development & constraint testing

INSERT INTO users (id, email, password_hash)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'seeduser@example.com',
  '$2b$10$dummyhashfordevonlyxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
)
ON CONFLICT (email) DO NOTHING;
