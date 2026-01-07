export function httpError(status, message, details) {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  return err;
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const payload = { ok: false, error: err.message || "Internal Server Error" };

  if (err.details) payload.details = err.details;

  res.status(status).json(payload);
}
