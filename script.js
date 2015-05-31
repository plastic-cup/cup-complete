var ClientSide = (function(){

var suggestions,
    buttons = [].slice.call(document.getElementsByClassName('button')),
    statsDiv = document.getElementById('stats'),
    mainDiv = document.getElementById('main'),
    statsContent = document.getElementById('statsContent');

$('#search').keyup(function(e){
    var word = $('#search').val();
    if (word.length > 2){
        $.get('/find/'+word, function handler(data) {
            var words = data.split(',');
            var startWords = words.filter(function(element){
                return element.slice(0, word.length) === word;
            });
            var midWords = words.filter(function(element){
                return element.slice(0, word.length) !== word.charAt(0);
            });
            words = startWords.concat(midWords);
            var results = '';
            words.forEach(function(w) {
                w = w.split(word).join("<span class='highlight'>" + word + "</span>");
                results += "<div class='suggestion'><p class='word'> " + w + "</p></div>";
            });
            $('#results').html(results);
            suggestionUpdater();
        });
    } else if (word.length === 0){
        $('#results').html('');
    }
});

function suggestionUpdater(){
    suggestions = [].slice.call(document.getElementsByClassName('suggestion'));
    suggestions.forEach(function(element){
        element.addEventListener('click', ClientSide.getDefinition);
    });
}

function defAppend(definition){
    console.log(definition);
  this.innerHTML += '<p class = "definition">' + definition + '</p>';
  var heightToggle = function(){
    this.lastChild.className += ' show';
}.bind(this);
  setTimeout(function(){
    heightToggle();
  },0);
}

function getDefinition(){
    var definition;
    var that = this;
    if (this.children.length > 1){
        this.removeChild(this.lastChild);
    } else {
        var word = this.getElementsByClassName('word')[0].innerHTML;
        var request = new XMLHttpRequest();
        request.open('GET', '/define/' + word);
        request.onreadystatechange = function(){
            if (request.readyState === 4){
                if (request.status === 200){
                    definition = request.responseText || 'put definition here';
                    defAppend.call(that,definition);
                }
            }
        };
        request.send();
    }
}

function getStats(callback){
    var stats;
    var request = new XMLHttpRequest();
    request.open('GET', '/stats/');
    request.send();
    request.onreadystatechange = function(){
        if (request.readyState === 4){
            if (request.status === 200){
                stats = request.responseText;
                callback(stats);
            }
        }
    };
}

function showStats(){
    getStats(function(data){
        statsDiv.className = statsDiv.className.indexOf('hidden') > -1 ? '' : 'hidden';
        mainDiv .className = statsDiv.className.indexOf('hidden') > -1 ? '' : 'hidden';
        statsContent.innerHTML = parseStats(data);
    });
}

function parseStats(data){
    var result = '';
    data = JSON.parse(data);
    for (var string in data){
        result += '<strong>' + string + '</strong>: ' + data[string].length + '<br>';
    }
    return result;
}

buttons.forEach(function(button){
    button.addEventListener('click', showStats);
});

return {
    getDefinition: getDefinition
};

}());
