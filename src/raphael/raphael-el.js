
//========================================
// Element Extensions
Raphael.el.appendChild = function() {
  // Append child is a no-op. AFAIK appending on a
  // element other than group or SVG is used for things like
  // title
  return this;
}


Raphael.el.addEventListener = function(type, listener) {
  var self = this;
  listener._callback = function(e) {
    // Ensure the listener is invoked with 'this'
    // as the raphael node and not the window
    listener.apply(self, [e]);
  }
  
  if (this.node.attachEvent) {
    this.node.attachEvent("on" + type, listener._callback);
  }
};


Raphael.el.removeEventListener = function(type, listener) {
  if (this.node.detachEvent) {
    this.node.detachEvent("on" + type, listener._callback || listener);
  }
};


Raphael.el.setAttribute = function(name, value) {
  this.shadowDom.setAttribute(name, value);
  this.updateProperty(name);
};

// Save off old insertBefore API
Raphael.el.raphaelInsertBefore = Raphael.el.insertBefore;

Raphael.el.insertBefore = function(node, before) {
  var el = node.paper ? node : this.paper.buildElement(node);
  
  // Reposition the element on the paper
  el.raphaelInsertBefore(before);
  
  // Update the shadow DOM
  before.shadowDom.parentNode.insertBefore(el.shadowDom, before.shadowDom);
    return el;
};


Raphael.el.setAttributeNS = function(namespace, name, value) {
  this.shadowDom.setAttribute(name, value);
};


Raphael.el.removeAttribute = function(name) {
  this.shadowDom.removeAttribute(name);
};

Raphael.el.getAttribute = function(name) {
	return this.shadowDom.getAttribute(name);
};

Raphael.el.updateCurrentStyle = function(name) {
  var currentStyle = this.shadowDom.currentStyle,
      el = this.shadowDom;
  
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

/**
 * Updates the style for a given property honoring style
 */
Raphael.el.updateProperty = function(name) {  
  if (name === "transform") {
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
  } else if (name === 'class') {
    this.updateCurrentStyle();
  } else  {
    var value = this.shadowDom.style.getAttribute(name)
        || this.shadowDom.currentStyle.getAttribute(name)
        || this.shadowDom.getAttribute(name);
            
    this.attr(name, value);
  }
};
