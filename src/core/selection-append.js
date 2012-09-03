// TODO append(node)?
// TODO append(function)?
d3_selectionPrototype.append = function(name) {
  name = d3.ns.qualify(name);

  function append() {
    // Append called from raphael element
    if (this.paper || this.raphael) {
      return appendRaphael(this.paper || this, this);
    }

    return this.appendChild(document.createElementNS(this.namespaceURI, name));
  }

  function appendNS() {
    return this.appendChild(document.createElementNS(name.space, name.local));
  }

  function appendRaphael(paper, parent) {

    var el = paper[name]();
    // Ensure that sets have a paper reference
    el.parentNode = el.paper = paper;

    // If the parent is a Raphael Set, add the element to it
    if (parent.type && parent.type === 'set') {
      parent.push(el);
    }

    return el;
  }

  return this.select(name.local ? appendNS : append);
};

