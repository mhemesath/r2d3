//================================
// Selection Tests
module( "Selection Classed", {
    teardown: function() {
      document.getElementById('selectionClassed').innerHTML = '';
    }
});


test( "add first class", function() {
  var svg = d3.select('#selectionClassed').append('svg'),
      path = "M0 0L10 10Z",
      el = svg.append('path');
      
  el.classed('foo', true);
  equal(el.attr('class'), 'foo')
});


test( "add class to existing", function() {
  var svg = d3.select('#selectionClassed').append('svg'),
      path = "M0 0L10 10Z",
      el = svg.append('path').attr('class', 'foo');
      
  el.classed('bar', true);
  equal(el.attr('class'), 'foo bar')
});

test( "add class to existing with function", function() {
  var svg = d3.select('#selectionClassed').append('svg'),
      path = "M0 0L10 10Z",
      el = svg.append('path').attr('class', 'foo');
      
  el.classed('bar', function(){ return true; });
  equal(el.attr('class'), 'foo bar')
});


test( "remove class from existing", function() {
  var svg = d3.select('#selectionClassed').append('svg'),
      path = "M0 0L10 10Z",
      el = svg.append('path').attr('class', 'foo bar');
      
  el.classed('bar', false);
  equal(el.attr('class'), 'foo')
});


test( "remove class from existing with function", function() {
  var svg = d3.select('#selectionClassed').append('svg'),
      path = "M0 0L10 10Z",
      el = svg.append('path').attr('class', 'foo bar');
      
  el.classed('bar', function(){ return false; });
  equal(el.attr('class'), 'foo')
});
