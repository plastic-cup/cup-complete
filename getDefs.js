module.exports = function(body){// calls getHash

    // regex used in sliceHash
    var regAllEquals = /\n?={2,}/g, // gets ==
        regHash = /# \S/g, // gets '# someword'
        regHashCurly = /# [{\w]/g, // gets '# {' or '# someword'
        regNoHash = /\n?#+\*/, // gets '#*'

        sections = body.split(regAllEquals);
        definitionString = getHash(sections);

        return definitionString;

    function getHash(sectionsArray){
        //console.log(sectionsArray);
        var allDefs = {};
        // loops for all possible parts of speech
        for (var i = 0; i < sectionsArray.length; i++){
            var partOfSpeech,
                defs = [];
            // if this contains hashes, gimme gimme gimme
            if (sectionsArray[i].match(regHash)){
                partOfSpeech = getSpeech(sectionsArray[i]);
                //console.log("part of speech:" + partOfSpeech);
                defs = sliceHash(sectionsArray[i]);

                // console.log(partOfSpeech);
                // console.log(defs);


                if (!(partOfSpeech in allDefs)){
                    allDefs[partOfSpeech] = defs;
                } else {
                    allDefs[partOfSpeech].concat(defs);
                }
                allDefs[partOfSpeech] = allDefs[partOfSpeech].slice(0,4);
             }
        }
        return makePretty(allDefs);
    }

    function getSpeech(hashblockString){
        var result = "No part of speech found",
            pos = [/noun/,/verb/, /adj/, /adv/, /conj/, /prep/];

        for (var i = 0; i < pos.length; i++){
            if (hashblockString.match(pos[i])){
                result = pos[i];
                break;
            }
        }
        return result;//.replace(/\//g, ""); // returns to getHash
    }

    function sliceHash(hashblockArray){
        var eachDef = [];
        var noMoreStars = hashblockArray.split("\n").filter(function(e){
            return e.match(regNoHash) === null;
        });
        for (var i = 0; i < noMoreStars.length; i++){
            if (noMoreStars[i].match(regHashCurly)){
                eachDef.push(noMoreStars[i]);
            }
        }
        eachDef = eachDef.map(function(def){
            return def.replace(/[\[\]]/g, ''); // remove anything between []
        });
        eachDef = eachDef.map(function(def){
            return def.replace(/{.*?}}/g, ''); // removes anything between {}
        });
        return eachDef;  // array returns to getHash
    }

    function makePretty(defsObject){
        // console.log("defsobject: ");
        // console.log(defsObject);
        var definitionString = "";
        for (var partOfSpeech in defsObject){
            // console.log("here i am");
            // console.log(defsObject[partOfSpeech]);
            defsObject[partOfSpeech] = defsObject[partOfSpeech].map(function(e){
                return e.replace(/ \w+\|/g, " ");
            });
            defsObject[partOfSpeech] = defsObject[partOfSpeech].map(function(e){
                return e.replace(/''/g, "");
            });
            defsObject[partOfSpeech] = defsObject[partOfSpeech].map(function(e){
                return e.replace(/#+/g, "");
            });

            // console.log("object after prettifying");
            // console.log(defsObject[partOfSpeech]);
            var bulletNum = 1;
            defsObject[partOfSpeech].forEach(function(definition){
                //console.log("definition:" + definition);
                if (definition.match(/[^\s]/)){ // if anything other than a whitespace char exists
                    definitionString += "<strong>" + bulletNum + ". " + partOfSpeech + "</strong> " + definition + "<br><br>";
                    bulletNum++;
                }

            });
        }

        //console.log("string in getdefs:" + definitionString);
        return definitionString; // returns a string to uberfunction getDefs
    }


};
