module( "Text", {
    teardown: function() {
      document.getElementById('text').innerHTML = '';
    }
});

test( "text", function() {
  var svg = d3.select('#text').append('svg'),
      el = svg.append('text');

  el.text('hello');
  equal(el.text(), 'hello');
});

test("text function", function() {
  var svg = d3.select('#text').append('svg'),
      el = svg.append('text');

  el.text(function() { return "hello"; });
  equal(el.text(), 'hello');
});

test("text on HTML element", function() {
  var div = d3.select('#text').append('div');

  div.text('hello');
  equal(div.text(), 'hello');
});
