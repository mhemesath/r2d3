d3_selectionPrototype.raphael = function(width, height) {

  function paper() {
    var paper =  Raphael(this, width, height);

    paper.ca.d = function(path) {
      return { path: path };
    };

		// Fool sizzle into thinking the paper is an element
    paper.nodeType = 1;

    return paper;
  }

  return this.select(paper);
};

(function() {

  Raphael.fn.querySelectorAll = function(selector) {
    var typeMatch = /^[a-zA-Z]+/,
        type = typeMatch.exec(selector),
        found = [];

    selector = selector.replace(typeMatch, '');

    this.forEach(function(el) {
        if(!type || el.type == type) {
          if (selector === '') {
            found.push(el);
          } else if (Sizzle.matchesSelector(el.node, selector)) {
            found.push(el);
          }
        }
    });

    return found;
  };


	Raphael.fn.getElementsByClassName = function(selector) {
		var matches = [];
		this.forEach(function(el) {
		  if (Sizzle.matchesSelector(el.node, selector)) matches.push(el); 
    });
		return matches;
	};


	Raphael.fn.getElementsByTagName = function(tag) {
		var matches = []
		this.forEach(function(el) {
			if (el.type == tag) matches.push(el);
		});
		return matches;
	};



	Raphael.el.setAttribute = function(name, value) {

		if (name == 'class') {
			this.node.className = value;
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

}());
