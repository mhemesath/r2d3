function R2D3Element(paper, node) {
  // Raphael Paper object
  this.paper = paper;
  
  // The SVG DOM node representing the Raphael element
  // This is used as a hook for querying and styling
  this.domNode = node;
  
  // Reference back to the R2D3 element wrapper
  this.domNode.r2d3 = this;
  
  // Reference to the rendered Raphael element
  // Initialization is delayed until all required props
  // are set
  this.raphaelNode = null;
  
  // Reference to the parent R2D3 element
  this.parentNode = node.parentNode.r2d3;
}


/**
 * Initializes the Raphael paper element.
 */
R2D3Element.prototype._initialize = function() {

  var paper = this.paper,
      domNode = this.domNode;
  
  switch(this.domNode.tagName) {
    case 'path':
      this.raphaelNode = paper.path(domNode.getAttribute('d'));
      break;
      
    case 'rect':
      var x = domNode.getAttribute('x') || 0,
          y = domNode.getAttribute('y') || 0,
          width = domNode.getAttribute('width'),
          height = domNode.getAttribute('height');
          
      this.raphaelNode = paper.rect(x, y, width, height);
      break;
      
    case 'circle':
      var cx = domNode.getAttribute('cx') || 0,
          cy = domNode.getAttribute('cy') || 0,
          r = domNode.getAttribute('r');
          
      this.raphaelNode = paper.circle(cx, cy, r);
      break;

    // Groups don't have a raphael representation
    case 'g':
      this.isGroup = true;
      break;
      
    // Lines dont' exist in Raphael,
    // so we represent it as a path instead
    case 'line':
      this.raphaelNode = paper.path(this._linePath());
      break;
      
    // IE converts image to img
    case 'IMG':
      var x = domNode.getAttribute('x') || 0,
          y = domNode.getAttribute('y') || 0,
          width = domNode.getAttribute('width') || 0,
          height = domNode.getAttribute('height') || 0,
          href = domNode.getAttribute('href');
        
      this.raphaelNode = paper.image('http://placekitten.com/50/50', 5, 5, 50, 50);
      break;
      
    // x, y default to 0
    case 'text':
      var x = domNode.getAttribute('x') || 0,
          y = domNode.getAttribute('y') || 0,
          text = domNode.getAttribute('text');
      
      this.raphaelNode = paper.text(x, y, text);
      break;
    
    // cx, cy default to 0
    case 'ellipse':
      var cx = domNode.getAttribute('cx') || 0,
          cy = domNode.getAttribute('cy') || 0,
          rx = domNode.getAttribute('rx') || 0,
          ry = domNode.getAttribute('ry') || 0;
      
      this.raphaelNode = paper.ellipse(cx, cy, rx, ry);
      break;
    
    case 'svg':
      this.raphaelNode = null;
      this.isSVG = true;
  }
  
  this.initialized = true;
  this.updateCurrentStyle();
  this.updateProperty('transform');
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
  
  switch(this.domNode.tagName) {
    case 'path':
      ready = this.domNode.getAttribute('d');
      break;
      
    // x, y default to 0
    case 'rect':
      ready = this.domNode.getAttribute('width') !== undefined
           && this.domNode.getAttribute('height') !== undefined;
      break;
      
    // cx, cy default to 0
    case 'circle':
      ready = this.domNode.getAttribute('r') !== undefined;
      break;
      
    case 'g':
      ready = true;
      break;
      
    // x1,y1,x2,y2 all default to 0
    case 'line':
      ready = true;
      break;
      
    // x, y default to 0
    case 'text':
      ready = this.domNode.getAttribute('text');
      break;
    
    // cx, cy default to 0
    case 'ellipse':
      ready = this.domNode.getAttribute('rx') !== undefined
           && this.domNode.getAttribute('ry') !== undefined;
      break;
  
    // IE converts image to img
    // Technically width/height are defaulted to 0, but the image won't
    // render until they are present so might as well wait till they are set
    case 'IMG':
      this.isImage = true;
      ready = this.domNode.getAttribute('href') !== undefined
           && this.domNode.getAttribute('width') !== undefined
           && this.domNode.getAttribute('height') !== undefined;
      break;
      
    case 'svg':
      ready = true;
      break;
  }
  
  return ready;
}


R2D3Element.prototype._linePath = function() {
  var x1 = this.domNode.getAttribute('x1') || 0,
      x2 = this.domNode.getAttribute('x2') || 0,
      y1 = this.domNode.getAttribute('y1') || 0,
      y2 = this.domNode.getAttribute('y2') || 0;
          
  return ['M', x1, ' ', y1, 'L', x2, ' ', y2, 'Z'].join('');
}


/**
 * Updates an individual property. If the classname changes, all restyle
 * of the element will be triggered.
 */
R2D3Element.prototype.updateProperty = function(propertyName) {  
  if (!this.initialized) {
    return;
  }
  
  switch(propertyName) {
    // transform, traverse up DOM to determine nested tranforms
    case 'transform':
      var transforms = new Array(10), // assume 10 > depth
          node = this.domNode,
          index = 0;
          
      transforms[index++] = node.getAttribute('transform');
      
      while(node.parentNode && node.r2d3) {
        node = node.parentNode;
        transforms[index++] = node.getAttribute('transform');
      }
      
      if (this.isGroup) {
        var childNodes = this.domNode.childNodes;
        for (var i=0; i < childNodes.length; i++) {
          childNodes[i].r2d3.updateProperty('transform');
        }
      }
      
      if (this.raphaelNode) {
        this.raphaelNode.attr('transform', transforms.reverse().join(''));
      }
      break
    
    // Class change, update all the styles
    case 'class':
      this.updateCurrentStyle();
      break;
      
    // Update SVG height
    case 'height':
      var width = this.domNode.getAttribute('width') || 0,
          height = this.domNode.getAttribute('height') || 0;
      if (this.domNode.tagName === 'svg') {
        this.paper.setSize(width, height);
      } else {
        this.raphaelNode.attr('height', height);
      }
      break;
     
    // Update SVG width 
    case 'width':
      var width = this.domNode.getAttribute('width') || 0,
          height = this.domNode.getAttribute('height') || 0;
      if (this.domNode.tagName === 'svg') {
        this.paper.setSize(width, height);
      } else {
        this.raphaelNode.attr('width', width);
      }
      break;
      
    case 'href':
      this.raphaelNode.attr('src', this.domNode.getAttribute('href'));
      break;
    
    // Paths map d to raphael path attribute
    case 'd':
      this.raphaelNode.attr('path', this.domNode.getAttribute('d'));
      break;
      
    // Line Attributes need to rebuild path representing line
    case 'x1':
      this.raphaelNode.attr('path', this._linePath());
      break;
    case 'x2':
      this.raphaelNode.attr('path', this._linePath());
      break;
    case 'y1':
      this.raphaelNode.attr('path', this._linePath());
      break;
    case 'y2':
      this.raphaelNode.attr('path', this._linePath());
      break;
      
    // Just apply the attribute
    default:
      if (this.raphaelNode) {
        var value = this.domNode.style.getAttribute(propertyName)
            || this.domNode.currentStyle.getAttribute(propertyName)
            || this.domNode.getAttribute(propertyName);
        this.raphaelNode.attr(propertyName, value);
      }
  }
};

/**
 * Looks up the current style applied by CSS, inline styles and attributes and
 * applies them to the raphael object. If not styles are found, the SVG defaults
 * are used for each property.
 */
R2D3Element.prototype.updateCurrentStyle = function(name) {
  
  function getValue(el, name, currentStyle) {
    return el.style.getAttribute(name)
        || currentStyle.getAttribute(name)
        || el.getAttribute(name);
  }
  
  var currentStyle = this.domNode.currentStyle,
      el = this.domNode;
  
  // SVG can have the size set via CSS
  if (this.isSVG) {
    var height = getValue(el, 'height', currentStyle),
        width = getValue(el, 'width', currentStyle);
    
    // If the browser returns auto, default to using the attribute height/width    
    height = height === 'auto' ? el.getAttribute('height') : height;
    width = width === 'auto' ? el.getAttribute('width') : width;
        
    this.paper.setSize(width || 0, height || 0);
  }
  
  // Groups don't have raphael nodes
  if (!this.raphaelNode) {
    return;
  }
  
  var attrs = {
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
    'text-anchor': getValue(el, 'text-anchor', currentStyle) || 'start'
  };
  
  if (name && attrs[name] === undefined) {
    attrs[name] = el.getAttribute(name);
  }
  
  if (this.isImage) {
    // Images wont render in raphael if fill set
    delete attrs['fill'];
  }

  this.raphaelNode.attr(attrs);
};

R2D3Element.prototype.setStyleProperty = function(name, value) {
  this.domNode.style.setAttribute(name, value);
  this.updateProperty(name);
};

R2D3Element.prototype.getStyleProperty = function(name) {
  return this.domNode.style.getAttribute(name);
};

R2D3Element.prototype.removeStyleProperty = function(name) {
  this.domNode.style.removeAttribute(name);
  this.updateProperty(name);
}




//=====================================
// DOM APIs
//=====================================

R2D3Element.prototype.appendChild = function(node) {
  if (node.r2d3) {
    // TODO: Reposition raphael paper node
    return node.r2d3;
  }
  

  this.domNode.appendChild(node);
  return new R2D3Element(this.paper, node);
}


R2D3Element.prototype.removeChild = function(node) {
  // Nullify reference to non-DOM object to prevent
  // memory leak in IE
  node.domNode.r2d3 = null;
  this.domNode.removeChild(node.domNode);
    
  if (node.raphaelNode) {
    node.raphaelNode.remove();
  }
}


R2D3Element.prototype.addEventListener = function(type, listener) {
  
  // If the raphael node isn't constructed yet, force it to initialize
  // so we can attach the event to it
  if (!this.raphaelNode) {
    this._initialize();
  }
  
  var self = this;
  if (!listener._callback) {
    listener._callback = function(e) {
      // Ensure the listener is invoked with 'this'
      // as the raphael node and not the window
      listener.apply(self, [e]);
    }
  }
  
  // Groups don't exist, bind the events to the children directly
  if (this.isGroup) {
    for (var i=0; i < this.domNode.childNodes; i++) {
      this.domNode.childNodes[i].r2d3.addEventListener(type, listener);
    }
    
  // Bind directly to the raphael node
  } else {
    if (this.isSVG) {
      this.domNode.parentNode.attachEvent("on" + type, listener._callback)
    } else {
      this.raphaelNode.node.attachEvent("on" + type, listener._callback);
    }
  }
};


R2D3Element.prototype.removeEventListener = function(type, listener) {  
  // Groups don't exist, bind the events to the children directly
  if (this.isGroup) {
    for (var i=0; i < this.domNode.childNodes; i++) {
      this.domNode.childNodes[i].r2d3.removeEventListener(type, listener);
    }
    
  // Bind directly to the raphael node
  } else {
    if (this.isSVG) {
      this.domNode.parentNode.detachEvent("on" + type, listener._callback || listener)
    } else {
      this.raphaelNode.node.detachEvent("on" + type, listener._callback || listener);
    }
  }  
};


R2D3Element.prototype.setAttribute = function(name, value) {
  this.domNode.setAttribute(name, value);
  if (!this.raphaelNode && this._ready()) {
    this._initialize();
  }
  this.updateProperty(name);
};


R2D3Element.prototype.insertBefore = function(node, before) {
  // Before will be the R2D3Element, if it exists
  this.domNode.insertBefore(node, before ? before.domNode : before);
  
  
  var el = node.r2d3 ? node : new R2D3Element(this.paper, node);
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

R2D3Element.prototype.getBBox = function() {
  if (this.raphaelNode) {
    return this.raphaelNode.getBBox();
  }
  
  return { x: 0, y: 0, width: 0, height: 0 }
}