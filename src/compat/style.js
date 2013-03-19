if (window.CSSStyleDeclaration) {
  window.CSSStyleDeclaration.prototype.getProperty = function(a) {
    return this.getAttribute(a);
  };

  window.CSSStyleDeclaration.prototype.setProperty = function(a,b) {
    return this.setAttribute(a,b);
  };

  window.CSSStyleDeclaration.prototype.removeProperty = function(a) { 
    return this.removeAttribute(a);
  };
}
