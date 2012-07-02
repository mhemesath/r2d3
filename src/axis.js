/**
 * Constructs a Raphael axis renderer function.
 *
 * @return {D3RaphaelAxis}
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/SVG-Axes">d3.svg.axis</a>
 */
d3.raphael.axis = function() {
    var scale = d3.scale.linear(),
        orient = "bottom",
        tickMajorSize = 6,
        tickMinorSize = 6,
        tickEndSize = 6,
        tickPadding = 3,
        tickArguments_ = [10],
        tickValues = null,
        tickFormat_,
        tickSubdivide = 0;

    // todo: work-around because we don't have groups
    var top = 0,
        left = 0;

    // todo: work-around because we don't have stylesheet
    var classPrefix = "";

    // todo: figure out if we can refactor to reuse code

    function axis(selection) {

        selection.each(function() {
            var g = selection.root.select("");

            // Ticks, or domain values for ordinal scales.
            var ticks = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments_) : scale.domain()) : tickValues,
                tickFormat = tickFormat_ == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments_) : String) : tickFormat_;

            // Major ticks.
            var tick = g.selectAll("g").data(ticks, String),
                tickEnter = tick.enter().append("path")
                    .classed(classPrefix + "path", true)
//                tickEnter = tick.enter().insert("g", "path").style("opacity", 1e-6),
//                tickExit = d3.transition(tick.exit()).style("opacity", 1e-6).remove(),
//                tickUpdate = d3.transition(tick).style("opacity", 1),
//                tickTransform;

            var text = tick.append("text")
                .attr("text", tickFormat );

            // Domain.
            var range = d3_scaleRange(scale),
                path = g.selectAll(".domain").data([0]),
                pathEnter = path.enter().append("path")
                    .classed(classPrefix + "pathdomain", true)
//                pathEnter = path.enter().append("path").attr("class", "domain")
//                pathUpdate = d3.transition(path);

            // Stash a snapshot of the new scale, and retrieve the old snapshot.
            var scale1 = scale.copy(),
                scale0 = this.__chart__ || scale1;
            this.__chart__ = scale1;

            switch (orient) {
                case "top": {
                    tick.attr("path", function(d) { return d3_raphael_pathArrayToString([["M", [left + scale1(d), top]],["l", [0, -tickMajorSize]]]); });
                    text.attr("x", function(d) { return scale1(d) + left + (scale1.rangeBand? scale1.rangeBand() / 2.0 : 0); })
                        .attr("y", top- 7 ) // todo add dy support to raphael
                        .attr("text-anchor", "middle")
//                    path.attr("path", "M" + (-tickEndSize + left) + "," + (range[0] + top) + "h" + tickEndSize + "v" + (range[1] + top) + "h" + -tickEndSize)
                    path.attr("path", "M" + (range[0] + left) + "," + (-tickEndSize + top) + "v" + tickEndSize + "H" + (range[1] + left) + "v" + -tickEndSize)

                    break;
                }

                case "bottom": {
                    tick.attr("path", function(d) { return d3_raphael_pathArrayToString([["M", [left + scale1(d), top]],["l", [0, tickMajorSize]]]); });
                    text.attr("x", function(d) { return scale1(d) + left + (scale1.rangeBand? scale1.rangeBand() / 2.0 : 0); })
                        .attr("y", top + tickMajorSize + 7 ) // todo add dy support to raphael
                        .attr("text-anchor", "middle")
//                    path.attr("path", "M" + (-tickEndSize + left) + "," + (range[0] + top) + "h" + tickEndSize + "v" + (range[1] + top) + "h" + -tickEndSize)
                    path.attr("path", "M" + (range[0] + left) + "," + (tickEndSize + top) + "v" + -tickEndSize + "H" + (range[1] + left) + "v" + tickEndSize)

                    break;
                }


                case "left": {
                    tick.attr("path", function(d) { return d3_raphael_pathArrayToString([["M", [left, scale1(d) + top]],["l", [-tickMajorSize,0]]]); });
                    path.attr("path", "M" + (-tickEndSize + left) + "," + (range[0] + top) + "h" + tickEndSize + "V" + (range[1] + top) + "h" + -tickEndSize)
                    text.attr("x", left - 5)
                        .attr("y", function(d) { return scale1(d) + top + (scale1.rangeBand? scale1.rangeBand() / 2.0 : 0); })
                        .attr("text-anchor", "end")

                    break;
                }

                default: {
                    throw "Unsupported " + orient;
                }
            }

//            // For quantitative scales:
//            // - enter new ticks from the old scale
//            // - exit old ticks to the new scale
//            if (scale.ticks) {
//                tickEnter.call(tickTransform, scale0);
//                tickUpdate.call(tickTransform, scale1);
//                tickExit.call(tickTransform, scale1);
//                subtickEnter.call(tickTransform, scale0);
//                subtickUpdate.call(tickTransform, scale1);
//                subtickExit.call(tickTransform, scale1);
//            }
//
//            // For ordinal scales:
//            // - any entering ticks are undefined in the old scale
//            // - any exiting ticks are undefined in the new scale
//            // Therefore, we only need to transition updating ticks.
//            else {
//                var dx = scale1.rangeBand() / 2, x = function(d) { return scale1(d) + dx; };
//                tickEnter.call(tickTransform, x);
//                tickUpdate.call(tickTransform, x);
//            }




//            tick.attr("path", function(d) { return d3_raphael_pathArrayToString(
//                [["M", [left, scale(d) + top]],["l", [-6,0]]]
//            ); });
//
//            tick.append("text")
//                .attr("x", left - 2)
//                .attr("y", function(d) { return scale(d) + top + scale.rangeBand() / 2; })
//                .attr("text-anchor", "end")
//                .attr("text", function(d) { return d;} )
//
//            var range = d3_scaleRange(scale);
//            console.log(range);
//            g.select("rect")
//                .append("path")
//                .attr("path", d3_raphael_pathArrayToString([["M", [left, range[0] + top]],["L",[left, range[1] + top]]]))
        })
    }

    /**
     * Get or set the associated scale. If scale is specified, sets the scale and returns the axis. If scale is not specified, returns the current scale which defaults to a linear scale.
     *
     * @param {d3.Scale} x scale
     * @return {D3RaphaelAxis} this
     *
     * @see <code><a href="https://github.com/mbostock/d3/wiki/SVG-Axes#wiki-axis_scale">d3.svg.axis().scale()</a></code>
     *
     * @function
     * @name D3RaphaelAxis#scale
     */
    axis.scale = function(x) {
        if (!arguments.length) return scale;
        scale = x;
        return axis;
    };

    /**
     * Get or set the axis orientation. If orientation is not specified, returns the current orientation, which defaults to "bottom".
     *
     * @param {String} x orientation, one of top, bottom, or left.  NOTE: right currently unsupported.  top/bottom for horizontal axis, and left for vertical.
     * @return {D3RaphaelAxis} this
     *
     * @see <code><a href="https://github.com/mbostock/d3/wiki/SVG-Axes#wiki-axis_orient">d3.svg.axis().orient()</a></code>
     *
     * @function
     * @name D3RaphaelAxis#orient
     */
    axis.orient = function(x) {
        if (!arguments.length) return orient;
        orient = x;
        return axis;
    };

    /**
     * TODO document
     *
     * @return {*}
     */
    axis.ticks = function() {
        if (!arguments.length) return tickArguments_;
        tickArguments_ = arguments;
        return axis;
    };

    /**
     * Get or set the size of major, minor and end ticks.
     *
     * @param {Number} x major tick size
     * @param {Number} y minor tick size (optional)
     * @param {Number} z end tick size (optional)
     * @return {D3RaphaelAxis} this
     *
     * @see <code><a href="https://github.com/mbostock/d3/wiki/SVG-Axes#wiki-axis_tickSize">d3.svg.axis().tickSize()</a></code>
     *
     * @function
     * @name D3RaphaelAxis#tickSize
     */
    axis.tickSize = function(x, y, z) {
        if (!arguments.length) return tickMajorSize;
        var n = arguments.length - 1;
        tickMajorSize = +x;
        tickMinorSize = n > 1 ? +y : tickMajorSize;
        tickEndSize = n > 0 ? +arguments[n] : tickMajorSize;
        return axis;
    };

    /**
     * Get or set the top offset for axis rendering.  This is a work-around for the fact Raphael doesn't have a group element.
     *
     * @param {Number} val top offset, in pixels
     * @return {D3RaphaelAxis} this
     *
     * @function
     * @name D3RaphaelAxis#top
     */
    axis.top = function(val) {
        if(typeof val === "undefined")
            return top;
        else
            top = val;

        return this;
    }

    /**
     * Get or set the left offset for the axis rendering.  This is a work-around for the fact Raphael doesn't have a group element.
     *
     * @param {Number} val left offset, in pixels
     * @return {D3RaphaelAxis} this
     *
     * @function
     * @name D3RaphaelAxis#left
     */
    axis.left = function(val) {
        if(typeof val === "undefined")
            return left;
        else
            left = val;

        return this;
    }

    /**
     * Get or set the class name prefix appended to the class names used to differentiate parts of the rendered axis.<br />
     * <br />
     * Class name suffixes used internally are:
     * <dl>
     *     <dt>path</dt>
     *     <dd>axis ticks</dd>
     *     <dt>pathdomain</dt>
     *     <dd>axis domain line (and end-ticks)</dd>
     * </dl>
     *
     * So, for example, if you specified a class name prefix <code>xaxis_</code>, you would want to specify CSS selectors, <code>.xaxis_path</code> and <code>.xaxis_pathdomain</code>
     *
     * @param {String} val
     * @return {D3RaphaelAxis} this
     *
     * @function
     * @name D3RaphaelAxis#classPrefix
     */
    axis.classPrefix = function(val) {
        if(typeof val === "undefined")
            return classPrefix;
        else
            classPrefix = val;

        return this;
    }

    return axis;
};