var ClientSide = (function(){

var suggestions,
    buttons = [].slice.call(document.getElementsByClassName('button')),
    statsDiv = document.getElementById('stats'),
    mainDiv = document.getElementById('main'),
    statsContent = document.getElementById('statsContent'),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    stats;

$('#search').keyup(function(e){
  var word = $('#search').val();
  if (word.length > 2){
    $.get('/find/'+word, function handler(data) {
      var words = data.split(',');
      var startWords = words.filter(function(element){
          return element.slice(0, word.length) === word;
      });
      var midWords = words.filter(function(element){
          return element.slice(0, word.length) !== word;
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
        var word = this.getElementsByClassName('word')[0].innerText;
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
        addStats.call(that);
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
    // REAL CODE FOR GETTING STATS FROM SERVER
    // getStats(function(data){
    //     statsDiv.className = statsDiv.className.indexOf('hidden') > -1 ? '' : 'hidden';
    //     mainDiv.className = statsDiv.className.indexOf('hidden') > -1 ? '' : 'hidden';
    //     statsContent.innerHTML = parseStats(data);
    // });

    //FAKE CODE FOR DEMONSTRATING
    statsDiv.className = statsDiv.className.indexOf('hidden') > -1 ? '' : 'hidden';
    mainDiv.className = statsDiv.className.indexOf('hidden') > -1 ? '' : 'hidden';
    var i = 0;
    ctx.clearRect(0, 310, 300, 300);
    for (var word in stats){
        ctx.save();
        ctx.translate(250,250);
        ctx.rotate(90 * Math.PI / 180);
        ctx.font = "24px sans-serif";
        ctx.fillText(word, 60, 225 - i);
        ctx.fillStyle = 'purple';
        ctx.fillRect(50, 212-i, -(15 * stats[word].length), 15);
        ctx.restore();
        i += 30;
    }
}

function parseStats(data){
    var result = '';
    //FOR USE WITH REAL DATA
    //data = JSON.parse(data);
    for (var string in data){
        result += '<strong>' + string + '</strong>: ' + data[string].length + '<br>';
    }
    return result;
}

function addStats(){
    stats = stats || {};
    if (stats[this.firstChild.innerText]){
        stats[this.firstChild.innerText].push(new Date());
    } else {
        stats[this.firstChild.innerText] = [new Date()];
    }
    console.log(stats);
}

var drawGraph = (function(){
    ctx.beginPath();
    ctx.moveTo(15,300);
    ctx.lineTo(15,0);
    ctx.stroke();
    ctx.font = "12 px sans-serif";
    ctx.fillText('0', 5, 300);
    ctx.fillText('10', 0, 150);
    ctx.fillText('20', 0, 10);
    ctx.beginPath();
    ctx.moveTo(15,300);
    ctx.lineTo(400,300);
    ctx.stroke();
}());

buttons.forEach(function(button){
    button.addEventListener('click', showStats);
});

return {
    getDefinition: getDefinition,
    addStats : addStats
};

}());
