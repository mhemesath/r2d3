// type can be namespaced, e.g., "click.foo"
// listener can be null for removal
d3_raphael_selectionPrototype.on = function(type, listener, capture) {
  if (arguments.length < 3) capture = false;

  // remove the old event listener, and add the new event listener
  return this.each(function(d, i) {
    var node = this;

    node[type](l);

    // wrapped event listener that preserves i
    function l(e) {
      var o = d3.event; // Events can be reentrant (e.g., focus).
      d3.event = e;
      try {
        listener.call(node, node.__data__, i);
      } finally {
        d3.event = o;
      }
    }
  });
};
