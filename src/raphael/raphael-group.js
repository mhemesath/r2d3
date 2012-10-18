/* Raphael Duplication begin */
var createNode = function(tagName) {
	var doc = Raphael._g.win.document;
	try {
  	!doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
		return doc.createElement('<rvml:' + tagName + ' class="rvml">');
	} catch (e) {
		return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
  }
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

Raphael._engine.group = function(paper) {
	if (Raphael.vml) {
		var el = createNode("group"),
		p = new Raphael.el.constructor(el, paper);
		var skew = createNode("skew");
    skew.on = true;
    el.appendChild(skew);
    p.skew = skew;
		paper.canvas.appendChild(el);
		return p; 
	}
	var el = $("g");
	paper.canvas && paper.canvas.appendChild(el);
	var res = new Raphael.el.constructor(el, paper);
	res.attrs = {};
	res.type = "group";
	$(el, res.attrs);
	return res;
};
Raphael.fn.g = Raphael.fn.group = function() {
	var out = Raphael._engine.group(this);
	out.appendChild = function(node) { 
		// Give the node to raphael to render
  	var el = this.paper.appendChild(node);
  	this.node.appendChild(el.node);
  	return el;
	};
	return out;
};
