d3_selectionPrototype.text = function(value) {

  var node = this.node();
  // For raphael elements get/set text through paper.
  if (node && node.r2d3) {
    return arguments.length < 1
        ? node.attr('text') : this.each(typeof value === "function"
        ? function() { var v = value.apply(this, arguments); node.r2d3.setAttribute('text', v == null ? "" : v); } : value == null
        ? function() { node.r2d3.setAttribute('text', ''); }
        : function() { node.r2d3.setAttribute('text', value); });
  }

  return arguments.length < 1
      ? this.node().textContent : this.each(typeof value === "function"
      ? function() { var v = value.apply(this, arguments); this.textContent = v == null ? "" : v; } : value == null
      ? function() { this.textContent = ""; }
      : function() { this.textContent = value; });
};
