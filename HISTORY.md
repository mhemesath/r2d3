0.2.0 / 2013-04-??
==================

  * Add support ```selection.classed```.  [Bug 57](https://github.com/mhemesath/r2d3/issues/57)
  * Handle R2D3Elements in insertBefore. [Bug 84](https://github.com/mhemesath/r2d3/issues/84)
  * Remove raphael elements from children dom nodes when removing a dom node. [Bug 89](https://github.com/mhemesath/r2d3/issues/89)
  * Don't attempt to initialize raphael node when events are attached.
  * Return empty string when converting null SVG transforms to Raphael transforms.
  * Redrawing text elements throws an exception in IE8. [Bug 109](https://github.com/mhemesath/r2d3/pull/110). Thanks @sbshetty01!
  * Added support for polygon/polyline. [Bug 108](https://github.com/mhemesath/r2d3/pull/108). Thanks @tianon!

0.1.1 / 2013-03-18
==================

  * Patch d3 compat/style. [Bug 83](https://github.com/mhemesath/r2d3/issues/83)

0.1.0 / 2013-03-17
==================

  * Updated D3 to 3.0.8
  * Updated examples to match v3.0.8
  * Refactor R2D3 to use wrapper for DOM and Raphael objects.
  * Cache SVG to Raphael transform Strings
  * Change R2D3 reference on DOM nodes to be more direct
  * Move Raphael paper extensions to R2D3 element wrapper.
  * Enable setting SVG height/width via css