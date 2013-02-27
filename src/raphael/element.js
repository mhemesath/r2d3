function R2D3Element(paper, node) {
  this.initialized = false;
  this.paper = paper;
  
  this.domNode = node;
  this.domNode.r2d3 = this;
  
  this.raphaelNode = null;
}


/**
 * Initializes the Raphael paper element.
 */
R2D3Element.prototype._initialize = function() {
  this.initialized = true;
  
  var paper = this.paperm
      domNode = this.domNode;
  
  switch(this.domNode.nodeName) {
    case: 'PATH':
      this.raphaelNode = paper.path(domNode.getAttribute('d'));
      break;
      
    case: 'RECT':
      var x = domNode.getAttribute('x') || 0,
          y = domNode.getAttribute('y') || 0,
          width = domNode.getAttribute('width'),
          height = domNode.getAttribute('height');
          
      this.raphaelNode = paper.rect(x, y, width, height);
      break;
      
    case: 'CIRCLE':
      var cx = domNode.getAttribute('cx') || 0,
          cy = domNode.getAttribute('cy') || 0,
          r = domNode.getAttribute('r');
          
      this.raphaelNode = paper.rect(cx, cy, r);
      break;

    // Groups don't have a raphael representation
    case: 'G':
      break;
      
    // Lines dont' exist in Raphael,
    // so we represent it as a path instead
    case: 'LINE':
      var x1 =  domNode.getAttribute('x1') || 0,
          x2 = domNode.getAttribute('x2') || 0,
          y1 = domNode.getAttribute('x2') || 0,
          y2 = domNode.getAttribute('x2') || 0;
          
      this.raphaelNode = paper.path(['path', 'M', x1, ' ', y1, 'L', x2, ' ', y2, 'Z'].join(''));
      break;
      
      
    // x, y default to 0
    case: 'TEXT':
      var x = domNode.getAttribute('x') || 0,
          y = domNode.getAttribute('y') || 0;
          text = domNode.getAttribute('text');
      
      this.raphaelNode = paper.text(x, y, text);
      break;
    
    // cx, cy default to 0
    case: 'ELLIPSE':
      var cx =  domNode.getAttribute('cx') || 0,
          cy = domNode.getAttribute('cy') || 0,
          rx = domNode.getAttribute('rx') || 0,
          ry = domNode.getAttribute('ry') || 0;
      
      this.raphaelNode = paper.ellipse(cx, cy, rx, ry);
      break;
  }
}

/**
 * Indicates whether or not the Raphael paper element
 * has enough attributes set to be drawn. 
 *
 * Note: This provides a minor performance improvement as we dont' end
 * up drawing some elements then immediately redrawing them when their
 * path or text is set.
 */
R2D3Element.prototype._ready = function() {
  var ready = false;
  
  switch(this.nodeName) {
    case: 'PATH':
      ready = this.domNode.getAttribute('d');
      break;
      
    // x, y default to 0
    case: 'RECT':
      ready = this.domNode.getAttribute('width')
          && this.domNode.getAttribute('height');
      break;
      
    // cx, cy default to 0
    case: 'CIRCLE':
      ready = this.domNode.getAttribute('r');
      break;
      
    case: 'G':
      ready = true;
      break;
      
    // x1,y1,x2,y2 all default to 0
    case: 'LINE':
      ready = true;
      break;
      
    // x, y default to 0
    case: 'TEXT':
      ready = this.domNode.getAttribute('text');;
      break;
    
    // cx, cy default to 0
    case: 'ELLIPSE':
      ready = this.domNode.getAttribute('rx')
           && this.domNode.getAttribute('ry');
      break;
  }
  
  return ready;
}

R2D3Element.prototype.updateProperty = function(propertyName) {  
  if (!raphaelNode) {
    return;
  }
  
  switch(propertyName) {
    case: 'transform':
      var transforms = new Array(10), // assume 10 > depth
          node = this.shadowDom,
          index = 0;
          
      transforms[index++] = node.getAttribute('transform');
      
      while(node.parentNode) {
        node = node.parentNode;
        transforms[index++] = node.getAttribute('transform');
        if (node.tagName === 'svg') {
          break;
        }
      }
      
      this.attr('transform', transforms.reverse().join(''));
      break
    
    case: 'class':
      this.updateCurrentStyle();
      break;
      
    default:
      var value = this.shadowDom.style.getAttribute(name)
          || this.shadowDom.currentStyle.getAttribute(name)
          || this.shadowDom.getAttribute(name);
  }
};




R2D3Element.prototype.appendChild = function() {
}


R2D3Element.prototype.addEventListener = function(type, listener) {
};


R2D3Element.prototype.removeEventListener = function(type, listener) {
};


R2D3Element.prototype.setAttribute = function(name, value) {
  this.domNode.setAttribute(name, value);
  if (!this.initialized && this._ready()) {
    this._initialize();
  }
  this.updateProperty(name);
};


R2D3Element.prototype.insertBefore = function(node, before) {

};


R2D3Element.prototype.setAttributeNS = function(namespace, name, value) {
  this.setAttribute(name, value);
};


R2D3Element.prototype.removeAttribute = function(name) {
  this.domNode.removeAttribute(name);
  this.updateProperty(name);
};


R2D3Element.prototype.getAttribute = function(name) {
  return this.domNode.getAttribute(name);
};
