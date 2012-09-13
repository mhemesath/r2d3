(function() {

  if (typeof Raphael === 'undefined') return;

  d3_selectionPrototype.raphael = function(width, height) {

    function paper() {
      var paper =  Raphael(this, width, height);

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

    return this.select(paper);
  };

  

  function classedAdd(node, name) {
          var re = new RegExp("(^|\\s+)" + d3.requote(name) + "(\\s+|$)", "g");
          if (c = node.classList) return c.add(name);
            var c = node.className || '',
                cb = c.baseVal != null,
                cv = cb ? c.baseVal : c;
            re.lastIndex = 0;
          if (!re.test(cv)) {
            cv = d3_collapse(cv + " " + name);
            if (cb) c.baseVal = cv;
            else node.setAttribute('class', cv);
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

      attrs[name] = value;
      this.attr('path', 'M' + attrs.x1 + ' ' + attrs.y1 + 'L' + attrs.x2 + ' ' + attrs.y2 + 'Z');
    };
  }


  Raphael.fn.removeChild = function(el) {
    el.remove();
  };

  Raphael.fn.line = function () {
    var line =  this.path('M0 0L0 0Z');
    line.data('lineAttrs', { x1: 0, y1: 0, x2: 0, y2: 0 });
    return line;
  };



  Raphael.st.getElementsByClassName  = Raphael.fn.getElementsByClassName = function(selector) {
    var matches = [];
    selector = '.' + selector;

    this.forEach(function(el) {
      if (Sizzle.matchesSelector(el.node, selector)) matches.push(el);
    });
    return matches;
  };

  Raphael.st.getElementsByTagName = Raphael.fn.getElementsByTagName = function(tag) {
    var matches = [];
    this.forEach(function(el) {

      var type = el.data('lineAttrs') ? 'line' : el.type;


      if (type === tag) matches.push(el);
    });
    return matches;
  };


  Raphael.el.addEventListener = function(type, listener) {
    this[type](listener);
  };

  Raphael.st.addEventListener = function(type, listener) {
    this.forEach(function(el) {
      el.addEventListener(type, listener);
    });
  };

  Raphael.el.removeEventListener = function(type, listener) {
    this['un'+ type](listener);
  };

  Raphael.st.removeEventListener = function(type, listener) {
    this.forEach(function(el) {
      el.removeEventListener(type, listener);
    });
  };


  Raphael.el.setAttribute = function(name, value) {

    if (name == 'class') {
      classedAdd(this.node, value);
    }

    this.attr(name, value);
    return this;
  };

  Raphael.st.setAttribute = function(name, value) {
    this.forEach(function(el) {
      el.setAttribute(name, value);
    });
  }

  Raphael.el.removeAttribute = function(name) {
    this.attr(name, '');
    return this;
  };

  Raphael.st.removeAttribute = function(name) {
    this.forEach(function(el) {
      el.removeAttribute(name);
    });
  };

  Raphael.el.getAttribute = function(name) {
    return this.attr(name);
  };

}());
