var assert = require('assert');
var ac = require('../index.js');

assert.equal(typeof ac, 'object');
assert.equal(typeof ac.import, 'function');

ac.import(function(words){
  console.log("words.txt had " + words.length + " words in it");
  assert.equal(words.length, 235886);
});

// console.log('attempt to invoke ac.import without a valid callback');
// var error = ac.import('string');
// assert.equal(error.message, 'function plz');

console.log('# ac.findWords finds a string in words array');

ac.import(function(){
  ac.findWord('awes', function (err, found) {
    assert.equal(err, null);
    assert.equal(found.length, 4);
  });
});
