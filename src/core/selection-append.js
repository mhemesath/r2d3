// TODO append(node)?
// TODO append(function)?
d3_selectionPrototype.append = function(name) {
  name = d3.ns.qualify(name);

  function append() {
    // Append called from raphael element
    if (this.paper || this.raphael) {
      return appendRaphaelElement(this.paper || this, this);

    // Use Raphael to render SVG elements
    } else if (name.local === 'svg') {
      return appendRaphael(this);
    }


    return this.appendChild(document.createElementNS(this.namespaceURI, name));
  }

  function appendNS() {
    // Append called from raphael element
    if (this.paper || this.raphael) {
      return appendRaphaelElement(this.paper || this, this);

    // Use Raphael to render SVG elements
    } else if (name.local === 'svg') {
      return appendRaphael(this);
    }

    return this.appendChild(document.createElementNS(name.space, name.local));
  }

  function lineAttribute(name) {
    return function(value) {
      var attrs = this.data('lineAttrs');

      // Isn't a line, return;
      if (!attrs) return;

      if (arguments.length < 1) {
        return attrs[name];
      }

      attrs[name] = parseInt(value, 10);
      if (!isNaN(attrs.x1) && !isNaN(attrs.y1) && !isNaN(attrs.x2) && !isNaN(attrs.y2)) {
        this.attr('path', 'M' + attrs.x1 + ' ' + attrs.y1 + 'L' + attrs.x2 + ' ' + attrs.y2 + 'Z');
      } else {
        this.attr('path', null);
      }
    };
  }

  function appendRaphael(parent) {
    var paper =  Raphael(parent, 0, 0);

    paper.__attrs = { width: 0, height: 0 };

    paper.ca.d = function(path) {
      return { path: path };
    };

    paper.ca.x1 = lineAttribute('x1');
    paper.ca.x2 = lineAttribute('x2');
    paper.ca.y1 = lineAttribute('y1');
    paper.ca.y2 = lineAttribute('y2');

    // Fool sizzle into thinking the paper is an element
    paper.nodeType = 1;
    paper.nodeName = 'object';

    return paper;
  }


  function appendRaphaelElement(paper, parent) {

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

