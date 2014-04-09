d3.mouse = function(container) {
  return d3_mousePoint(container, d3_eventSource());
};

function d3_mousePoint(container, e) {
  var bnds = container.paper.canvas.getBoundingClientRect();
  var containerBBox = container.raphaelNode.getBBox();
  return [e.clientX - bnds.left - containerBBox.x, e.clientY - bnds.top - containerBBox.y];
};
