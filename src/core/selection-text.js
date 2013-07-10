d3_selectionPrototype.text = function(value) {

  // For raphael elements get/set text through paper.
  if (this.node() && this.node().paper) {
    return arguments.length < 1
        ? this.node().getAttribute('text') : this.each(typeof value === "function"
        ? function() { var v = value.apply(this, arguments); this.setAttribute('text', v == null ? "" : v); } : value == null
        ? function() { this.setAttribute('text', ''); }
        : function() { this.setAttribute('text', value); });
  }

  return arguments.length < 1
      ? this.node().textContent : this.each(typeof value === "function"
      ? function() { var v = value.apply(this, arguments); this.textContent = v == null ? "" : v; } : value == null
      ? function() { this.textContent = ""; }
      : function() { this.textContent = value; });
};
