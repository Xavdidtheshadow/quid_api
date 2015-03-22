module.exports = function(app) {
  console.log('in auth init');
  function beforeHandler(req, res, next) {
    if (req.method === 'POST' && req.query.api_key !== process.env.API_KEY) {
      return next(new Error("Invalid API key"));
    }
    next();
  }

  app.use(beforeHandler);
};