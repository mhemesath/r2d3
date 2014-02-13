module( "Style", {
  teardown: function () {
    document.getElementById('style').innerHTML = '';
  }
});

test("path styling", function () {
  var svg = d3.select('#style').append('svg'),
      el = svg.append('path');

 // default stroke-width for SVG
  equal(el.style('stroke-width'), 1);
});

test("text styling", function () {
  var svg = d3.select('#style').append('svg'),
      el = svg.append('text');

  // 400 == font-weight: normal
  equal(el.style('font-weight'), 400);
  equal(el.style('font-size'), '12pt');
});

asyncTest("div style and transition", function() {
  var div = d3.select('#style').append('div');

  div.style('width', '100px');
  equal(div.style('width'), '100px');

  div.transition().style('width', '1000px');

  setTimeout(function() {
    start();
    equal(div.style('width'), '1000px');
  }, 500);
});
