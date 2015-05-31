var fs = require('fs'),
    ac = {},
    http = require('http'),
    getDefs = require('./getDefs.js');

ac.import = function(callback){
    var filename;
    if (typeof callback !== 'function'){
        return new Error('function plz');
    }
    filename = __dirname + '/words.txt';
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
    var statsCallback = next || function(){return;};
    var found = ac.words.filter(function(element){
        return element.indexOf(word) >= 0;
    });
    ac.stats(word,statsCallback);
    return callback(null, found);
};

ac.define = function (word, callback, specificURL){
    var url = specificURL || 'http://en.wiktionary.org/w/api.php?action=query&titles=' + word + '&prop=revisions&rvprop=content&rvgeneratexml=&format=json';
    var body = "";
    var request = http.get(url, function (response){

        response.on('data', function(chunk){
            body += chunk;
        });
        response.on('end', function(){

            var json2object = JSON.parse(body).query.pages,
                pageContent,
                definitionString;

            if (json2object[-1]) {
                // console.log("JSON OBJECT (for debugging purposes):");
                // console.log(json2object);
                return callback('no definition found', '');
            }
            for (var key in json2object){
                pageContent = json2object[key].revisions[0]['*'];
            }

            definitionString = getDefs(pageContent);
            console.log(definitionString);
            return callback(null, definitionString);
        });
    });
    request.on('error',function(error){
        callback(error);
    });
};

module.exports = ac;
