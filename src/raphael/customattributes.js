if(typeof Raphael !== "undefined") {
    // adds a Raphael custom attribute "d" which maps to "path"
    // in d3/svg, the definition of a path is specified via attribute "d",
    // in raphael, it's specified via attribute "path".
    //
    // this bridges the two worlds a little
    function d3_raphael_addCustomAttributes(paper) {
        paper.ca.d = function(path) {
            return {path: path};
        }
    }

    // adds selection.attr("class",...) support
    // see raphaelselection.attr
}
