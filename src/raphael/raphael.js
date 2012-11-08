

(function(defaultGetComputedStyle) {
  // If we don't have window.getComputedStyle, as in IE7,
  // make a pretend one.
  if (typeof defaultGetComputedStyle === "undefined") {
    defaultGetComputedStyle = function(el, pseudo) {
      this.el = el;
      this.getPropertyValue = function(prop) {
        var re = /(\-([a-z]){1})/g;
        if (prop == 'float') prop = 'styleFloat';
        if (re.test(prop)) {
          prop = prop.replace(re, function () {
            return arguments[2].toUpperCase();
          });
        }
        return el.currentStyle[prop] ? el.currentStyle[prop] : null;
      }
      return this;
    };
  }
  
  window.getComputedStyle = function(node) {
    // Override for Raphael
    if (node && node.paper) {
      return {
        getPropertyValue: function(name) {
          return node.attr(name);
        }
      };
    }
    
    return defaultGetComputedStyle.apply(window, arguments);
  };
}(window.getComputedStyle));

// Register SVG elements with IE so they can be styled
(function() {
  var svgElements = 'circle ellipse line polygon polyline rect g svg image path text'.split(' '); 
    
  if (Raphael.svg) return;

  for (var i=0; i< svgElements.length; i++) {
    document.createElement(svgElements[i]);
  }
})();


function paperClassedAdd(node, name) {
  var re = new RegExp("(^|\\s+)" + d3.requote(name) + "(\\s+|$)", "g");

  // Easy case, browser supports classList
  if (node.classList) return node.classList.add(name);

  var c = node.className || '',
      cb = c.baseVal !== null,
      cv = cb ? c.baseVal : c;
  re.lastIndex = 0;
  if (!re.test(cv)) {
    cv = d3_collapse(cv + " " + name);
    if (cb) {
      c.baseVal = cv;
    } else {
      node.setAttribute('class', cv);
    }
  }
}



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

  paper.__attrs = { width: 0, height: 0 };
  
  if (Raphael.vml) {
    paper.shadowDom = document.createElement('svg');
    paper.shadowDom.style.display = 'none';
    parent.appendChild(paper.shadowDom);
  }

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

  return paper;
}

//========================================
// Paper Extensions

Raphael.fn.removeChild = function(el) {
  if (Raphael.vml) {
    this.shadowDom.removeChild(el.shadowDom);
  }
  el.remove();
};


Raphael.fn.line = function () {
  var line =  this.path();
  line.data('lineAttrs', { });
  return line;
};


Raphael.fn.img = function() {
  // IE8 turns image nodes into img
  return this.image();
};


Raphael.fn.getAttribute = function(name) {
  return this.__attrs[name];
};


Raphael.fn.setAttribute = function(name, value) {
  this.__attrs[name] = value;

  if (name === 'height' || name === 'width') {
    this.setSize(this.__attrs.width, this.__attrs.height);
  }
};


Raphael.fn.getElementsByClassName = function(selector) {
  var matches = [];
  selector = '.' + selector;

  this.forEach(function(el) {
    if (Sizzle.matchesSelector(el.node, selector)) matches.push(el);
  });
  return matches;
};


Raphael.fn.getElementsByTagName = function(tag) {
  var matches = [];
  this.forEach(function(el) {
    var type = el.data('lineAttrs') ? 'line' : el.type;
    if (type === tag) matches.push(el);
  });
  return matches;
};


Raphael.fn.appendChild = function(childNode) {
  var type = childNode && childNode.nodeName,
      node =  type ? this[type.toLowerCase()]() : null;
      
  // Ensure Paper can be referenced from sets
  if (node) {
    node.paper = this;
		node.style = new ElementStyle(node);
    if (Raphael.vml) {
      node.shadowDom = childNode;
      this.shadowDom.appendChild(childNode);
      node.updateStyle(); //  Apply CSS styles
    }
  }
  return node;
};





//========================================
// Element Extensions

/**
 * Updates the style for a given property honoring style
 */
Raphael.el.updateStyle = function(name) {
	var attributes = this.data('attributes') || {},
			style = this.style.props,
      css = Raphael.vml ? this.shadowDom.currentStyle : {},
      props = 'arrow-end cursor fill fill-opacity font font-family font-size font-weight opacity r rx ry stroke stroke-dasharay stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor'.split(' ');
      

  if (arguments.length < 1) {
    for (var i=0; i < props.length; i++) this.updateStyle(props[i]);
  }
	
  // Props that can't be styled via CSS (e.g path, height, width), apply directly
  if (props.indexOf(name) < 0) {
    this.attr(name, attributes[name]);
  // Honor the precedence for applying styleable attributes
  } else {
    this.attr(name, (style[name] || css[name] || attributes[name]));
  }
  return true;
};


function _elementSetProperty(level) {
	return function(name, value) {
			var style = this.data(level) || {};
			
			if (value === '' || value === null || value === undefined) {
				delete style[name];
			} else {
				style[name] = value;
			}
			
			this.data(level, style);
			this.updateStyle(name);
	}
}

function _elementRemoveProperty(level) {
	return function(name) {
			var style = this.data(level) || {};
			delete style[name];
			this.data(level, style);
			this.updateStyle(name);
		}
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
  if (name == 'class' || name == 'className') {
    paperClassedAdd(this.node, value);
    if (Raphael.vml) {
      this.shadowDom.className = value;
      this.updateStyle();
    }
  }
  
  if (name === 'href' && this.type === 'image') {
    name = "src"; // Raphael uses src
  }
	
	_elementSetProperty('attributes').apply(this, [name, value]);
  return this;
};


Raphael.el.setAttributeNS = function(namespace, name, value) {
  if (namespace === 'xlink' && name === 'href' && this.type === 'image') {
    this.setAttribute('src', value);
  }
  this.setAttribute(name, value);
};

Raphael.el.removeAttribute = _elementRemoveProperty('attributes');

Raphael.el.getAttribute = function(name) {
  // Raphael uses src
  if (name === 'href' && this.type === 'image') name = 'src';
	return this.data('attributes')[name];
};

function ElementStyle(element) {
	this.element = element;
	this.props = {};
}

ElementStyle.prototype.setProperty = function(name, value) {
	if (value === '' || value === null || value === undefined) {
		delete this.props[name];
	} else {
		this.props[name] = value;
	}
			
	this.element.updateStyle(name);
};

ElementStyle.prototype.removeProperty = function(name) {
	delete this.props[name];
	this.element.updateStyle(name);
};

ElementStyle.prototype.getPropertyValue = function(name) {
	return this.props[name];
};



//========================================
// Set Extensions

Raphael.st.getElementsByClassName  = Raphael.fn.getElementsByClassName;


Raphael.st.getElementsByTagName = Raphael.fn.getElementsByTagName;


Raphael.st.appendChild = function(childNode) {
  var node = this.paper.appendChild(childNode);
  this.push(node);
  return node;
};


Raphael.st.addEventListener = function(type, listener) {
  this.forEach(function(el) {
    el.addEventListener(type, listener);
  });
};


Raphael.st.removeEventListener = function(type, listener) {
  this.forEach(function(el) {
    el.removeEventListener(type, listener);
  });
};


Raphael.st.setAttribute = function(name, value) {
  this.forEach(function(el) {
    el.setAttribute(name, value);
  });
};

Raphael.st.setAttributeNS = function(ns, name, value) {
  this.setAttribute(name, value);
};


Raphael.st.removeAttribute = function(name) {
  this.forEach(function(el) {
    el.removeAttribute(name);
  });
};


Raphael.st.updateStyle = function(name) {
  this.forEach(function(el) {
    el.updateStyle(name);
  });
};