/* Raphael Duplication begin */
var createGNode = function(tagName) {
	var doc = Raphael._g.win.document;
	return doc.createElement('<rvml:' + tagName + ' class="rvml">');
};
var $ = function (el, attr) {
	if (attr) {
			if (typeof el == "string") {
					el = $(el);
			}
			for (var key in attr) if (attr[has](key)) {
					if (key.substring(0, 6) == "xlink:") {
							el.setAttributeNS(xlink, key.substring(6), Str(attr[key]));
					} else {
							el.setAttribute(key, Str(attr[key]));
					}
			}
	} else {
			el = Raphael._g.doc.createElementNS("http://www.w3.org/2000/svg", el);
			el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
	}
	return el;
};
/*
var setGAttrs = function(o, params) {
	o.attrs = o.attrs || {};
	var node = o.node,
			a = o.attrs,
			s = node.style;
	for (var par in params) if (params["hasOwnProperty"](par)) {
		a[par] = params[par];
  }
	"transform" in params && Raphael.el.transform(params.transform);
};
*/
/* Raphael Duplication end */

Raphael._engine.group_vml = function(paper) {
		var el = createGNode("group"),
				p = new Raphael.el.constructor(el, paper);
		p.shape = el;
		p.type = "group";
		paper.canvas.appendChild(el);
		var skew = createGNode("skew");
    skew.on = true;
		el.appendChild(skew);
    p.skew = skew;
		p.transform("");
		return p; 
};
Raphael._engine.group = function(paper) {
	var el = $("g");
	paper.canvas && paper.canvas.appendChild(el);
	var res = new Raphael.el.constructor(el, paper);
	res.attrs = {};
	res.type = "group";
	$(el, res.attrs);
	return res;
};
Raphael.fn.g = Raphael.fn.group = function() {
	var out = Raphael.vml ? Raphael._engine.group_vml(this) : Raphael._engine.group(this);
	out.appendChild = function(node) { 
		// Give the node to raphael to render
  	var el = this.paper.appendChild(node);
  	this.node.appendChild(el.node);
  	return el;
	};
	return out;
};
