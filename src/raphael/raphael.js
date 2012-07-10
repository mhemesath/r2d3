/**
 * Initializes and creates the root {@link D3RaphaelSelection} for the specified
 * Raphael Paper.
 *
 * @example
 * var paper = new Raphael(document.body, 300, 200);
 * var d3_raphael_selection = d3.raphael(paper);
 *
 * @see <a href="http://raphaeljs.com/reference.html#Raphael">Raphael</a>
 * @see <a href="http://raphaeljs.com/reference.html#Paper">Raphael.Paper</a>
 *
 * @param {Raphael.Paper} paper
 * @return {D3RaphaelSelection} a selection of the root Raphael.Paper element
 *
 * @function
 * @namespace
 */
d3.raphael = function(paper) {
    var root = new D3RaphaelRoot(paper);

    return d3_raphael_selection([[root.paper]], root)
};

