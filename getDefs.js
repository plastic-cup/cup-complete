module.exports = function(body){// calls getHash

    // regex used in sliceHash
    var regAllEquals = /\n?={2,}/g, // gets ==
        regHash = /# \w+/g, // gets '# someword'
        regHashCurly = /# [{\w]/g, // gets '# {' or '# someword'
        regNoHash = /\n?#+\*/, // gets '#*'
        sections = body.split(regAllEquals),
        definitionString = "",
        definitionObject;

    definitionObject = getHash(sections);

    for (var partOfSpeech in definitionObject){

        definitionObject[partOfSpeech] = definitionObject[partOfSpeech].map(function(e){
            return e.replace(/ \w+\|/g, " ");
        });
        definitionObject[partOfSpeech] = definitionObject[partOfSpeech].map(function(e){
            return e.replace(/''/g, "");
        });
        definitionObject[partOfSpeech] = definitionObject[partOfSpeech].map(function(e){
            return e.replace(/#+/g, "");
        });
        definitionString += definitionObject[partOfSpeech] +"\n";
    }
    return definitionString;


    function getHash(sectionsArray){
        var allDefs = {};
        // loops for all possible parts of speech
        for (var i = 0; i < sectionsArray.length; i++){
            var partOfSpeech,
                defs = [];
            // if this contains hashes, gimme gimme gimme
            if (sectionsArray[i].match(regHash)){
                // console.log("HASHY SECTIONSARRAY[i]");
                // console.log(sectionsArray[i]);
                partOfSpeech = getSpeech(sectionsArray[i]);
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
        var result = "No part of speech found",
            pos = [/noun/,/verb/, /adj/, /adv/, /conj/, /prep/];

        for (var i = 0; i < pos.length; i++){
            result = pos[i];
            break;
        }

        return result; // returns to getHash
    }
    function sliceHash(hashblockArray){
        var eachDef = [];
        var noMoreStars = hashblockArray.split("\n").filter(function(e){
            return e.match(regNoHash) === null;
        });
        for (var i = 0; i < noMoreStars.length; i++){
            if (noMoreStars[i].match(regHashCurly)){
                //noMoreStars[i].replace("[[", "");
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


};
