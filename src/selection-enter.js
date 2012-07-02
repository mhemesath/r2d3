function d3_raphael_enterSelection(groups, d3_raphael_root) {
    d3_arraySubclass(groups, d3_raphael_enterSelectionPrototype);
    groups.root = d3_raphael_root;

    return groups;
}

var d3_raphael_enterSelectionPrototype = [];

/**
 * See {@link D3RaphaelSelection#append}
 *
 * @param {string} type
 * @return {D3RaphaelEnterSelection} this
 *
 * @see <code><a href="https://github.com/mbostock/d3/wiki/Selections#wiki-append">d3.selection.append()</a></code>
 *
 * @function
 * @name D3RaphaelEnterSelection#append
 */
d3_raphael_enterSelectionPrototype.append = function(type) {
    if(d3_raphael_paperShapes.indexOf(type) < 0)
        throw TypeError("Type Not Supported");

    var groups = [],
        group,
        upgroup, // tricky!
        nodeData;

    for(var j = 0; j < this.length; j++) {
        groups.push((group = []));
        upgroup = this[j].update; // upgroup is the enter selection's corresponding update selection

        for(var i = 0; i < this[j].length; i++) {
            if((nodeData = this[j][i])) {
                var newNode = this.root[type]();

                if("__data__" in nodeData)
                    newNode.__data__ = nodeData.__data__;

                group.push(newNode);
                upgroup[i] = newNode; // adds the new node to the update selection
            } else {
                group.push(null);
            }
        }
    }

    return d3_raphael_selection(groups, this.root);
};

/**
 * See {@link D3RaphaelSelection#empty}
 *
 * @see <code><a href="https://github.com/mbostock/d3/wiki/Selections#wiki-empty">d3.selection.empty()</a></code>
 *
 * @function
 * @name D3RaphaelEnterSelection#empty
 */
d3_raphael_enterSelectionPrototype.empty = d3_selectionPrototype.empty;

/**
 * See {@link D3RaphaelSelection#node}
 *
 * @see <code><a href="https://github.com/mbostock/d3/wiki/Selections#wiki-node">d3.selection.node()</a></code>
 *
 * @function
 * @name D3RaphaelEnterSelection#node
 */
d3_raphael_enterSelectionPrototype.node = d3_selectionPrototype.node;

d3_raphael_enterSelectionPrototype.insert = throw_raphael_not_supported;



