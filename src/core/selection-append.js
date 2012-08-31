// TODO append(node)?
// TODO append(function)?
d3_selectionPrototype.append = function(name) {
  name = d3.ns.qualify(name);

  function append() {
    // Append called from raphael element
    if (this.paper) {
      return this.paper[name]();

    // Append called from raphael apper
    } else if (this.raphael) {
      return this[name]();
    }

    return this.appendChild(document.createElementNS(this.namespaceURI, name));
  }

  function appendNS() {
    return this.appendChild(document.createElementNS(name.space, name.local));
  }

  return this.select(name.local ? appendNS : append);
};

