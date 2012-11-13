module( "Selection", {
    teardown: function() {
      document.getElementById('selection').innerHTML = '';
    }
});


test( "selectAll tagname", function() {
  var svg = d3.select('#selection').append('svg'),
      el = svg.append('rect'),
      rects = svg.selectAll('rect');
      
  equal(rects.length, 1)
  equal(rects[0].id, el.id)
});

test( "selectAll class", function() {
  var svg = d3.select('#selection').append('svg'),
      el = svg.append('rect').attr('class', 'foo'),
      rects = svg.selectAll('.foo');
      
  equal(rects.length, 1)
  equal(rects[0].id, el.id)
});

test( "selectAll tagname.class", function() {
  var svg = d3.select('#selection').append('svg'),
      el = svg.append('rect').attr('class', 'foo'),
      rects = svg.selectAll('rect.foo');
      
  equal(rects.length, 1)
  equal(rects[0].id, el.id)
});

test( "select tagname", function() {
  var svg = d3.select('#selection').append('svg'),
      el = svg.append('rect');
      
  equal(svg.select('rect').id, el.id)
});

test('select class', function() {
  var svg = d3.select('#selection').append('svg'),
      el = svg.append('rect').attr('class', 'foo');
      
  equal(svg.select('.foo').id, el.id)
});

test('select class', function() {
  var svg = d3.select('#selection').append('svg'),
      el = svg.append('rect').attr('class', 'foo');
      
  equal(svg.select('rect.foo').id, el.id)
});
