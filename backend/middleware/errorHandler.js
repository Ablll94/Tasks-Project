const notFound = (req, res, next) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
};

module.exports = { notFound, errorHandler };
