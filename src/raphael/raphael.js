// getComputedStyle shim: http://johnkpaul.tumblr.com/post/17380987688/shim-for-javascript
(function(window, undefined){
  window.getComputedStylePropertyValue = function(el,cssProperty){
    el = el.domNode || el;
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
    
  for (var i=0; i< svgElements.length; i++) {
    document.createElement(svgElements[i]);
  }
})();


function appendRaphael(parent) {
  var paper =  Raphael(parent, 0, 0),
      svg = document.createElement('svg');
      
  // Create the DOM node representing the SVG docuemnt
  // This will enable us to pull in styles from the stylesheets using
  // node.currentStyle
  svg.style.display = 'none';
  parent.appendChild(svg);
  
  return new R2D3Element(paper, svg);
}