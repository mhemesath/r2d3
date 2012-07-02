// This is a dummy file to help JSDoc document the d34raphael code better.
//
// It is not intended to be included or compiled.

/**
 * @namespace
 */
d3 = {};

/**
 * @class Raphael aware selection, intended to be used like <code><a href="https://github.com/mbostock/d3/wiki/Selections">d3.selection</a></code>.
 *  caveats and differences documented below.  <br />
 *  <br />
 *  Unlike SVG, in Raphael, all elements are in a flat list, all peer to each other, and all the direct child of the root Raphael element.
 *  This changes the behavior of some of the methods below (noted as appropriate).<br />
 *  <br />
 *  If you don't see a method documented, it probably doesn't exist yet.
 *
 * @constructor
 */
D3RaphaelSelection = function() {};

/**
 * @class Raphael aware update selection, intended to be used like <code><a href="https://github.com/mbostock/d3/wiki/Selections">d3.selection</a></code>.
 * @constructor
 * @extends D3RaphaelSelection
 */
D3RaphaelUpdateSelection = function() {};

/**
 * @class Raphael aware enter selection, intended to be used like <code><a href="https://github.com/mbostock/d3/wiki/Selections">d3.selection</a></code>.
 *
 * @constructor
 */
D3RaphaelEnterSelection = function() {};

/**
 * @class A Raphael axis renderer function, intended to be used like <code><a href="https://github.com/mbostock/d3/wiki/SVG-Axes">d3.svg.axis</a></code>.
 *   caveates and differences documented below.  <br />
 *   <br />
 *   If you don't see a method documented, it probably doesn't exist yet.<br />
 *   <br />
 *   NOTE: The object is actually a function with signature <code>function(selection)</code>, to be called with a selection to which it renders it's axis,
 *
 * @constructor
 */
D3RaphaelAxis = function() {}