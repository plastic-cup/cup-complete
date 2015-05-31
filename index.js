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
    var body = "",
        url,
        request;

    url = specificURL || 'http://en.wiktionary.org/w/api.php?action=query&titles=' + word + '&prop=revisions&rvprop=content&rvgeneratexml=&format=json';
    request = http.get(url, function (response){
        response.on('data', function(chunk){
            body += chunk;
        });
        response.on('end', function(){
            var json2object,
                pageContent,
                definitionObject,
                definitionString = "";

            json2object = JSON.parse(body).query.pages;

            for (var key in json2object){
                pageContent = json2object[key].revisions[0]['*'];
            }

            definitionObject = getDefs(pageContent);
            console.log(definitionObject);

            // clean up definition text
            for (var partOfSpeech in definitionObject){
                // remove duplicate words
                definitionObject[partOfSpeech] = definitionObject[partOfSpeech].map(function(e){
                    return e.replace(/ \w+\|/g, " ");
                });
                // remove excessive quotation marks
                definitionObject[partOfSpeech] = definitionObject[partOfSpeech].map(function(e){
                    return e.replace(/''/g, "");
                });
                // remove hashes
                definitionObject[partOfSpeech] = definitionObject[partOfSpeech].map(function(e){
                    return e.replace(/#+/g, "");
                });
                definitionString += definitionObject[partOfSpeech] + "\n";
            }

            return callback(null, definitionString);
        });
    });
    request.on('error',function(error){
        callback(error);
    });
};

module.exports = ac;
