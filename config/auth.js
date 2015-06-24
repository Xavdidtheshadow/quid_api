module.exports = function(app) {
  function beforeHandler(req, res, next) {
    // this is currently a query param- it should probably be somewhere else
    if (!app.locals.dev && req.method === 'POST' && req.query.api_key !== process.env.API_KEY) {
      return res.status(403).send('Invalid API key');
    }
    next();
  }

  app.use(beforeHandler);
};