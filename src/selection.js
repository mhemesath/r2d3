var d3_raphael_selection = function(groups, d3_raphael_root) {
    d3_arraySubclass(groups, d3_raphael_selectionPrototype);
    groups.root = d3_raphael_root;

    return groups;
};

var d3_raphael_selectionPrototype = [];



/**
 * Appends an element of the specified primitive type for each of the
 * Raphael elements in the selection. <br />
 * <br />
 * NOTE: This method behaves similarly to the d3 version, except <strong>appended elements aren't children</strong>
 * of the selection's existing elements.  In Raphael, all elements are in a flat list, peer to eachother, a child of
 * the root containing element.
 *
 * @param {String} type
 * @return {D3RaphaelSelection} with each existing element replaced with a appended element of the specified type.
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-append">d3.selection.append()</a>
 * @see d3_raphael_paperShapes for a list of supported primitive types
 *
 * @name D3RaphaelSelection#append
 * @function
 */
d3_raphael_selectionPrototype.append = function(type) {
    var groups = [],
        group,
        nodeData;

    for(var j = 0; j < this.length; j++) {
        groups.push((group = []));

        for(var i = 0; i < this[j].length; i++) {
            if((nodeData = this[j][i])) {
                var newNode = this.root.create(type);

                if("__data__" in nodeData)
                    newNode.__data__ = nodeData.__data__;

                group.push(newNode);
            } else {
                group.push(null);
            }
        }
    }

    return d3_raphael_selection(groups, this.root);
}

/**
 * Manipulates the Raphael elements in this selection by changing the specified attribute to
 * the specified value.  <br/>
 * <br/>
 * Generally, it behaves similarly to the d3 version.  Like d3, the <code>value</code>
 * parameter can be a function to provide an attribute value specific to each elements of the selection.<br />
 * <br />
 * In addition to the attributes supported natively by Raphael, there are few additions:
 * <dl>
 *     <dt>d</dt><dd>is an alias for Raphael attribute <code>path</code>. (Intended for compatibility with existing d3 code)</dd>
 *     <dt>class</dt><dd>Sets the element's class name (like d3 does for the same attribute name)</dd>
 * </dl>
 *
 * @param {String} name Raphael attribute name
 * @param {value of function} value the value (or a function that returns the value) to change the attribute to
 * @return {D3RaphaelSelection} this
 *
 * @see <a href="http://raphaeljs.com/reference.html#Element.attr">Raphael.element.attr()</a>
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-attr">d3.selection.attr()</a>
 *
 * @function
 * @name D3RaphaelSelection#attr
 */
d3_raphael_selectionPrototype.attr = function(name, value) {
    var valueF = (typeof value === "function") ? value : function() { return value; };
    this.each(function() {
        var value = valueF.apply(this, arguments);

        switch(name) {
            case "class":
                this.addClass(value);
                break;
            default:
                this.attr(name, value);
        }

    });

    return this;
};

/**
 * Adds or removes the specified class name from the selections elements depending on the "truthness" of
 * value. <br />
 * <br />
 * NOTE: Only adding class names is supported now, you cannot remove a class name currently with this method.
 *
 * @param {String} name class name
 * @param {truthy or function} add
 * @return {D3RaphaelSelection} this
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-classed">d3.selection.classed()</a>
 *
 * @function
 * @name D3RaphaelSelection#classed
 */
d3_raphael_selectionPrototype.classed = function(name, add) {
    var addF = d3_raphael_functify(add);

    this.each(function() {
        if(addF.apply(this, arguments))
            this.addClass(name);
        else
            throw_raphael_not_supported();
    })

    return this;
}


/**
 * Changes the text of the selection's <code>text</code> elements. <br />
 * <br />
 * NOTE: <strong>This version behaves differently than the native d3 version,</strong> which changes the text content of the
 * selection's DOM elements.
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-_text">d3.selection.text()</a>
 *
 * @param value
 * @return {D3RaphaelSelection} this
 *
 * @function
 * @name D3RaphaelSelection#text
 */
d3_raphael_selectionPrototype.text = function(value) {
    var valueF = d3_raphael_functify(value);

    this.each(function() {
        this.attr("text", valueF.apply(this, arguments));
    });

    return this;
}

/**
 * Performs a selection testing _all_ the elements in the Raphael paper that match the specified type, returning a new selection
 * with only the first element found (if any). <br />
 * <br />
 * NOTE: <strong>This method behaves differently than the native d3 version.</strong>  Since the Raphael paper
 * is inherently a flat list of elements, there is no concept of a selection that is scoped by it's parent element
 * (like in d3).  Thus, every call to <code>select</code> searches on all elements in the paper, regardless of the
 * existing content of the selection. <br />
 * <br />
 * NOTE: Currently, the selector string is limited in features.  Right now, you can only specify the Raphael primitive
 * type name you want to select, no other selector strings are supported (like css class name).
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-d3_select">d3.select()</a>
 * @see d3_raphael_paperShapes for a list of supported primitive types
 *
 * @param {String} type Raphael primitive type name
 * @return {D3RaphaelSelection} the new selection.
 *
 * @function
 * @name D3RaphaelSelection#select
 */
d3_raphael_selectionPrototype.select = function(type) {
    return this.root.select(type);
};

/**
 * Performs a selection testing _all_ the elements in the Raphael paper that match the specified type, returning a new selection
 * with the found elements (if any).<br />
 * <br />
 * NOTE: <strong>This method behaves differently than the native d3 version.</strong>  Since the Raphael paper
 * is inherently a flat list of elements, there is no concept of a selection that is scoped by it's parent element
 * (like in d3).  Thus, every call to <code>select</code> searches on all elements in the paper, regardless of the
 * existing content of the selection. <br />
 * <br />
 * NOTE: Currently, the selector string is limited in features.  Right now, you can only specify the Raphael primitive
 * type name you want to select, no other selector strings are supported (like css class name).
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-d3_selectAll">d3.selectAll()</a>
 * @see d3_raphael_paperShapes for a list of supported primitive types
 *
 * @param {String} type Raphael primitive type name
 * @return {D3RaphaelSelection} the new selection.
 *
 * @function
 * @name D3RaphaelSelection#selectAll
 */
d3_raphael_selectionPrototype.selectAll = function(type) {
    return this.root.selectAll(type);
};


/**
 * Iterate over the elements of the selection, executing the specified function. <br />
 * <br />
 * NOTE: This method iterates over the Raphael created wrapper element (which internally contains the native DOM element,
 * either SVG or VML via <code>element.node</code>.
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-each">d3.selection.each()</a>
 * @see <a href="http://raphaeljs.com/reference.html#Element">Raphael.Element</a>
 *
 * @param {function} callback <code>function(datum, index) { // this is the Raphael element }</code>
 *
 *  @function
 *  @name D3RaphaelSelection#each
 */
d3_raphael_selectionPrototype.each = d3_selectionPrototype.each;

/**
 * Returns true if the current selection is empty.
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-empty">d3.selection.empty()</a>
 *
 * @function
 * @name D3RaphaelSelection#empty
 */
d3_raphael_selectionPrototype.empty = d3_selectionPrototype.empty;

/**
 * Returns the first non-null element in the current selection. If the selection is empty, returns null.
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-node">d3.selection.node()</a>
 *
 * @function
 * @name D3RaphaelSelection#node
 */
d3_raphael_selectionPrototype.node = d3_selectionPrototype.node;

/**
 * Sets arbitrary properties on the selections Raphael elements.
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-property">d3.selection.property()</a>
 * @see <a href="http://raphaeljs.com/reference.html#Element">Raphael.Element</a>
 *
 * @param {String} name property name
 * @param value property value
 * @return {D3RaphaelSelection} this
 *
 * @function
 * @name D3RaphaelSelection#property
 */
d3_raphael_selectionPrototype.property = d3_selectionPrototype.property;

/**
 * Invokes the specified function once, passing in the current selection along with any optional arguments. The call operator always returns the current selection, regardless of the return value of the specified function.
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-call">d3.selection.call()</a>
 *
 * @param {function} func
 * @param {*} arguments optional arguments to pass to the function
 *
 * @function
 * @name D3RaphaelSelection#call
 */
d3_raphael_selectionPrototype.call = d3_selectionPrototype.call;


/**
 * Gets or sets the bound data for each selection element.
 *
 * @see <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-datum">d3.selection.datum()</a>
 *
 * @param {Array} value
 * @return {D3RaphaelSelection} this
 *
 * @function
 * @name D3RaphaelSelection#datum
 */
    d3_raphael_selectionPrototype.datum = d3_selectionPrototype.datum;

d3_raphael_selectionPrototype.style = throw_raphael_not_supported;
d3_raphael_selectionPrototype.html = throw_raphael_not_supported;
d3_raphael_selectionPrototype.insert = throw_raphael_not_supported;
d3_raphael_selectionPrototype.filter = d3_selectionPrototype.filter;
d3_raphael_selectionPrototype.sort = throw_raphael_not_supported;
d3_raphael_selectionPrototype.order = throw_raphael_not_supported;
d3_raphael_selectionPrototype.transition = d3_selectionPrototype.transition;
