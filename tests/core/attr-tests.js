//================================
// Selection Tests
module( "Selection Attributes", {
    teardown: function() {
      document.getElementById('attr').innerHTML = '';
    }
});


test( "path.d", function() {
  var svg = d3.select('#attr').append('svg'),
      path = "M0 0L10 10Z",
      el = svg.append('path');
      
  el.attr('d', path);
  equal(el.attr('d'), path)
});

test( "path.class", function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('path');
      
  el.attr('class', 'foo');
  equal(el.attr('class'), 'foo')
});

test( "polygon.points", function() {
  var svg = d3.select('#attr').append('svg'),
      polygon = "0,0 0,10 10,10 10,0",
      el = svg.append('polygon');
      
  el.attr('points', polygon);
  equal(el.attr('points'), polygon)
});

test( "polygon.class", function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('polygon');
      
  el.attr('class', 'foo');
  equal(el.attr('class'), 'foo')
});

test( "polyline.points", function() {
  var svg = d3.select('#attr').append('svg'),
      polyline = "0,0 0,10 10,10",
      el = svg.append('polyline');
      
  el.attr('points', polyline);
  equal(el.attr('points'), polyline)
});

test( "polyline.class", function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('polyline');
      
  el.attr('class', 'foo');
  equal(el.attr('class'), 'foo')
});

test( "rect.fill", function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('rect');
      
  el.attr('fill', 'red');
  equal(el.attr('fill'), 'red')
});

test( "rect.translate", function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('rect').attr({'x': 0, 'y': 0, 'width': 100, 'height': 100 });
      
  el.attr('transform', 'translate(20,20)')
  equal(el.attr('transform'), 'translate(20,20)')
});
//================================
// Dom Attribute Tests
module("DOM id attribute", {
    teardown: function() {
      document.getElementById('attr').innerHTML = '';
    }
});

test('id', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('text');
      
  el.attr('id', 'foo');
  equal(el.attr('id'), 'foo');
  equal(d3.select('#foo').attr('id'), 'foo');
});

//================================
// Circle Tests
module( "Circle Selection Attributes", {
    teardown: function() {
      document.getElementById('attr').innerHTML = '';
    }
});

test('circle.cx', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('circle');
      
  el.attr('cx', 10);
  equal(el.attr('cx'), 10)
});

test('circle.cy', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('circle');
      
  el.attr('cy', 10);
  equal(el.attr('cy'), 10)
});

test('circle.r', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('circle');
      
  el.attr('r', 2);
  equal(el.attr('r'), 2)
});

//================================
// Rect Tests
module( "Rect Selection Attributes", {
    teardown: function() {
      document.getElementById('attr').innerHTML = '';
    }
});

test('rect.x', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('rect');
      
  el.attr('x', 10);
  equal(el.attr('x'), 10)
});

test('rect.y', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('rect');
      
  el.attr('y', 10);
  equal(el.attr('y'), 10)
});

test('rect.width', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('rect');
      
  el.attr('width', 10);
  equal(el.attr('width'), 10)
});

test('rect.height', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('rect');
      
  el.attr('height', 10);
  equal(el.attr('height'), 10)
});

//================================
// Line Tests
module( "Line Selection Attributes", {
    teardown: function() {
      document.getElementById('attr').innerHTML = '';
    }
});

test('line.x1', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('line');
      
  el.attr('x1', 10);
  equal(el.attr('x1'), 10)
});

test('line.y1', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('line');
      
  el.attr('y1', 10);
   equal(el.attr('y1'), 10)
});

test('line.x2', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('line');
      
  el.attr('x2', 10);
  equal(el.attr('x2'), 10)
});

test('line.y2', function() {
  var svg = d3.select('#attr').append('svg'),
      el = svg.append('line');
      
  el.attr('y2', 10);
  equal(el.attr('y2'), 10)
});
