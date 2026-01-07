-- Users: email is already indexed via UNIQUE constraint

-- Tasks: common access pattern = "all tasks for a user, newest first"
CREATE INDEX IF NOT EXISTS idx_tasks_user_created_at
  ON tasks (user_id, created_at DESC);

-- Tasks: if you filter by status often
CREATE INDEX IF NOT EXISTS idx_tasks_user_status
  ON tasks (user_id, status);
