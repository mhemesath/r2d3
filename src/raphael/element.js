/**
 * element.js
 *
 * Wrapper object containing the SVG DOM node and corresponding Raphael element.  This is the object that D3 interacts with
 * build the data visualizations. The DOM node is used as a hook for queries and styling via CSS and the style element. The attributes
 * are then taken from the DOM node and mapped onto Raphael to be drawn on the canvas.
 */
function R2D3Element(paper, node) {
  // Raphael Paper object
  this.paper = paper;

  // The SVG DOM node representing the Raphael element
  // This is used as a hook for querying and styling
  this.domNode = node;

  // Reference back to the R2D3 element wrapper
  this.domNode.r2d3 = this;

  // Reference to the rendered Raphael element
  // Initialization is delayed until all required props
  // are set
  this.raphaelNode = null;

  // Reference to the parent R2D3 element
  this.parentNode = node.parentNode.r2d3;

  switch(node.tagName) {
    case 'polyline':
    case 'polygon':
    case 'path':
      this.raphaelNode = paper.path('Z');
      break;
    case 'rect':
      this.raphaelNode = paper.rect(0, 0, 0, 0);
      break;
    case 'circle':
      this.raphaelNode = paper.circle(0, 0, 0);
      break;
    case 'g':
      this.isGroup = true;
      break;
    case 'line':
      this.raphaelNode = paper.path('Z');
      break;
    case 'img':
    case 'image':
      this.raphaelNode = paper.image('#', 0, 0, 0, 0);
      break;
    case 'text':
      this.isText = true;
      this.raphaelNode = paper.text(0, 0, '');
      break;
    case 'ellipse':
      this.raphaelNode = paper.ellipse(0, 0, 0, 0);
      break;
    case 'svg':
      this.isSVG = true;
  }

  this.updateProperty('transform');
  this.updateCurrentStyle();
}


R2D3Element.prototype._linePath = function() {
  var x1 = this.domNode.getAttribute('x1') || 0,
      x2 = this.domNode.getAttribute('x2') || 0,
      y1 = this.domNode.getAttribute('y1') || 0,
      y2 = this.domNode.getAttribute('y2') || 0;

  return ['M', x1, ' ', y1, 'L', x2, ' ', y2, 'Z'].join('');
};


R2D3Element.prototype._strokeDashArray = function(dashValue) {
  // There values were derived from raphael's source
  // https://github.com/DmitryBaranovskiy/raphael/blob/master/dev/raphael.svg.js#L282
  var dasharray = {
    '3 1': '-',
    '1 1': '.',
    '3 1 1 1': '-.',
    '3 1 1 1 1 1': '-..',
    '1 3': '. ',
    '4 3': '- ',
    '8 3': '--',
    '4 3 1 3': '- .',
    '8 3 1 3': '--.',
    '8 3 1 3 1 3': '--..'
  };

  // Get dashValue from domNode if it was not passed in
  if (dashValue === undefined) {
    dashValue = this.domNode.getAttribute('stroke-dasharray');
  }

  dashValue = (dashValue) ? dashValue.match(/\d+/g) : '';

  if (dashValue.length) {
    dashValue = dashValue.join(' ');
  }

  return dasharray[dashValue] || '';
};


/**
 * Updates an individual property. If the classname changes, all restyle
 * of the element will be triggered.
 */
R2D3Element.prototype.updateProperty = function(propertyName) {
  switch(propertyName) {
    // transform, traverse up DOM to determine nested tranforms
    case 'transform':
      var node = this.domNode;
      var transforms = new Array(5);

      // Groups trigger transforms on all child raphael nodes
      // as they don't have a raphael reference themselves
      if (this.isGroup) {
        var childNodes = node.childNodes,
            length = childNodes.length,
            i=0;

        for (i; i < length; i++) {
          if (childNodes[i].r2d3) {
            childNodes[i].r2d3.updateProperty('transform');
          }
        }

      // Raphael nodes search up the DOM tree to get all transforms affecting them
      } else if (this.raphaelNode) {
        transform = node.getAttribute('transform');
        if (transform) {
          transforms.push(_map_svg_transform_to_raphael(transform));
        }

        while(node.parentNode && node.parentNode.r2d3) {
          node = node.parentNode;
          transform = node.getAttribute('transform');
          if (transform) {
            transforms.push(_map_svg_transform_to_raphael(transform));
          }
        }
        this.raphaelNode.transform(transforms.reverse().join(''));
      }
      break;

    // Class change, update all the styles
    case 'class':
      this.updateCurrentStyle();
      break;

    // Update SVG height
    case 'height':
      var width = this.domNode.getAttribute('width') || 0,
          height = this.domNode.getAttribute('height') || 0;
      if (this.domNode.tagName === 'svg') {
        this.paper.setSize(width, height);
      } else {
        this.raphaelNode.attr('height', height);
      }
      break;

    // Update SVG width
    case 'width':
      var width = this.domNode.getAttribute('width') || 0,
          height = this.domNode.getAttribute('height') || 0;
      if (this.domNode.tagName === 'svg') {
        this.paper.setSize(width, height);
      } else {
        this.raphaelNode.attr('width', width);
      }
      break;

    case 'href':
      this.raphaelNode.attr('src', this.domNode.getAttribute('href'));
      break;

    // Polylines/Polygons map points to raphael path attribute, with a little help
    case 'points':
      // see http://stackoverflow.com/a/9709153/433558
      var path = ['M', this.domNode.getAttribute('points')];
      if (this.domNode.tagName === 'polygon') {
        path.push('Z');
      }
      this.raphaelNode.attr('path', path.join(''));
      break;

    // Paths map d to raphael path attribute
    case 'd':
      this.raphaelNode.attr('path', this.domNode.getAttribute('d'));
      break;

    // Line Attributes need to rebuild path representing line
    case 'x1':
      this.raphaelNode.attr('path', this._linePath());
      break;
    case 'x2':
      this.raphaelNode.attr('path', this._linePath());
      break;
    case 'y1':
      this.raphaelNode.attr('path', this._linePath());
      break;
    case 'y2':
      this.raphaelNode.attr('path', this._linePath());
      break;
    case 'stroke-dasharray':
      this.raphaelNode.attr('stroke-dasharray', this._strokeDashArray());
      break;

    // Just apply the attribute
    default:
      if (this.raphaelNode) {
        var value = this.domNode.style.getAttribute(propertyName)
            || this.domNode.currentStyle.getAttribute(propertyName)
            || this.domNode.getAttribute(propertyName);
        this.raphaelNode.attr(propertyName, value);
      }
  }
};

/**
 * Looks up the current style applied by CSS, inline styles and attributes and
 * applies them to the raphael object. If not styles are found, the SVG defaults
 * are used for each property.
 */
R2D3Element.prototype.updateCurrentStyle = function(name) {
  // convert a name from "css-style" to "cssStyle"
  function undash(name) {
    return name.replace(/-\w/, function (match) {
      return match.charAt(1).toUpperCase();
    });
  }

  function getValue(el, name, currentStyle) {
    return el.style.getAttribute(name)
        || currentStyle.getAttribute(name)
        || el.getAttribute(name)
        || currentStyle.getAttribute(undash(name));
  }

  var currentStyle = this.domNode.currentStyle,
      el = this.domNode;

  // SVG can have the size set via CSS
  if (this.isSVG) {
    var height = getValue(el, 'height', currentStyle),
        width = getValue(el, 'width', currentStyle);

    // If the browser returns auto, default to using the attribute height/width
    height = height === 'auto' ? el.getAttribute('height') : height;
    width = width === 'auto' ? el.getAttribute('width') : width;

    this.paper.setSize(width || 0, height || 0);
  }

  // Groups don't have raphael nodes
  if (!this.raphaelNode) {
    return;
  }

  var attrs = {
    'cursor': getValue(el, 'cursor', currentStyle),
    'fill': getValue(el, 'fill', currentStyle) || 'black',
    'fill-opacity': getValue(el, 'fill-opacity', currentStyle) || 1,
    'opacity': getValue(el, 'opacity', currentStyle) || 1,
    'stroke': getValue(el, 'stroke', currentStyle) || 'none',
    'stroke-dasharray': this._strokeDashArray(getValue(el, 'stroke-dasharray', currentStyle)),
    'stroke-linecap': getValue(el, 'stroke-linecap', currentStyle)|| 'butt',
    'stroke-linejoin': getValue(el, 'stroke-linejoin', currentStyle) || 'miter',
    'stroke-miterlimit': getValue(el, 'stroke-miterlimit', currentStyle) || 4,
    'stroke-opacity': getValue(el, 'stroke-opacity', currentStyle) || 1,
    'stroke-width': getValue(el, 'stroke-width', currentStyle) || 1,
  };

  if (this.isText) {
    attrs['font'] = getValue(el, 'font', currentStyle);
    attrs['font-family'] = getValue(el, 'font-family', currentStyle);
    attrs['font-size'] = getValue(el, 'font-size', currentStyle);
    attrs['font-weight'] = getValue(el, 'font-weight', currentStyle);
    attrs['text-anchor'] = getValue(el, 'text-anchor', currentStyle) || 'start';
  }

  if (name && attrs[name] === undefined) {
    attrs[name] = el.getAttribute(name);
  }

  if (this.isImage) {
    // Images wont render in raphael if fill set
    delete attrs['fill'];
  }

  this.raphaelNode.attr(attrs);
};

R2D3Element.prototype.setStyleProperty = function(name, value) {
  this.domNode.style.setAttribute(name, value);
  this.updateProperty(name);
};

R2D3Element.prototype.getStyleProperty = function(name) {
  return this.domNode.style.getAttribute(name);
};

R2D3Element.prototype.removeStyleProperty = function(name) {
  this.domNode.style.removeAttribute(name);
  this.updateProperty(name);
};

R2D3Element.prototype.getCurrentStyle = function() {
  return this.domNode.currentStyle;
};

R2D3Element.prototype.removeRaphaelNode = function(removeChildren) {

  if (removeChildren === true) {
    var children = this.domNode.children,
        length = children.length,
        i = 0;

    for (i; i < length; i++) {
      var node = children[i];
      if (node.r2d3) {
        node.r2d3.removeRaphaelNode(removeChildren);
      }
    }
  }

  this.domNode.r2d3 = null;
  if (this.raphaelNode) {
    this.raphaelNode.remove();
  }
};


var _raphael_transform_map = {};
function _map_svg_transform_to_raphael(transform) {
  if (transform === null || transform === undefined || transform === '') {
    return '';
  }

  if (_raphael_transform_map[transform] === undefined) {
    _raphael_transform_map[transform] = transform.replace(/translate\(/gi, "t")
                                                 .replace(/rotate\(/gi, "r")
                                                 .replace(/scale\(/gi, "s")
                                                 .replace(/[)]/g, "");
  }
  return _raphael_transform_map[transform];
}


window.transformMap = _raphael_transform_map;


//=====================================
// DOM APIs
//=====================================



R2D3Element.prototype.appendChild = function(node) {
  if (node.r2d3) {
    // TODO: Reposition raphael paper node
    return node.r2d3;
  }
  this.domNode.appendChild(node);
  return new R2D3Element(this.paper, node);
};


R2D3Element.prototype.removeChild = function(node) {
  node.removeRaphaelNode(true);
  this.domNode.removeChild(node.domNode);
  if (!this.domNode){ alert('oh shit'); }
  return node;
};


R2D3Element.prototype.addEventListener = function(type, listener) {

  var self = this;
  if (!listener._callback) {
    listener._callback = function(e) {
      // Ensure the listener is invoked with 'this'
      // as the raphael node and not the window
      listener.apply(self, [e]);
    };
  }

  // Groups don't exist, bind the events to the children directly
  if (this.isGroup) {
    for (var i=0; i < this.domNode.childNodes; i++) {
      this.domNode.childNodes[i].r2d3.addEventListener(type, listener);
    }

  // Bind directly to the raphael node
  } else {
    if (this.isSVG) {
      this.domNode.parentNode.attachEvent("on" + type, listener._callback);
    } else {
      this.raphaelNode.node.attachEvent("on" + type, listener._callback);
    }
  }
};


R2D3Element.prototype.removeEventListener = function(type, listener) {
  // Groups don't exist, bind the events to the children directly
  if (this.isGroup) {
    for (var i=0; i < this.domNode.childNodes; i++) {
      this.domNode.childNodes[i].r2d3.removeEventListener(type, listener);
    }

  // Bind directly to the raphael node
  } else {
    if (this.isSVG) {
      this.domNode.parentNode.detachEvent("on" + type, listener._callback || listener);
    } else {
      this.raphaelNode.node.detachEvent("on" + type, listener._callback || listener);
    }
  }
};


R2D3Element.prototype.setAttribute = function(name, value) {
  this.domNode.setAttribute(name, value);
  this.updateProperty(name);
};


R2D3Element.prototype.insertBefore = function(node, before) {

  var r2D3Element,
      domNode,
      beforeDomNode = before ? before.domNode : before;

  // Node is a R2D3 Element
  if (node.paper) {
    domNode = node.domNode;

  // Node is a DOM node
  } else {
    domNode = node;
  }

  // Put the DOM in the correct order
  this.domNode.insertBefore(domNode, beforeDomNode);

  // Create R2D3 element if it doesn't exist after node appended to DOM
  r2D3Element = domNode.r2d3 || new R2D3Element(this.paper, domNode);


  // Put the raphael objects in the correct order
  if (before && r2D3Element.domNode.tagName !== 'g') {
    r2D3Element.raphaelNode.insertBefore(before.raphaelNode);
  }

  return r2D3Element;
};


R2D3Element.prototype.setAttributeNS = function(namespace, name, value) {
  this.setAttribute(name, value);
};


R2D3Element.prototype.removeAttribute = function(name) {
  this.domNode.removeAttribute(name);
  this.updateProperty(name);
};


R2D3Element.prototype.getAttribute = function(name) {
  return this.domNode.getAttribute(name);
};

R2D3Element.prototype.getBBox = function() {
  if (this.raphaelNode) {
    return this.raphaelNode.getBBox();
  }

  return { x: 0, y: 0, width: 0, height: 0 };
};
