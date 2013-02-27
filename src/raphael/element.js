function R2D3Element(paper, node, parentNode) {
  this.initialized = false;
  this.paper = paper;
  
  this.domNode = node;
  this.domNode.r2d3 = this;
  this.parentNode = parentNode;
  this.raphaelNode = null;
}


/**
 * Initializes the Raphael paper element.
 */
R2D3Element.prototype._initialize = function() {
  this.initialized = true;
  
  var paper = this.paper,
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
    
    // SVG never ready, initialized outside of element
    case: 'SVG':
      ready = false;
      break;
  }
  
  return ready;
}

/**
 * Updates an individual property. If the classname changes, all restyle
 * of the element will be triggered.
 */
R2D3Element.prototype.updateProperty = function(propertyName) {  
  if (!raphaelNode) {
    return;
  }
  
  switch(propertyName) {
    // transform, traverse up DOM to determine nested tranforms
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
    
    // Class change, update all the styles
    case: 'class':
      this.updateCurrentStyle();
      break;
      
    // Update SVG height
    case: 'height':
      if (this.raphaelNode === this.paper) {
        this.raphaelNode.setSize(this.domNode.getAttribute('width'), this.domNode.getAttribute('height'));
      }
      break;
     
    // Update SVG width 
    case: 'width':
      if (this.raphaelNode === this.paper) {
        this.raphaelNode.setSize(this.domNode.getAttribute('width'), this.domNode.getAttribute('height'));
      }
      break;
      
    // Just apply the attribute
    default:
      var value = this.domNode.style.getAttribute(name)
          || this.domNode.currentStyle.getAttribute(name)
          || this.domNode.getAttribute(name);
  }
};

/**
 * Looks up the current style applied by CSS, inline styles and attributes and
 * applies them to the raphael object. If not styles are found, the SVG defaults
 * are used for each property.
 */
R2D3Element.prototype.updateCurrentStyle = function(name) {
  var currentStyle = this.domNode.currentStyle,
      el = this.domNode;
  
  function getValue(el, name, currentStyle) {
    return el.style.getAttribute(name)
        || currentStyle.getAttribute(name)
        || el.getAttribute(name);
  }
  
  var attrs = {
    'arrow-end': getValue(el, 'arrow-end', currentStyle),
    'cursor': getValue(el, 'cursor', currentStyle),
    'fill': getValue(el, 'fill', currentStyle) || 'black',
    'fill-opacity': getValue(el, 'fill-opacity', currentStyle) || 1,
    'font': getValue(el, 'font', currentStyle),
    'font-family': getValue(el, 'font-family', currentStyle),
    'font-size': getValue(el, 'font-size', currentStyle),
    'font-weight': getValue(el, 'font-weight', currentStyle),
    'opacity': getValue(el, 'opacity', currentStyle) || 1,
    'stroke': getValue(el, 'stroke', currentStyle) || 'none',
    'stroke-dasharray': getValue(el, 'stroke-dasharray', currentStyle),
    'stroke-linecap': getValue(el, 'stroke-linecap', currentStyle)|| 'butt',
    'stroke-linejoin': getValue(el, 'stroke-linejoin', currentStyle) || 'miter',
    'stroke-miterlimit': getValue(el, 'stroke-miterlimit', currentStyle) || 4,
    'stroke-opacity': getValue(el, 'stroke-opacity', currentStyle) || 1,
    'stroke-width': getValue(el, 'stroke-width', currentStyle) || 1,
    'text-anchor': getValue(el, 'text-anchor', currentStyle) || 'start',
    'd': el.getAttribute()
  };
  
  if (name && attrs[name] === undefined) {
    attrs[name] = el.getAttribute(name);
  }

  this.attr(attrs);
};




//=====================================
// DOM APIs
//=====================================

R2D3Element.prototype.appendChild = function(node) {
  return new R2D3Element(this.paper, node, this);
}


R2D3Element.prototype.removeChild = function(node) {
  // Nullify reference to non-DOM object to prevent
  // memory leak in IE
  this.domNode.r2d3 = null;
  
  this.domNode.parentNode.removeChild(el.domNode);
  this.raphaelNode.remove();
}


R2D3Element.prototype.addEventListener = function(type, listener) {
  var self = this;
  listener._callback = function(e) {
    // Ensure the listener is invoked with 'this'
    // as the raphael node and not the window
    listener.apply(self, [e]);
  }
  
  if (this.raphaelNode.attachEvent) {
    this.raphaelNode.attachEvent("on" + type, listener._callback);
  }
};


R2D3Element.prototype.removeEventListener = function(type, listener) {
  if (this.raphaelNode.detachEvent) {
    this.raphaelNode.detachEvent("on" + type, listener._callback || listener);
  }
};


R2D3Element.prototype.setAttribute = function(name, value) {
  this.domNode.setAttribute(name, value);
  if (!this.initialized && this._ready()) {
    this._initialize();
  }
  this.updateProperty(name);
};


R2D3Element.prototype.insertBefore = function(node, before) {
  var el = node.paper ? node : new R2D3Element(this.paper, node, this)
  
  // Reposition the element on the paper
  el.raphaelInsertBefore(before);
  
  // Update the shadow DOM
  before.domNode.parentNode.insertBefore(el.domNode, before.domNode);
  return el;
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
