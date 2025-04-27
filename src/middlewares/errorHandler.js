module.exports = function errorHandler(err, req, res, next) {
  if (err) {
    console.error(err.stack || err);

    try {
      return res.status(err.status || 500).json(JSON.parse(err.message));
    } catch {
      return res.status(err.status || 500).send(err.message);
    }
  }

  return next();
};
