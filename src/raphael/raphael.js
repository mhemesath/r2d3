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




function appendRaphael(parent) {
  var paper =  Raphael(parent, 0, 0);
  
  paper.domNode = document.createElement('svg');
  paper.domNode.style.display = 'none';
  parent.appendChild(paper.domNode);
  
  paper.domNode.height = 0;
  paper.domNode.width = 0;

  // Fool sizzle into thinking the paper is an element
  paper.style = paper.domNode.style;

  return paper;
}

//========================================
// Paper Extensions

Raphael.fn.removeChild = function(el) {
  // Remove reference to r2d3 element
  // to prevent IE memory leaks
  el.element.r2d3 = null;
  
  el.element.parentNode.removeChild(el.element)
  el.remove();
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


Raphael.fn.appendChild = function(childNode) {
  var element new Element(childNode);
  element.parentNode = this;
  
  return element;
};


Raphael.fn.getR2D3Elements = function(domNodes) {
  var r2d3Nodes = new Array(domNodes.length);
  // Convert DOM matches to R2D3 elements
  for (var i=0; i<domNodes.length; i++) {
    var node = domNodes[i];
    if (node.r2d3 !== undefined) {
      r2d3Matches.push(node.r2d3);
    }
  }
  return r2d3Nodes;
}

