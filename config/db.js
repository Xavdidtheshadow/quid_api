module.exports = function() {
  var env = process.env.NODE_ENV || 'dev';
  if (env === 'production') {
    return process.env.MONGOLAB_URI;
  }
  else if (env === 'test') {
    return process.env.TEST_MONGOLAB_URI;
  }
  else {
    return "mongodb://localhost:27017/quidditch";
  }
};