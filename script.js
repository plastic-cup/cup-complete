var ClientSide = (function(){

var suggestions,
    buttons = [].slice.call(document.getElementsByClassName('button')),
    statsDiv = document.getElementById('stats'),
    mainDiv = document.getElementById('main');

$('#search').keyup(function(e){
  var word = $('#search').val();
  if (word.length > 2){
    $.get('/find/'+word, function handler(data) {
      var words = data.split(',');
      var results = '';
      words.forEach(function(w) {
        w = w.split(word).join("<span class='highlight'>" + word + "</span>");
        results += "<div class='suggestion'><p class='word'> " + w + "</p></div>";
      });
      $('#results').html(results);
      suggestionUpdater();
    });
  }
});

function suggestionUpdater(){
    suggestions = [].slice.call(document.getElementsByClassName('suggestion'));
    suggestions.forEach(function(element){
        element.addEventListener('click', ClientSide.getDefinition);
    });
}

function getDefinition(){
    var definition;
    if (this.children.length > 1){
        this.removeChild(this.lastChild);
    } else {
        var word = this.getElementsByClassName('word')[0].innerHTML;
        var request = new XMLHttpRequest();
        request.open('GET', '/define/' + word);
        request.onreadystatechange = function(){
            if (request.readyState === 4){
                if (request.status === 200){
                    definition = request.responseText;
                }
            }
        };
        this.innerHTML += '<p class = "definition">' + definition + '</p>';
        var heightToggle = function(){
          this.lastChild.className += ' show';
        }.bind(this);
        setTimeout(function(){
          heightToggle();
        },0);
    }
}

function getStats(){
    var stats;
    var request = new XMLHttpRequest();
    request.open('GET', '/stats/');
    request.send();
    request.onreadystatechange = function(){
        if (request.readyState === 4){
            if (request.status === 200){
                stats = request.responseText;
                console.log(request.readyState, request.status);
                return stats;
            }
        }
    }
}

function showStats(){
    statsDiv.className = statsDiv.className.indexOf('hidden') > -1 ? '' : 'hidden';
    mainDiv .className = statsDiv.className.indexOf('hidden') > -1 ? '' : 'hidden';
    var stats = document.createElement('p');
    stats.innerHTML = getStats();
    statsDiv.appendChild(stats);
}

buttons.forEach(function(button){
    button.addEventListener('click', showStats);
});

return {
    getDefinition: getDefinition
};

}());
