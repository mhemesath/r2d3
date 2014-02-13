d3_selectionPrototype.text = function(value) {

  // For raphael elements get/set text through paper.
  if (this.node() && this.node().paper) {
    return arguments.length < 1
        ? this.node().getAttribute('text') : this.each(typeof value === "function"
        ? function() { var v = value.apply(this, arguments); this.setAttribute('text', v == null ? "" : v); } : value == null
        ? function() { this.setAttribute('text', ''); }
        : function() { this.setAttribute('text', value); });
  }

  // Replaced instances of "textContent" to "innerText", since textContent isn't supported in IE 7/8.
  return arguments.length < 1
      ? this.node().innerText : this.each(typeof value === "function"
      ? function() { var v = value.apply(this, arguments); this.innerText = v == null ? "" : v; } : value == null
      ? function() { this.innerText = ""; }
      : function() { this.innerText = value; });
};
