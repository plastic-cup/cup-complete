var fs = require('fs');
var request = require('request'); // for the requesting stuff
var ac = {};
var http = require('http');

ac.import = function(callback){
    if (typeof callback !== 'function'){
        return new Error('function plz');
    }
    var filename = __dirname + '/words.txt';
    fs.readFile(filename, 'utf8', function(err, data){
        ac.words = data.split('\n').filter(function(line){
          return line;
        });
        callback(err, ac.words);
    });
};

ac.stats = function(word, callback){
    if (!ac.searches) {
      ac.searches = {};
    }
    if (!ac.searches[word]) {
      ac.searches[word] = [];
    }
    ac.searches[word].push(new Date().getTime());
    return callback(null, ac.searches);
};

ac.findWord = function(word, callback, next){
    var statsCallback = next || function(){
      return;
    };
    var found = ac.words.filter(function(element){
      return element.indexOf(word) === 0;
    });
    ac.stats(word,statsCallback);
    //console.log(ac.searches);
    return callback(null, found);
};

ac.define = function (word, callback, specificURL){
    var body = '';
    var url = specificURL || 'http://en.wiktionary.org/w/api.php?action=query&titles=' + word + '&prop=revisions&rvprop=content&rvgeneratexml=&format=json';
    var request = http.get(url, function (response){

        response.on('data', function(chunk){
            body += chunk;
        });
      response.on('end', function(){

          var json2object = JSON.parse(body).query.pages;
          var pageContent;
          for (var key in json2object){
              pageContent = json2object[key].revisions[0]['*'];
          }

          var getDefs = function(body){// calls getHash

              // regex used in sliceHash
              var regAllEquals = /\n?={2,}/g; // gets ==
              var regHash = /# \w+/g; // gets '# someword'
              var regHashCurly = /# [{\w]/g; // gets '# {' or '# someword'
              var regNoHash = /\n?#+\*/; // gets '#*'

              var sections = body.split(regAllEquals);

              return getHash(sections);

              function getHash(sectionsArray){
                  var allDefs = {};
                  // loops for all possible parts of speech
                  for (var i = 0; i < sectionsArray.length; i++){
                      var defs = [];
                      // if this contains hashes, gimme gimme gimme
                      if (sectionsArray[i].match(regHash)){
                          // console.log("HASHY SECTIONSARRAY[i]");
                          // console.log(sectionsArray[i]);
                          var partOfSpeech = getSpeech(sectionsArray[i]);
                          defs = sliceHash(sectionsArray[i]);
                          if (!(partOfSpeech in allDefs)){

                              allDefs[partOfSpeech] = defs;
                          } else {
                            allDefs[partOfSpeech].concat(defs);
                          }

                          allDefs[partOfSpeech] = allDefs[partOfSpeech].slice(0,4);

                       }

                  }
                  return allDefs; // returns to uberfunction getDefs
              }

              function getSpeech(hashblockString){
                  var result = "No part of speech found";
                  var before;
                  var beforeIndex;
                  var after;
                  var afterIndex;
                  var pos = [/noun/,/verb/, /adj/, /adv/, /conj/, /prep/];

                  for (var i = 0; i < pos.length; i++){
                      result = pos[i];
                      break;
                  }

                  return result; // returns to getHash
              }
              function sliceHash(hashblockArray){
                  var eachDef = [];
                  var arr = hashblockArray.split("\n");
                  var noMoreStars = arr.filter(function(e){
                      return e.match(regNoHash) === null;
                  });
                  for (var i = 0; i < noMoreStars.length; i++){
                      if (noMoreStars[i].match(regHashCurly)){
                          //noMoreStars[i].replace("[[", "");
                          eachDef.push(noMoreStars[i]);
                      }
                  }
                  //var regNoSquare = /[[/g;
                  eachDef = eachDef.map(function(def){
                      return def.replace(/[\[\]]/g, ''); // remove anything between []
                  });
                  eachDef = eachDef.map(function(def){
                      return def.replace(/{.*?}}/g, ''); // removes anything between {}
                  });
                  return eachDef;  // array returns to getHash
              }


          };

          var definitionObject = getDefs(pageContent);
          var definitionString = "";
          for (var partOfSpeech in definitionObject){
              definitionString += definitionObject[partOfSpeech] +"\n";
          }

          return callback(null, definitionString);

      });
  });
  request.on('error',function(error){
    callback(error);
  });
};

module.exports = ac;
