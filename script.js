var ClientSide = (function(){

var suggestions;

$('#search').keyup(function(e){
  var word = $('#search').val();
  if (word.length > 2){
    $.get('/find/'+word, function handler(data) {
      var words = data.split(',');
      var results = '';
      words.forEach(function(w) {
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
        this.innerHTML += '<p>' + definition + '</p>';
    }
}

return {
    getDefinition: getDefinition
};

}());
