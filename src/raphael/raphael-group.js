function Group(paper) {
  this.paper = paper;
  this.attrs = {};
  this.className = '';
  this.node = Raphael.vml ?
    document.createElement('<rvml:group class="rvml">') :
    document.createElementNS('http://www.w3.org/2000/svg', 'g');
  this.paper.canvas.appendChild(this.node);

  this.paper.groups.push(this);
}

Group.prototype.node = function() {
  return this.node;
};

Group.prototype.remove = function() {
  this.set.clear();
  this.paper.canvas.removeChild(this.node);
  this.paper.groups.splice(this.paper.groups.indexOf(this), 1);
};

Group.prototype.getElementsByTagName = function(tag) {
  return this.set.getElementsByTagName(tag);
};


Group.prototype.setAttribute = function(name, value) {
  this.attrs[name] = value;
  if (name === 'className') {
    this.className = value;
    paperClassedAdd(this.node, value);
  } else if (name === 'transform') {
    // Build a transform matrix
    if (true || Raphael.vml) {
      var transforms = Raphael.parseTransformString(value),
          matrix = Raphael.matrix();
      for (var i=0; i< transforms.length; i++) {
        switch(transforms[i][0]) {
          case "t":
            matrix.translate.apply(matrix, transforms[i].slice(1));
            break;
          case "r":
            matrix.rotate.apply(matrix, transforms[i].slice(1));
            break;
          case "s":
            matrix.scale.apply(matrix, transforms[i].slice(1));
            break;
        }
      }
      this.node.coordorigin = matrix.x(0, 0) + " " + matrix.y(0, 0);
    // Let SVG Handle the transform
    } else {
      this.node.setAttribute(name, value);
    }
  }
};

Group.prototype.getAttribute = function(name) {
  return this.attrs[name] || '';
};

Group.prototype.removeAttribute = function(name) {
  delete this.attrs[name];
};


Group.prototype.tagName = Raphael.vml ? 'rvml:group' : 'g';

Group.prototype.type = 'g';

Group.prototype.appendChild = function(node) {
  // Give the node to raphael to render
  var el = this.paper.appendChild(node);
  this.node.appendChild(Raphael.vml ? el.node : el.node);
  return el;
};

Raphael.fn.g = function() {
  return new Group(this);
};