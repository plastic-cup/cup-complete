var fs = require('fs');
var ac = {};

ac.words = [];

ac.import = function(callback){
  if (typeof callback !== 'function') return new Error('function plz');
  var filename = __dirname + '/words.txt';
  fs.readFile(filename, 'utf8', function(err, data){
    if (err) {
      console.error(err);
    }
    ac.words = data.split('\n').filter(function(line){
      return line;
    });
    callback(ac.words);
  });
};

ac.findWord = function(word, callback){
  var found = ac.words.filter(function(element){
    return element.indexOf(word) === 0;
  });
  return callback(null, found);
};


module.exports = ac;
