function iQuery(identifier){
    return $('#iframe').contents().find(identifier);
}

test('search for words beginning with awes', function(assert){
  var done = assert.async();
  $.get('/find/awes/', function handler(data) {
    var words = data.split(',');
    assert.equal(words.length, 4, 'number of suggestions for awes is 4');
    done();
  });
});

test('search box is exists and is massive', function(assert){
    var searchbox = iQuery('#search');
    assert.ok(parseInt(searchbox.css('width'), 10) > (iQuery(window).width() * 0.79));
    assert.ok(parseInt(searchbox.css('height'), 10) > (iQuery(window).height() * 0.09));
});

test('suggestions toggle when clicked/touched', function(assert){
    var done = assert.async();
    var target = document.getElementById('iframe').contentWindow.document;
    var search = target.getElementById('search');
    search.value = 'fun';
    var event = new Event('keyup');
    search.dispatchEvent(event);

    setTimeout(function(){
        var suggestion = target.getElementsByClassName('suggestion')[0];
        console.log(suggestion);
        var suggestionNumber = suggestion.children.length;
        suggestion.click();
        assert.equal(suggestion.children.length, suggestionNumber + 1);
        setTimeout(function(){assert.ok(suggestion.lastChild.style.height > 0);},50);
        suggestion.click();
        assert.equal(suggestion.children.length, suggestionNumber);
        done();
    }, 1000);
});
