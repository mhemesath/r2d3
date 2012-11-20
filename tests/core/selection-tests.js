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
  equal(rects.node(), el.node())
});

test( "selectAll class", function() {
  var svg = d3.select('#selection').append('svg'),
      el = svg.append('rect').attr('class', 'foo'),
      rects = svg.selectAll('.foo');
      
  equal(rects.length, 1)
  equal(rects.node(), el.node())
});

test( "selectAll tagname.class", function() {
  var svg = d3.select('#selection').append('svg'),
      el = svg.append('rect').attr('class', 'foo'),
      rects = svg.selectAll('rect.foo');
      
  equal(rects.length, 1)
  equal(rects[0].node(), el.node())
});

test( "select tagname", function() {
  var svg = d3.select('#selection').append('svg'),
      el = svg.append('rect');
      
  equal(svg.select('rect').node(), el.node())
});

test('select class', function() {
  var svg = d3.select('#selection').append('svg'),
      el = svg.append('rect').attr('class', 'foo');
      
  equal(svg.select('.foo').node(), el.node())
});

test('select class', function() {
  var svg = d3.select('#selection').append('svg'),
      el = svg.append('rect').attr('class', 'foo');
      
  equal(svg.select('rect.foo').node(), el.node())
});
