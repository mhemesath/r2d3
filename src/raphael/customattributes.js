if (typeof Raphael !== "undefined") {
    // adds a Raphael custom attribute "d" which maps to "path"
    // in d3/svg, the definition of a path is specified via attribute "d",
    // in raphael, it's specified via attribute "path".
    //
    // this bridges the two worlds a little
    function d3_raphael_addCustomAttributes(paper) {
        paper.ca.d = function(path) {
            return {path: path};
        };
    }

    // adds selection.attr("class",...) support
    // see raphaelselction.attr

    Raphael.el.setAttribute = function(name, value) {
      this.attr(name, value);
    };


    Raphael.el.setAttributeNS = function(namespace, name, value) {
      this.attr(name, value);
    };

    Raphael.el.removeAttribute = function(name) {
      this.attr(name, '');
    };

    Raphael.el.removeAttributeNS = function(namespace, name) {
      this.attr(name, '');
    };

    Raphael.el.getAttribute = function(name) {
      return this.attr(name);
    };

    Raphael.el.getAttributeNS = function(namespace, name) {
      return this.attr(name);
    };
}
