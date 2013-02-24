
//========================================
// Element Extensions
Raphael.el.appendChild = function() {
  // Append child is a no-op. AFAIK appending on a
  // element other than group or SVG is used for things like
  // title
  return this;
}


Raphael.el.addEventListener = function(type, listener) {
  if (this.node.addEventListener) {
    this.node.addEventListener(type, listener, false);
  } else if (this.node.attachEvent) {
    this.node.attachEvent("on" + type, listener);
  } else {
    throw "Found neither addEventListener nor attachEvent";
  }
};


Raphael.el.removeEventListener = function(type, listener) {
  if (this.node.removeEventListener) {
    this.node.removeEventListener(type, listener, false);
  } else if (this.node.detachEvent) {
    this.node.detachEvent("on" + type, listener);
  } else {
    throw "Found neither removeEventListener nor detachEvent";
  }
};


Raphael.el.setAttribute = function(name, value) {
  this.shadowDom.setAttribute(name, value);
  this.updateCurrentStyle();
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

Raphael.el.updateCurrentStyle = function() {
  var currentStyle = this.shadowDom.currentStyle,
      opacity = currentStyle.getAttribute('opacity'),
      strokeOpacity = currentStyle.getAttribute('stroke-opacity');
  
  this.attr({
    'arrow-end': currentStyle.getAttribute('arrow-end'),
    'cursor': currentStyle.getAttribute('cursor'),
    'fill': currentStyle.getAttribute('fill') || 'black',
    'fill-opacity': 1,
    'font': currentStyle.getAttribute('font'),
    'font-family': currentStyle.getAttribute('font-family'),
    'font-size': currentStyle.getAttribute('font-size'),
    'font-weight': currentStyle.getAttribute('font-weight'),
    'opacity': 1,
    'stroke': currentStyle.getAttribute('stroke') || 'black',
    'stroke-dasharray': currentStyle.getAttribute('stroke-dasharray'),
    'stroke-linecap': currentStyle.getAttribute('stroke-linecap') || 'butt',
    'stroke-linejoin': currentStyle.getAttribute('stroke-linejoin') || 'miter',
    'stroke-miterlimit': currentStyle.getAttribute('stroke-miterlimit') || 4,
    'stroke-opacity': 1,
    'stroke-width': currentStyle.getAttribute('stroke-width') || 1,
    'text-anchor': currentStyle.getAttribute('text-anchor') || 'start'
  });
};

/**
 * Updates the style for a given property honoring style
 */
Raphael.el.updateProperty = function(name) {
  name = name.split('.');
  name = name[name.length-1];
  
  
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
    return
  }
  
  var attr = this.shadowDom.getAttribute(name),
      style = this.shadowDom.style.getAttribute(name);
      
  attr = attr === '' ? null : attr;
  style = style === '' ? null : style;
  
  this.attr(name, style || attr);
};
