var assert = require('assert');
var ac = require('../index.js');


assert.equal(typeof ac, 'object');
assert.equal(typeof ac.import, 'function');

ac.import(function(err, words){
  console.log("words.txt had " + words.length + " words in it");
  assert.equal(words.length, 235886);
});

console.log('# attempt to invoke ac.import without a valid callback');
var error = ac.import('string');
assert.equal(error.message, 'function plz');

console.log('# ac.findWords finds a string in words array');

ac.import(function(){
  ac.findWord('awes', function (err, found) {
    assert.equal(err, null);
    assert.equal(found.length, 4);
  });
});

console.log('# ac.stats tracks which words/strings were searched for');

ac.import(function(){
  ac.stats('awesome', function (err, stats) {
    assert.equal(stats.awesome.length, 1);
  });
  ac.stats('awesome', function (err, stats){
    assert.equal(stats.awesome.length, 2);
  });
});

console.log('# err is null, thus no error');
ac.define('cat', function (err, definitionString){
    assert.equal(err, null);
});

console.log("# we get an error when wiktionary can't be reached");
ac.define('a', function (err, definitionString){
    assert.ok(err);
}, "ohfoashfiodhjfaeffas");

console.log("# we return an error when there is no definition");
ac.define('heloedfndsjklf', function (err, definitionString){
    assert.ok(err);
});



console.log('# Definition gives some string as definition');
ac.define('cat', function (err, definitionString){
    assert.notEqual(definitionString, "");
});

console.log('# Definition gives the correct definition');
ac.define('cat', function (err, definitionString){
    assert.notEqual(definitionString, "An animal of the family Felidae");
});
