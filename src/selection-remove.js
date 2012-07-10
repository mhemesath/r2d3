d3_raphael_selectionPrototype.remove = function() {
  return this.each(function() {
    this.remove();
  });
};
