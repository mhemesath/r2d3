(function() {

  if (typeof Raphael === 'undefined') return;



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
