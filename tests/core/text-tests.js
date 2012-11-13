module( "Text", {
    teardown: function() {
      document.getElementById('text').innerHTML = '';
    }
});


test( "text", function() {
  var svg = d3.select('#text').append('svg'),
      el = svg.append('text');
      
  el.text('hello')
  equal(el.text(), 'hello')
});
