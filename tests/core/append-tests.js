module( "Selection Append", {
    teardown: function() {
      document.getElementById('append').innerHTML = '';
    }
});


test( "SVG", function() {
  var svg = d3.select('#append').append('svg');
  ok(svg.node().paper, "Raphael paper appended to DOM" );
  svg.remove();
});

test('image', function() {
  var svg = d3.select('#append').append('svg');
   var el = svg.append('image');
   ok(el.node().domNode.tagName, 'image');
});

test('line', function() {
  var svg = d3.select('#append').append('svg');
   var el = svg.append('line');
   ok(el.node().domNode.tagName, 'line');
});

test('path', function() {
  var svg = d3.select('#append').append('svg');
   var el = svg.append('path');
   ok(el.node().domNode.tagName, 'path');
});

test('polygon', function() {
  var svg = d3.select('#append').append('svg');
   var el = svg.append('polygon');
   ok(el.node().domNode.tagName, 'polygon');
});

test('polyline', function() {
  var svg = d3.select('#append').append('svg');
   var el = svg.append('polyline');
   ok(el.node().domNode.tagName, 'polyline');
});

test('rect', function() {
  var svg = d3.select('#append').append('svg');
   var el = svg.append('rect');
   ok(el.node().domNode.tagName, 'rect');
});

test('circle', function() {
  var svg = d3.select('#append').append('svg');
   var el = svg.append('circle');
   ok(el.node().domNode.tagName, 'circle');
});

test('text', function() {
  var svg = d3.select('#append').append('svg');
   var el = svg.append('text');
   ok(el.node().domNode.tagName, 'text');
});
