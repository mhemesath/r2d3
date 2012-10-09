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




/**
    var r = this,
        cfg = (arguments[0] instanceof Array) ? {} : arguments[0],
        items = (arguments[0] instanceof Array) ? arguments[0] : arguments[1];
    
    function Group(cfg, items) {
        var inst,
            set = r.set(items),
            group = r.raphael.vml ? 
                document.createElement("group") : 
                document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        r.canvas.appendChild(group);
        
        function updateScale(transform, scale) {
            var scaleString = 'scale(' + scale + ')';
            if (!transform) {
                return scaleString;
            }
            if (transform.indexOf('scale(') < 0) {
                return transform + ' ' + scaleString;
            }
            return transform.replace(/scale\(-?[0-9]+(\.[0-9][0-9]*)?\)/, scaleString);
        }
        
        function updateRotation(transform, rotation) {
            var rotateString = 'rotate(' + rotation + ')';
            if (!transform) {
                return rotateString;
            }
            if (transform.indexOf('rotate(') < 0) {
                return transform + ' ' + rotateString;
            }
            return transform.replace(/rotate\(-?[0-9]+(\.[0-9][0-9]*)?\)/, rotateString);
        }
        
        inst = {
            scale: function (newScale) {
                var transform = group.getAttribute('transform');
                group.setAttribute('transform', updateScale(transform, newScale));
                return this;
            },
            rotate: function(deg) {
                var transform = group.getAttribute('transform');
                group.setAttribute('transform', updateRotation(transform, deg));
            },
            push: function(item) {
                function pushOneRaphaelVector(it){
                    var i;
                    if (it.type === 'set') {
                        for (i=0; i< it.length; i++) {
                            pushOneRaphaelVector(it[i]);
                        }
                    } else {
                        group.appendChild(r.raphael.vml? it.node.parentNode : it.node);
                        set.push(it);
                    }
                }
                pushOneRaphaelVector(item);
                return this;
            },
            getBBox: function() {
                return set.getBBox();
            },
            type: 'group',
            node: group
        };
                
        return inst;
    }
    
    return Group(cfg, items);

};
*/
