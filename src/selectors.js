function d3_raphael_type_selector(type, d3_paper, first) {
    var found = [];

    d3_paper.forEach(function(el) {
        if(el.type === type) {
            found.push(el);

            return !first; // break forEach for first only requests
        }
    })

    return found;
};