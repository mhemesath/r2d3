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
    if (fragmentDiv.parentNode !== document.body) {
      document.body.appendChild(fragmentDiv); 
    }
     
    if (cache[name] === undefined) {
      cache[name] = document.createElementNS(ns, name);
    }
    
    var clone;
    fragmentDiv.innerHTML =  cache[name].outerHTML;
    fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
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
