function d3_raphael_type_selector(selector, d3_paper, first) {
    var typeMatch = /^[a-zA-Z]+/,
        type = typeMatch.exec(selector),
        found = [];
    
    selector = selector.replace(typeMatch, '');

    d3_paper.forEach(function(el) {
        if(!type || el.type === type) {
          if (selector === '') {
            found.push(el);
          } else if (Sizzle.matchesSelector(el.node, selector)) {
            found.push(el);
          }
          return !first; // break forEach for first only requests
        }
    });

    return found;
}
