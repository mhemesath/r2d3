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
  paper.groups = [];

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
  paper.node = parent;

  return paper;
}


//========================================
//) Helper function Extensions
var rParseTransformString = Raphael.parseTransformString;
Raphael.parseTransformString = function(TString) {
	if (TString.indexOf("translate") != -1 ||
			TString.indexOf("rotate") != -1 ||
			TString.indexOf("scale") != -1) {
		TString = toRTransformString(TString);
	}
	return rParseTransformString(TString);
};

function toRTransformString(TString) {
	TString = TString.replace(/[)]/g, "");
	TString = TString.replace(/translate\(/gi, "t");
	TString = TString.replace(/rotate\(/gi, "r");
	TString = TString.replace(/scale\(/gi, "s");
	return TString;
};

//========================================
// Paper Extensions

Raphael.fn.removeChild = function(el) {
  el.remove();
};


Raphael.fn.line = function () {
  var line =  this.path();
  line.data('lineAttrs', { });
  return line;
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

  if (tag === 'g') {
    return this.groups;
  }

  var matches = [];
  this.forEach(function(el) {
    var type = el.data('lineAttrs') ? 'line' : el.type;
    if (type === tag) matches.push(el);
  });
  return matches;
};


Raphael.fn.appendChild = function(childNode) {
  var type = childNode && childNode.nodeName,
      el =  type ? this[type.toLowerCase()]() : null;

  // Ensure Paper can be referenced from sets
  if (el) {
    el.paper = this;
  }
  return el;
};




//========================================
// Element Extensions

Raphael.el.addEventListener = function(type, listener) {
  this[type](listener);
};


Raphael.el.removeEventListener = function(type, listener) {
  this['un'+ type](listener);
};


Raphael.el.setAttribute = function(name, value) {

  if (name == 'class' || name == 'className') {
    paperClassedAdd(this.node, value);
  }

  this.attr(name, value);
  return this;
};


Raphael.el.removeAttribute = function(name) {
  this.attr(name, '');
  return this;
};


Raphael.el.getAttribute = function(name) {
  return this.attr(name);
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


Raphael.st.removeAttribute = function(name) {
  this.forEach(function(el) {
    el.removeAttribute(name);
  });
};

