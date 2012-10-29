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
/* Raphael Duplication end */

Raphael._engine.group_vml = function(paper) {
		var el = createGNode("shape"),
				skew = createGNode("skew");
    skew.on = true;
		el.style.cssText = "position:absolute;left:0;top:0;width:1px;height:1px";
		el.coordorigin = paper.coordorigin;
		el.appendChild(skew);
		var p = new Raphael.el.constructor(el, paper);
		p.type = "group";
		p.path = [];
		p.Path = "";
		paper.canvas.appendChild(el);
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
		if (Raphael.vml) {
			// Apply transforms if any
			if (this.attr("transform").length != 0) {
				var tS = this.attr("transform")[0].toString().replace("t,", "t");
				el.transform(this.attr("transform").toString());
			}
		}
  	this.node.appendChild(el.node);

  	return el;
	};
	return out;
};
