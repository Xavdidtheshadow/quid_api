module.exports = function(min, max){
  return parseInt(Math.random() * (max - min) + min);
};