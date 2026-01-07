-- Enforce allowed status values at the database level

-- 1) Ensure the column is NOT NULL and has the right default
ALTER TABLE tasks
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'pending';

-- 2) Add CHECK constraint (idempotent: only adds if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'tasks_status_allowed'
  ) THEN
    ALTER TABLE tasks
      ADD CONSTRAINT tasks_status_allowed
      CHECK (status IN ('pending', 'in_progress', 'completed'));
  END IF;
END $$;
