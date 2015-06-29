module.exports = function() {
  console.log('env is ' + process.env.NODE_ENV);
  var env = process.env.NODE_ENV || 'dev';
  if (env === 'production') {
    return process.env.MONGOLAB_URI;
  }
  else if (env === 'test') {
    return process.env.MONGOLAB_TEST_URI;
  }
  else {
    return "mongodb://localhost:27017/quidditch";
  }
};