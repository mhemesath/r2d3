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
});
