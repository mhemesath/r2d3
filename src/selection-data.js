// todo: see if it is possible to generalize this method from the almost identical one in d3

/**
 * Binds the provided data to the selected Raphael element(s). <br />
 * <br />
 * IMPLEMENTATION NOTE: Usage identical to the native d3 version, except internally, instead of binding the data to the DOM objects (like d3 does),
 * the data is bound to the Raphael wrapper element(s) of the DOM.
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-data">d3.selection.data()</a>
 * @param value
 * @param {function} key_function
 * @return {D3RaphaelUpdateSelection}
 *
 * @function
 * @name D3RaphaelSelection#data
 */
d3_raphael_selectionPrototype.data = function(value, key_function) {
    var i = -1,
        n = this.length,
        group,
        node;

    // If no value is specified, return the first value.
    if (!arguments.length) {
        value = new Array(n = (group = this[0]).length);
        while (++i < n) {
            if (node = group[i]) {
                value[i] = node.__data__;
            }
        }
        return value;
    }

    function bind(group, groupData) {
        var i,
            n = group.length,
            m = groupData.length,
            n0 = Math.min(n, m),
            n1 = Math.max(n, m),
            updateNodes = [],
            enterNodes = [],
            exitNodes = [],
            node,
            nodeData;

        if (key_function) {
            var nodeByKeyValue = new d3_Map,
                keyValues = [],
                keyValue,
                j = groupData.length;

            for (i = -1; ++i < n;) {
                keyValue = key_function.call(node = group[i], node.__data__, i);
                if (nodeByKeyValue.has(keyValue)) {
                    exitNodes[j++] = node; // duplicate key
                } else {
                    nodeByKeyValue.set(keyValue, node);
                }
                keyValues.push(keyValue);
            }

            for (i = -1; ++i < m;) {
                keyValue = key_function.call(groupData, nodeData = groupData[i], i)
                if (nodeByKeyValue.has(keyValue)) {
                    updateNodes[i] = node = nodeByKeyValue.get(keyValue);
                    node.__data__ = nodeData;
                    enterNodes[i] = exitNodes[i] = null;
                } else {
                    enterNodes[i] = d3_selection_dataNode(nodeData);
                    updateNodes[i] = exitNodes[i] = null;
                }
                nodeByKeyValue.remove(keyValue);
            }

            for (i = -1; ++i < n;) {
                if (nodeByKeyValue.has(keyValues[i])) {
                    exitNodes[i] = group[i];
                }
            }
        } else {
            for (i = -1; ++i < n0;) {
                node = group[i];
                nodeData = groupData[i];
                if (node) {
                    node.__data__ = nodeData;
                    updateNodes[i] = node;
                    enterNodes[i] = exitNodes[i] = null;
                } else {
                    enterNodes[i] = d3_selection_dataNode(nodeData);
                    updateNodes[i] = exitNodes[i] = null;
                }
            }
            for (; i < m; ++i) {
                enterNodes[i] = d3_selection_dataNode(groupData[i]);
                updateNodes[i] = exitNodes[i] = null;
            }
            for (; i < n1; ++i) {
                exitNodes[i] = group[i];
                enterNodes[i] = updateNodes[i] = null;
            }
        }

        enterNodes.update
            = updateNodes;

        enterNodes.parentNode
            = updateNodes.parentNode
            = exitNodes.parentNode
            = group.parentNode;

        enter.push(enterNodes);
        update.push(updateNodes);
        exit.push(exitNodes);
    }

    var enter = d3_raphael_enterSelection([], this.root),
        update = d3_raphael_selection([], this.root),
        exit = d3_raphael_selection([], this.root);

    if (typeof value === "function") {
        while (++i < n) {
            bind(group = this[i], value.call(group, group.parentNode.__data__, i));
        }
    } else {
        while (++i < n) {
            bind(group = this[i], value);
        }
    }

    /**
     * Returns the entering selection: placeholder nodes for each data element for which no corresponding existing DOM element was found in the current selection.
     *
     * @return {D3RaphaelEnterSelection}
     *
     * @see <code><a href="https://github.com/mbostock/d3/wiki/Selections#wiki-enter">d3.selection.enter()</a></code>
     *
     * @function
     * @name D3RaphaelUpdateSelection#enter
     */
    update.enter = function() { return enter; };

    /**
     * Returns the exiting selection: existing DOM elements in the current selection for which no new data element was found.
     *
     * @return {D3RaphaelSelection}
     *
     * @see <code><a href="https://github.com/mbostock/d3/wiki/Selections#wiki-exit">d3.selection.exit()</a></code>
     *
     * @function
     * @name D3RaphaelUpdateSelection#exit
     */
    update.exit = function() { return exit; };
    return update;
};
