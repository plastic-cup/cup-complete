test('search for words beginning with awes', function(assert){
  var done = assert.async();
  $.get('/find/awes/', function handler(data) {
    var words = data.split(',');
    assert.equal(words.length, 4, 'number of suggestions for awes is 4');
    done();
  })
});

test('search box is exists and is massive', function(assert){
    var searchbox = $('#search');
    assert.ok(searchbox.width() > ($(window).width() * 0.7));
    assert.ok(searchbox.height() > ($(document).height() * 0.1));
});
