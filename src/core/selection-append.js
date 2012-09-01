// TODO append(node)?
// TODO append(function)?
d3_selectionPrototype.append = function(name) {
  name = d3.ns.qualify(name);

  function append() {
    // Append called from raphael element
    if (this.paper) {
      var el = this.paper[name]();
      el.parentNode = this.paper;
      return el;

    // Append called from raphael apper
    } else if (this.raphael) {
      var el =  this[name]();
      el.parentNode = this;
      return el;
    }

    return this.appendChild(document.createElementNS(this.namespaceURI, name));
  }

  function appendNS() {
    return this.appendChild(document.createElementNS(name.space, name.local));
  }

  return this.select(name.local ? appendNS : append);
};

