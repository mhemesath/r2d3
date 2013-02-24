// getComputedStyle shim: http://johnkpaul.tumblr.com/post/17380987688/shim-for-javascript
(function(window, undefined){
  window.getComputedStylePropertyValue = function(el,cssProperty){
    el = el.shadowDom || el;
    if(!window.getComputedStyle){
      if(document.defaultView && document.defaultView.getComputedStyle){
        return document.defaultView.getComputedStyle.getPropertyValue(cssProperty);
      } else {
        var camelCasedCssProperty = getCamelCasedCssProperty(cssProperty);
        if(el.currentStyle){
          return el.currentStyle(camelCasedCssProperty);
        } else {
          return el.style[camelCasedCssProperty];
        }
      }
    } else{
      return window.getComputedStyle(el).getPropertyValue(cssProperty);
    }      
  }
  
  function getCamelCasedCssProperty(cssProperty){
    return cssProperty.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() });
  }
  
})(this);



// Register SVG elements with IE so they can be styled
(function() {
  var svgElements = 'circle ellipse line polygon polyline rect g svg image path text'.split(' '); 
    
  if (Raphael.svg) return;
  for (var i=0; i< svgElements.length; i++) {
    document.createElement(svgElements[i]);
  }
})();


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
  
  paper.shadowDom = document.createElement('svg');
  paper.shadowDom.style.display = 'none';
  parent.appendChild(paper.shadowDom);
  
  paper.shadowDom.height = 0;
  paper.shadowDom.width = 0;

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
  paper.style = paper.shadowDom.style;

  paper.r2d3Elements = {};

  return paper;
}

//========================================
// Paper Extensions

Raphael.fn.removeChild = function(el) {
  el.shadowDom.parentNode.removeChild(el.shadowDom)
  el.remove();
};


Raphael.fn.line = function () {
  var line =  this.path();
  line.data('lineAttrs', { x1: 0, y1: 0, x2: 0, y2: 0 });
  return line;
};


Raphael.fn.img = function() {
  // IE8 turns image nodes into img
  return this.image();
};


Raphael.fn.g = function() {
  return this.set();
};


Raphael.fn.getAttribute = function(name) {
  return this.shadowDom.getAttribute(name);
};


Raphael.fn.setAttribute = function(name, value) {
  this.shadowDom.setAttribute(name, value);
  
  if (name === 'height' || name === 'width') {
    this.setSize(this.shadowDom.getAttribute('width'), this.shadowDom.getAttribute('height'));
  }
};


Raphael.fn.getElementsByClassName = function(selector) {
  return this.getR2D3Elements(Sizzle(selector, this.shadowDom));
};


Raphael.fn.getElementsByTagName = function(tag) {
  return this.getR2D3Elements(this.shadowDom.getElementsByTagName(tag));
};


Raphael.fn.appendChild = function(childNode) {
  this.shadowDom.appendChild(childNode);
  return this.buildElement(childNode);;
};


Raphael.fn.buildElement = function(childNode) {
  var type = childNode && childNode.nodeName,
      node =  type ? this[type.toLowerCase()]() : null;
      

  // Ensure Paper can be referenced from sets
  node.shadowDom = childNode
  node.parentNode = this;
  // Link the shadowDOM node by the Raphael id.
  node.shadowDom.r2d3id = r2d3UID();
  node.paper = this;
  node.tagName = type.toLowerCase();
	node.style = node.shadowDom.style;
  
  r2d3Elements[node.shadowDom.r2d3id] = node;
  
  node.updateCurrentStyle();
  
  node.shadowDom.onpropertychange = function() {
    node.updateProperty(event.propertyName);
  }

  return node;
}

Raphael.fn.getR2D3Elements = function(domNodes) {
  var r2d3Matches = [];
  
  // Convert DOM matches to R2D3 elements
  for (var i=0; i<domNodes.length; i++) {
    var element = r2d3Elements[domNodes[i].id];
    if (element) {
      r2d3Matches.push(element);
    }
  }
  
  return r2d3Matches;
}

var r2d3Elements = {};

var r2d3UID = (function() {
  var id = 0;
  return function() {
    return id++;
  };
}());

