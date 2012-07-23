d3_raphael_selectionPrototype.toFront = function() {
  return this.each(function() {
    this.toFront();
  });
};
