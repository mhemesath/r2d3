// TODO append(node)?
// TODO append(function)?

/**
 * Gives IE a performance boost on creating elements from clone
 * rather than from scratch.
 */
var createElementFromCache = (function() {
  var cache = {},
      fragmentDiv = document.createElement('div');
      fragmentDiv.style.display = "none";
  
  return function(ns, name) {
    // Special case for title, IE doesn't like it to be cloned
    // in the body
    if (name === 'title') {
      return document.createElement(name);;
    }
       
    if (fragmentDiv.parentNode !== document.body) {
      document.body.appendChild(fragmentDiv); 
    }
     
    if (cache[name] === undefined) {
      cache[name] = document.createElement(name);
    }
    
    fragmentDiv.innerHTML =  cache[name].outerHTML;
    var clone = fragmentDiv.firstChild;
    fragmentDiv.removeChild(clone);
    return clone;
  };
}());


d3_selectionPrototype.append = function(name) {
  name = d3.ns.qualify(name);

  function append() {
    if (name.local === 'svg') return appendRaphael(this);

    return this.appendChild(createElementFromCache(this.namespaceURI, name));
  }

  function appendNS() {
    if (name.local === 'svg') return appendRaphael(this);

    return this.appendChild(createElementFromCache(name.space, name.local));
  }

  return this.select(name.local ? appendNS : append);
};
