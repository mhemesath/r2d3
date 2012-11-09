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
		var el = createGNode("group"),
				skew = createGNode("skew");
    skew.on = true;
		el.appendChild(skew);
    var res = Raphael.st;
    res.attrs = {};
    res.type = "group";
		var p = new Raphael.st.constructor(el, paper);
    res.node = p.node;
    res.items = [];
    res.length = 0;
		paper.canvas.appendChild(el);
    p.skew = skew;
		p.transform("");
		return p; 
};
Raphael._engine.group = function(paper) {
	var el = $("g");
	paper.canvas && paper.canvas.appendChild(el);
  var res = Raphael.st;
  res.attrs = {};
  res.type = "group";
  var n = new Raphael.st.constructor(el, paper);
  res.node = n.node;
  res.items = [];
  res.length = 0;
	$(el, res.attrs);
	return res;
};
Raphael.fn.g = Raphael.fn.group = function() {
	var out = Raphael.vml ? Raphael._engine.group_vml(this) : Raphael._engine.group(this);
	return out;
};
